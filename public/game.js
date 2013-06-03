/*window.onload = function () {
   enchant();
   var game = new Game(320, 320); game.preload('chara0.gif');
   game.onload = function() {
	  var label = new Label("tsdvsdvsdvsdvest");
      var scene = new Scene();
      var sprite = new Sprite(32, 32);
      sprite.image = game.assets['chara0.gif'];
      scene.addChild(sprite);
      game.pushScene(scene);
   };
   game.start();
};*/

window.onload = function () { 
	enchant(); 
	var game = new Game(520, 520); 
	game.onload = function () { 
		var scene = new Scene(); 
		var label = new Label("test2"); 
		var label2 = new Label("test2"); 
		scene.addChild(label); 
		scene.addChild(label2); 
		scene.backgroundColor = 'red';
		game.pushScene(scene); 
	}; 
	game.start();
};

