$(document).ready((function ()
{
	var main = new Main();

	(function tick()
	{
		main.draw();
		window.requestAnimationFrame(tick);
	})();
}));

/**
 * Main
 * @constructor
 */
function Main()
{
	this._c = document.getElementById("canvas");
	this._ctx = this._c.getContext("2d");

	this._wrapper = document.getElementById("wrapper");
	$(this._wrapper).mousedown(function(e){e.preventDefault();});

	// global background
	this._background = new Background(this._ctx);

	// splash screen
	this._splash = new Splash(this._ctx, this._wrapper);
	$(this._splash).bind(Splash.UNLOCKED, $.proxy(this._launchGame, this));

	// stats
	/*this._stats = new Stats();
	this._stats.setMode(0); // 0: fps, 1: ms
	this._stats.domElement.style.position = 'absolute';
	this._stats.domElement.style.left = '0px';
	this._stats.domElement.style.top = '0px';
	this._stats.domElement.style.zIndex = '1000';
	document.body.appendChild(this._stats.domElement);*/

	// resize
	$(window).resize($.proxy(this._onResize, this));
	this._onResize();

	// DEBUG
	//this._launchGame()
}

Main.prototype._onResize = function ()
{
	this._c.width = window.innerWidth;
	this._c.height = window.innerHeight;

	this._w = $(window).width();
	this._h = $(window).height();

	this._background.layout(this._w, this._h);

	if(this._splash)
		this._splash.layout(this._w, this._h);

	if(this._game)
		this._game.layout(this._w, this._h);
};

Main.prototype._launchGame = function ()
{
	$(this._splash).unbind(Splash.UNLOCKED);
	$(this._splash._dom).css("display", "none");
	this._splash = null;

	this._ctx.globalAlpha = 1;
	$("#game").css("display", "block");
	this._game = new Game(this._ctx, this._wrapper);
	this._game.layout(this._w, this._h);
};

/**
 * Drawing
 */
Main.prototype.draw = function ()
{
	//this._stats.begin();

	this._ctx.clearRect(0, 0, this._c.width, this._c.height);
	this._ctx.shadowBlur = 0;

	this._background.draw();

	if(this._game)
		this._game.draw();

	if(this._splash)
		this._splash.draw();

	//this._stats.end();
};