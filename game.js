function Game(gameview) {
	this.gameview = gameview;
	this.ctx = gameview.getContext('2d');
	this.tileWidth = 128;
	this.tileHeight = 64;
	this.init();
}

Game.prototype.init = function(){
	var that = this;

	this.socket = io('little-game-server.cleverapps.io');

	this.socket.emit('getMap');

	this.socket.on('map', function(map){
		that.setMap(map);
	});

	this.socket.on('players', function(players){
		that.setPlayers(players);
	});

	this.loadImages();

	document.onkeydown = function(e) {
	    e = e || window.event;
	    e.preventDefault();
	    switch(e.which) {
	        case 37:
	        	that.moveLeft();
	        	break;
	        case 38:
	        	that.moveUp();
	        	break;
	        case 39:
	        	that.moveRight();
	        	break;
	        case 40:
	        	that.moveDown();
	        	break;
	        default: return;
	    }
	};

	this.gameLoop = setInterval(function(){
		that.socket.emit('getPlayers');
		that.redrawWorld();
	}, 33);
}

Game.prototype.redrawWorld = function(){
	if(this.grassImageLoaded && this.playerImageLoaded){
		this.ctx.clearRect(0, 0, this.gameview.width, this.gameview.height);
		this.drawMap();
		this.drawPlayers();
	}
}

Game.prototype.setMap = function(map){
	this.map = map;
}

Game.prototype.setPlayers = function(players){
	this.players = players;
}

Game.prototype.loadImages = function(){
	var that = this;

	that.grassImageLoaded = false;
	that.grass = new Image();
	that.grass.src = 'grass.png';
	that.grass.onload = function(){
		that.grassImageLoaded = true;
	}

	that.playerImageLoaded = false;
	that.playerImage = new Image();
	that.playerImage.src = 'player.png';
	that.playerImage.onload = function(){
		that.playerImageLoaded = true;
	}
}

Game.prototype.drawMap = function(){
	var that = this;

	var posX = 0;
	var posY = 0;

	for (var y = 0 ; y < that.map.length; y++) {
		var offsetX = 0;
		if(y%2)
			offsetX = that.tileWidth / 2;

		for (var x = 0 ; x < that.map[y].length; x++) {
			posX = (x * that.tileWidth) + offsetX;
			posY = y * that.tileHeight / 2;

			switch(that.map[y][x]){
				case 0:
					that.ctx.drawImage(that.grass, posX, posY, that.tileWidth, that.tileHeight);
					that.ctx.fillText(x+', '+y, posX+(that.tileWidth/2-7), posY+(that.tileHeight/2+3));
					break;
			}
		}
	}
}

Game.prototype.drawPlayers = function(){
	var that = this;

	that.players.forEach(function(player){
		
		var offsetX = 0;
		if(player.y%2)
			offsetX = that.tileWidth / 2;

		var posX = player.x*that.tileWidth+offsetX;
		var posY = player.y*that.tileHeight / 2;
		that.ctx.drawImage(that.playerImage, posX, posY, that.tileWidth, that.tileHeight);

	});
}

Game.prototype.moveLeft = function(){
	this.socket.emit('moveLeft');
}

Game.prototype.moveUp = function(){
	this.socket.emit('moveUp');
}

Game.prototype.moveRight = function(){
	this.socket.emit('moveRight');
}

Game.prototype.moveDown = function(){
	this.socket.emit('moveDown');
}






