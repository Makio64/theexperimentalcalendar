/**
 * Background
 * @constructor
 */
function Background(ctx)
{
	var self = this;

	this._ctx = ctx;
	this._shapes = [];
	this._m = mat4.create();

	var nItems = 20;
	for (var i = 0; i < nItems; i++)
	{
		mat4.identity(this._m);

		var isLeaf = Math.random() > 0.9;

		var scale = isLeaf ? 0.05 + Math.random() * 0.03 : 0.02 + Math.random() * 0.03;
		mat4.translate(this._m, [$(window).width() * Math.random(), -20, 0]);
		mat4.rotate(this._m, Math.random() * 2 * Math.PI, [0, 0, 1]);
		mat4.scale(this._m, [scale, scale, 0]);

		var shape = new Shape();
		shape.init(ctx, isLeaf ? ShapeData.leaf : ShapeData.flake, this._m, 0, 0);
		shape.color = "#FFFFFF";
		shape.a = Math.PI * Math.random();

		setTimeout(function(shape) {
			self._shapes.push(shape);
		}, Math.random() * 10000, shape);
	}
}

Background.prototype.layout = function (w, h)
{
	this._w = w;
	this._h = h;
};

Background.prototype.draw = function ()
{
	this._ctx.beginPath();
	this._ctx.globalAlpha = 1;
	this._ctx.lineWidth = 1;
	this._ctx.fillStyle = "#FFFFFF";

	var l = this._shapes.length;
	for (var i = 0; i < l; i++)
	{
		var shape = this._shapes[i];

		shape.vy = 0.05 + 0.1 * Math.random();
		shape.vx = 0.1 * Math.cos(shape.a += 0.0006 + 0.005 * Math.random());
		if(shape.vy < 0) shape.vy *= -1;

		shape.draw(this._w, this._h, []);

		if(shape.available)
		{
			mat4.identity(this._m);

			var scale = 0.01 + Math.random() * 0.03;
			mat4.translate(this._m, [this._w * Math.random(), -20, 0]);
			mat4.rotate(this._m, Math.random() * 2 * Math.PI, [0, 0, 1]);
			mat4.scale(this._m, [scale, scale, 0]);
			shape.init(this._ctx, shape._anchorsData, this._m);
		}
	}
	this._ctx.stroke();
};