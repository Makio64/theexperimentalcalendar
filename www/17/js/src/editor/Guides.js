/**
 * Guides
 * @constructor
 * @param unit uint
 */
function Guides(unit)
{
	this._unit = unit | 0;
}

/**
 * @param ctx
 * @param width
 * @param height
 */
Guides.prototype.draw = function (ctx, width, height)
{
	ctx.beginPath();
	ctx.strokeStyle = "#777";
	ctx.lineWidth = 0.2;

	var i;
	var cols = width / this._unit + 1 | 0;
	for (i = 1; i < cols; i++)
	{
		var x = i * this._unit;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height);
	}

	var rows = height / this._unit + 1 | 0;
	for (i = 1; i < rows; i++)
	{
		var y = i * this._unit;
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
	}

	ctx.stroke();
};