var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

//~ var redis = require("redis"),
        //~ client = redis.createClient();

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('secret'));
    app.use(express.session());
    app.use(passport.initialize());
	app.use(passport.session()); 
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

mongoose.connect('mongodb://localhost/users');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    id    : ObjectId
  , username     : String
  , password      : String
  , level      : Number
  , experience : Number
  , health : Number
  , attack : Number
  , defence : Number
});

UserSchema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};

var User = mongoose.model('User', UserSchema);

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      //~ client.set("username", user.username);
      //~ client.set("level", user.level);
      //~ client.set("experience", user.experience);
      //~ client.set("health", user.health);
      //~ client.set("attack", user.attack);
      //~ client.set("defence", user.defence);
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/game', function (req, res) {
	//~ console.log(req.session.passport.user);
	if(!req.session.passport.user) {
		res.redirect('/login');
	} else {
		User.findOne({ _id: ObjectId(req.session.passport.user) } , function(err, user) {
			if (err) { return done(err); }
			//console.log(user.username);
			res.render('index', {
				title: 'RPG Game'
			});
		});
	}
});

app.get('/login', function (req, res) {
    res.render('login', {
        title: 'RPG Game'
    });
});

app.get('/register', function (req, res) {
    res.render('register', {
        title: 'RPG Game'
    });
});

app.post('/login', passport.authenticate('local', { 
	successRedirect: '/game',
	failureRedirect: '/login'
}));

app.post('/register', function (req, res) {
	var usr = new User();
	usr.username = req.body.username;
	usr.password = req.body.password;
	usr.level = 1;
	usr.experience = 0;
	usr.health = 100;
	usr.attack = 10;
	usr.defence = 10;
	usr.save();
	res.redirect('/login');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Serwer nasłuchuje na porcie " + app.get('port'));
});
