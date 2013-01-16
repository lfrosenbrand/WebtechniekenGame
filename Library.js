// JavaScript Document

var Player = { "x":0, "y":0, "hp":100, "level":1, "xp":0, "ax":0, "ay":8, "w":32, "h":32, "name":"Jan", inventory:[], "moved":true };
var Resolution = { "x":0, "y":0, "w":480, "h":320, "tw":32, "th":32 };

var Quests = [ { "name":"Flowah Powah!", "type":"collect", "item_id":1, "count":4, "isStarted":false, "isCompleted":false, "description":"Ohnoez! We dun lost teh flowahs! Plx gief dem bak to da king!", "hint":"U dun haf enuf flowahs, plx get moar!", "complete":"ktnxbai", "xp":100 } ];

var World = [ [0, 0, 0, 0, 2, 0, 0, 0, 0]
			, [0, 0, 0, 1, 0, 0, 0, 0, 0]
			, [0, 0, 0, 1, 2, 0, 0, 0, 0]
			, [0, 0, 1, 0, 0, 3, 0, 0, 0]
			, [0, 0, 2, 0, 1, 0, 0, 0, 0]
			];
			
var Resources =[  {"x":12, "y":7, "width":32, "height":32}			//Grass
				, {"x":19, "y":7, "width":32, "height":32}			//Flower
				, {"x":17, "y":10, "width":32, "height":32}			//Rock
				, { "name":"king", "ax":0, "ay":0, "w":32, "h":32 }	//King
			];
			
var start = new Date();

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
					if(Player.moved)
					{
						var quest = Quests[0];
						if(Player.inventory[quest.item_id] >= quest.count)
						{
							quest.isCompleted = true;
							Player.inventory[quest.item_id] = null;
							
							//$('#dialog-alert .text').html(quest.complete);
							//$.colorbox({inline:true, href:"#dialog-alert"});
							$.colorbox({html:"<span class=\".text\">" + quest.complete + "</span>"});
							
							kingSpeech.play();
							
							Player.xp += quest.xp;
						}
						else
						{
							if(quest.isStarted)
							{
								//$('#dialog-alert .text').html(quest.hint);
								//$.colorbox({inline:true, href:"#dialog-alert"});
								$.colorbox({html:"<span class=\".text\">" + quest.hint + "</span>"});
							}
							else if(!quest.isCompleted)
							{
								//$('#dialog-alert .text').html(quest.description);
								//$.colorbox({inline:true, href:"#dialog-alert"});
								$.colorbox({html:"<span class=\".text\">" + quest.description + "</span>"});
								quest.isStarted = true;
							}
						}
					}
				}
			}
			else
			{
				//console.log(img, (r.x * Resolution.tw), (r.y * Resolution.th), r.width, r.height, (x * Resolution.tw), (y * Resolution.th), r.width, r.height);
				context.drawImage(tilemap, (r.x * Resolution.tw), (r.y * Resolution.th), r.width, r.height, (x * Resolution.tw), (y * Resolution.th), r.width, r.height);
				var quest = Quests[0];
				if(quest.isStarted)
				{
					if(x == 4 && y == 2 && v == quest.item_id)
					{
						var count = Player.inventory[v];
						if(count == null || count == undefined)
						{
							count = 0;
						}
						Player.inventory[v] = (count + 1);
						pickFlower.play();
						row[xi] = 0;
					}
				}
			}
		}
	}
	context.drawImage(player, (Player.ax * Resolution.tw), (Player.ay * Resolution.th), Player.w, Player.h, (Resolution.w *0.25), 50, Resolution.tw, Resolution.th );
	
	Player.moved = false;
}

function doLogic()
{
	//console.log('thinking');
	if(Player.xp >= (Player.level * 100))
	{
		levelUp();
	}
}

function levelUp()
{
	Player.xp = Player.xp - 100;
	Player.level++;
	document.getElementById('player').src = 'player'+Player.level+'.png';
	//$('#dialog-alert .text').html("Level up! You are now level "+Player.level);
	//$.colorbox({inline:true, href:"#dialog-alert"});
	
	$.colorbox({html:"<span class=\".text\">Level up! You are now level "+Player.level + "</span>"});
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
		requestAnimationFrame(drawWorld);
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
				return;
			}
		}
		var yi = (Player.y < 0 ? (World.length + Player.y) : (Player.y % World.length));
		Player.y = yi;
		var xi = (Player.x < 0 ? (World[0].length + Player.x) : (Player.x % World[0].length));
		Player.x = xi;
		walking.play();
		Player.moved = true;
	};
	
	window.onmousedown=function(e){
	
		if(e.touches) {
			e = e.touches[0];
		}		
		if(e.y < (window.innerHeight * 0.2)) {
			Player.y--;
			Player.ay = 7;
			Player.ax++;
			Player.ax %= 4;
		}
		else if(e.y > (window.innerHeight * 0.8)) {
			Player.y++;
			Player.ay = 10;
			Player.ax++;
			Player.ax %= 4;
		}
		else if(e.x < (window.innerWidth * 0.2)) {
			Player.x--;
			Player.ay = 1;
			Player.ax++;
			Player.ax %= 4;
		}
		else if(e.x > (window.innerWidth * 0.8)) {
			Player.x++;
			Player.ay = 4;
			Player.ax++;
			Player.ax %= 4;
		}
		else {
			return;
		}
		
		var yi = (Player.y < 0 ? (World.length + Player.y) : (Player.y % World.length));
		Player.y = yi;
		var xi = (Player.x < 0 ? (World[0].length + Player.x) : (Player.x % World[0].length));
		Player.x = xi;
		walking.play();
		Player.moved = true;
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