/**
 * Game
 * @constructor
 */
function Splash(ctx, wrapper)
{
	this._ctx = ctx;

	var self = this;

	var m = mat4.create();
	mat4.identity(m);
	mat4.translate(m, [$(window).width() * 0.5 + 400, $(window).height() * 0.5, 0]);

	this._slicer = new Slicer(wrapper);

	this._gingerMan = new Shape();

	this._alpha = 0;
	this._unlocked = false;
	this._dom = $("#splash");

	setTimeout(function() {self._dom.addClass("display");}, 200);
	$("#splash .begin").bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", function()
	{
		$("#splash").addClass("translate");
		setTimeout(function() {
			self._gingerMan.init(ctx, ShapeData.gingerMan, m, -15, 0);
			$(self).animate({_alpha: 1}, 500);
		}, 480);
	});
}

/**
 * @const
 * @type {string}
 */
Splash.UNLOCKED = "UNLOCKED";

Splash.prototype.layout = function (w, h)
{
	this._w = w;
	this._h = h;
};

Splash.prototype.draw = function()
{
	var self = this;

	this._ctx.strokeStyle = "#FFFFFF";
	this._ctx.globalAlpha = this._alpha;
	if(this._gingerMan)
	{
		this._gingerMan.draw(this._w, this._h, this._slicer.slices);
		if(this._gingerMan.sliced >= 4 && !this._unlocked)
		{
			this._unlocked = true;
			this._dom.addClass("hidden");

			$(this).animate({_alpha: 0}, 700, function() {
				$(self).trigger(Splash.UNLOCKED);
			});
		}
	}

	if(this._slicer)
		this._slicer.draw(this._ctx);
};