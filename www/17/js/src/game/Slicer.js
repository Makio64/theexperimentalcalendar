/**
 * Slicer
 * @constructor
 */
function Slicer(wrapper)
{
	$(wrapper).mousemove($.proxy(this._onMouseMove, this))
		.mousedown($.proxy(this._onMouseDown, this))
		.mouseup($.proxy(this._onMouseUp, this));
		//.mouseleave($.proxy(this._onMouseUp, this));
	this.slices = [];
	this.locked = false;
	this._t = 0;
	this._tSound = 0;
	this._ox = 0;
	this._oy = 0;

	// audio
	this._audios = [document.getElementById("swish1"), document.getElementById("swish2"), document.getElementById("swish3")];
}

Slicer.prototype._onMouseMove = function(e)
{
	if(this._mousedown && !this.locked)
		this.slices.push({x: e.pageX, y: e.pageY});

	this._x = e.pageX;
	this._y = e.pageY;

	var vx = this._x - this._ox;
	var vy = this._y - this._oy;
	var v = Math.sqrt(vx * vx + vy * vy);

	//console.log(this._t, v)
	if(this._mousedown && v > 55 && this._tSound > 4)
	{
		this._tSound = 0;
		this._audios[Math.random() * this._audios.length | 0].play();
	}

	this._ox = this._x;
	this._oy = this._y;
};

Slicer.prototype._onMouseDown = function()
{
	this._mousedown = true;
};

Slicer.prototype._onMouseUp = function()
{
	this._mousedown = false;
};

Slicer.prototype.draw = function(ctx)
{
	if(!this.locked)
	{
		ctx.beginPath();
		var l = this.slices.length;
		var op;
		for(var i = 0; i < l; i++)
		{
			var p = this.slices[i];
			if(i)
			{
				ctx.quadraticCurveTo(op.x, op.y, op.x + (p.x - op.x) * 0.5, op.y + (p.y - op.y) * 0.5);
				//ctx.lineTo(p.x, p.y);
			}
			else
				ctx.moveTo(p.x, p.y);

			op = p;
		}

		var r = l ? 4 / l : 1;
		if((l && this._t >= r) || l > 3)
		{
			this.slices.shift();
			this._t = 0;
		}
		this._t++;

		//ctx.lineWidth = 1;
		ctx.strokeStyle = "#ff3c00";
		ctx.shadowBlur = 8;
		ctx.shadowColor = "#ff3c00";
		ctx.stroke();
	}

	this._tSound++;
};