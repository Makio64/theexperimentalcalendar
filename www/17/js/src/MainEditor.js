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

	this._penEditor = new Editor(this._ctx, this._wrapper);

	$('body').css("background-color", "#333");

	// stats
	this._stats = new Stats();
	this._stats.setMode(0); // 0: fps, 1: ms
	this._stats.domElement.style.position = 'absolute';
	this._stats.domElement.style.left = '0px';
	this._stats.domElement.style.top = '0px';
	document.body.appendChild(this._stats.domElement);

	// resize
	$(window).resize($.proxy(this._onResize, this));
	this._onResize();
}

Main.prototype._onResize = function ()
{
	this._c.width = window.innerWidth;
	this._c.height = window.innerHeight;
};

/**
 * Drawing
 */
Main.prototype.draw = function ()
{
	this._stats.begin();

	this._ctx.clearRect(0, 0, this._c.width, this._c.height);
	this._ctx.shadowBlur = 0;

	this._penEditor.draw();

	this._stats.end();
};