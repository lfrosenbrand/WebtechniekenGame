// JavaScript Document

var Player = { "x":0, "y":0, "hp":100, "level":1, "xp":0, "ax":0, "ay":8, "w":32, "h":32, "name":"Jan" };
var Resolution = { "x":0, "y":0, "w":480, "h":320, "tw":32, "th":32 };

var World = [[0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 1, 2, 0, 0, 0, 0], [0, 0, 1, 0, 0, 3, 0, 0, 0], [0, 0, 2, 0, 1, 0, 0, 0, 0]];
var Resources =[{"x":12, "y":7, "width":32, "height":32}, {"x":19, "y":7, "width":32, "height":32}, {"x":17, "y":10, "width":32, "height":32}, { "name":"king", "ax":0, "ay":0, "w":32, "h":32 }];

var start = new Date();
var playedThaSound = false;

function drawWorld(timestamp)
{
	//var progress = timestamp - start;
	//start = new Date();
	
	//var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	//console.log('drawing scene');
	context.clearRect (Resolution.x , Resolution.y , Resolution.w , Resolution.h);
	var yi, xi;
	for(y=0; y<10; y++){
		yi = y + Player.y;
		yi = (yi < 0 ? (World.length + yi) : (yi % World.length));
		var row = World[yi];
		//console.log(row);
		for(x=0; x<15; x++){
			xi = x + Player.x;
			xi = (xi < 0 ? (row.length + xi) : (xi % row.length));
			var v = row[xi];
			var r = Resources[v];
			if(r.name)
			{
				context.drawImage(document.getElementById(r.name), (r.ax * Resolution.tw), (r.ay * Resolution.th), r.w, r.h, (x * Resolution.tw), (y * Resolution.th), r.w, r.h);
				r.ax = (r.ax == 1 ? 0 : 1);
				if(x == 4 && y == 2)
				{
					if(!playedThaSound)
					{
						kingSpeech.play();
						playedThaSound = true;
					}
				}
			}
			else
			{
				//console.log(img, (r.x * Resolution.tw), (r.y * Resolution.th), r.width, r.height, (x * Resolution.tw), (y * Resolution.th), r.width, r.height);
				context.drawImage(tilemap, (r.x * Resolution.tw), (r.y * Resolution.th), r.width, r.height, (x * Resolution.tw), (y * Resolution.th), r.width, r.height);
			}
		}
	}
	context.drawImage(player, (Player.ax * Resolution.tw), (Player.ay * Resolution.th), Player.w, Player.h, (Resolution.w *0.25), 50, Resolution.tw, Resolution.th );
	requestAnimationFrame(drawWorld);
}

function doLogic()
{
	//console.log('thinking');
	if(Player.xp > 100)
	{
		levelUp();
	}
}

function levelUp()
{
	Player.xp = Player.xp - 100;
	Player.level++;
	document.getElementById('player').src = 'player'+Player.level+'.png';
}

function startDrawing()
{
	console.log('Initiating drawing' );
	
 	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  	window.requestAnimationFrame = requestAnimationFrame;
	requestAnimationFrame(drawWorld);
	
	console.log('starting AI');
	window.setInterval(function() {
		doLogic();
	}, 1000/30);
}

function bindEvents()
{
	console.log('binding events');
	window.onkeydown=function(e){
		//console.log(e);
		switch(e.keyCode)
		{
			case 38: {
				Player.y--;
				Player.ay = 7;
				Player.ax++;
				Player.ax %= 4;
				break;
			}
			case 40: {
				Player.y++;
				Player.ay = 10;
				Player.ax++;
				Player.ax %= 4;
				break;
			}
			case 37: {
				Player.x--;
				Player.ay = 1;
				Player.ax++;
				Player.ax %= 4;
				break;
			}
			case 39: {
				Player.x++;
				Player.ay = 4;
				Player.ax++;
				Player.ax %= 4;
				break;
			}
			default: {
				break;
			}
		}
		var yi = (Player.y < 0 ? (World.length + Player.y) : (Player.y % World.length));
		Player.y = yi;
		var xi = (Player.x < 0 ? (World[0].length + Player.x) : (Player.x % World[0].length));
		Player.x = xi;
		playedThaSound = false;
	};
}

function startGame()
{
	Player.name = playerName.value;
	localStorage.currentPlayerName = Player.name;
	loadGame(Player.name);
	bindEvents();
	startDrawing();	
}

function startMenu()
{
	if(localStorage.currentPlayerName != undefined && localStorage.currentPlayerName != null)
	{
		playerName.value = localStorage.currentPlayerName;
	}
	var url = window.location.href;
	var idx = url.indexOf('#');
	if(idx > 0)
	{
		var qs = url.slice(idx);
		if(qs.indexOf('GameScreen') > 0)
		{
			startGame();
		}
	}
}

function saveGame(playerName)
{
	if(localStorage)
	{
		if(typeof playerName != 'string') playerName = Player.name;
		localStorage.setItem(playerName, JSON.stringify(Player));
	}
	else
	{
		alert('unable to save game');
	}
}

function loadGame(playerName)
{
	if(localStorage)
	{
		if(typeof playerName != 'string') playerName = Player.name;
		if(localStorage.getItem(playerName))
		{
			Player = JSON.parse(localStorage.getItem(playerName));
			console.log(Player);
		}
		else
		{
			console.log('no savegame for: "' + playerName +'"');
		}
	}
	else
	{
		alert('unable to save game');
	}
}

function showAbout()
{
	$.colorbox({inline:true, href:"#dialog-about"});
}

function showSettings()
{
	$.colorbox({inline:true, href:"#dialog-settings"});
}