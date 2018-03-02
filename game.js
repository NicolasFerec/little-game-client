$(document).ready(function() {

	var socket = io('app-82a28a5b-cfcf-4454-a09b-d95fa822b8a4.cleverapps.io');

	socket.on('connect', function(data){
		console.log('Welcome on board');
	});

	socket.on('map', function(data){
		drawMap(data);
	});

	socket.on('players', function(data){
		drawPlayers(data);
	});

	var tileWidth = 0;
	var tileHeight = 0;

	var drawMap = function(map){
		tileWidth = $('#game').width() / map[0].length;
		tileHeight = $('#game').height() / map.length;

		$('#game').html('');

		map.forEach(function(mapY, y){
			mapY.forEach(function(mapX, x){
				var type = '';
				switch(mapX){
					case 0:
						type = 'wall';
						break;
					case 1:
						type = 'grass';
						break;
				}
				var tile = $('<div class="tile '+type+'" data-x="'+x+'" data-y="'+y+'"></div>');
				tile.css({
					top: y*tileHeight,
					bottom: (y*tileHeight)+tileHeight,
					left: x*tileWidth,
					right: (x*tileHeight)+tileWidth,
					width: tileWidth,
					height: tileHeight
				});
				$('#game').append(tile);
			})
		});
	}

	var drawPlayers = function(players){
		$('#game').find('.player').remove();

		players.forEach(function(player){
			var playerElem = $('<div class="player" id="'+player.id+'" data-x="'+player.x+'" data-y="'+player.y+'"></div>');
			playerElem.css({
				top: player.y*tileHeight,
				bottom: (player.y*tileHeight)+tileHeight,
				left: player.x*tileWidth,
				right: (player.x*tileHeight)+tileWidth,
				width: tileWidth,
				height: tileHeight
			});
			$('#game').append(playerElem);
		});

		$('#logs').html('<p>'+JSON.stringify(players)+'</p>');
	}

	$(document).on('keypress', function(e){
		e.preventDefault();
		switch(e.key){
			case 'z':
				socket.emit('moveUp');
				break;
			case 's':
				socket.emit('moveDown');
				break;
			case 'q':
				socket.emit('moveLeft');
				break;
			case 'd':
				socket.emit('moveRight');
				break;
		}
	});

	$('#disconnect').click(function(){
		socket.disconnect();
	});

});