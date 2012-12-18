/**
 * ShapeEditable
 * @constructor
 */
function ShapeEditable()
{
	Shape.call(this);
	
	this._mx = 
	this._my = 0;

	this.update = false;
	this.constrains = true;
}
ShapeEditable.prototype = Object.create(Shape.prototype);

ShapeEditable.prototype.init = function (ctx, anchors)
{
	this._dom = document.getElementById("editor");

	if(this._origin)
		$(this._origin.elmt).remove();
	this._origin = this.buildAnchor($(document).width() >> 1, $(document).height() >> 1, false, 0, false);
	$(this._origin.elmt).addClass("origin");

	// initial translation
	var matrix = mat4.create();
	mat4.identity(matrix);
	matrix = mat4.translate(matrix, [this._origin.x, this._origin.y, 0]);
	Shape.prototype.init.call(this, ctx, anchors, matrix);
};

ShapeEditable.prototype.buildAnchor = function (x, y, buildStick, index, register)
{
	//return Shape.prototype.buildAnchor.call(this, x, y, buildStick, index);

	if(register == null)
		register = true;

	var a = new Anchor(x, y, 0.91 + Math.random() * 0.07);
	a.elmt = document.createElement("div");
	a.elmt.className = "anchor";
	a.elmt.a = a;
	$(a.elmt).css({x: a.x - 3, y: a.y - 3});
	$(a.elmt).mousedown($.proxy(this._onAnchorDown, this, a.elmt));
	$(a.elmt).mouseover($.proxy(this._onAnchorOver, this, a.elmt));
	$(a.elmt).mouseout($.proxy(this._onAnchorOut, this, a.elmt));
	$(this._dom).append(a.elmt);

	if(register)
	{
		if (index)
			this.anchors.splice(index, 0, a);
		else
			this.anchors.push(a);

		if (buildStick && this._pa)
			this.buildStick(this._pa, a);

		this._pa = a;
	}

	return a;
};

/**
 * draw the shape
 */
ShapeEditable.prototype.draw = function (w, h, slices)
{
	if(this._initialized)
	{
		Shape.prototype.draw.call(this, w, h, slices);

		var ls = this.sticks.length;
		for (var j = 0; j < ls; ++j)
		{
			var stick = this.sticks[j];
			var a1 = stick.anchorA;
			var a2 = stick.anchorB;

			if (this._lastStick != stick)
			{
				// perpendicular projection of mouse position to sticks
				var x1 = a1.x,
					y1 = a1.y,
					x2 = a2.x,
					y2 = a2.y,
					x3 = this._mx,
					y3 = this._my;

				var px = x2 - x1,
					py = y2 - y1,
					dAB = px * px + py * py;
				var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
				var x = x1 + u * px, y = y1 + u * py;

				// checking if the point is between the stick's anchors
				if (u >= 0 && u <= 1 && !this._currentElmt)
				{
					// distance from the mouse
					var dMx = x3 - x,
						dMy = y3 - y;
					var dM = Math.sqrt(dMx * dMx + dMy * dMy);
					if (dM < 8)
					{
						this._currentStickOver = stick;
						this._projection = {x: x, y: y};
						if (this._lastStick && this._lastStick.anchorA != a1 && this._lastStick.anchorA != a2)
							this._currentElmt.a.setPosition(this._projection.x, this._projection.y);

						// DEBUG
						//this._ctx.moveTo(this._mx, this._my);
						//this._ctx.lineTo(x, y);
						// END DEBUG
					}
				}
			}
		}

		// update and draw anchors
		var la = this.anchors.length;
		for (var i = 0; i < la; ++i)
		{
			var a = this.anchors[i];
			$(a.elmt).css({x: a.x - 4, y: a.y - 4});
		}
	}

	if (this._currentElmt)
	{
		this._currentElmt.a.setPosition(this._mx, this._my);

		if(this._currentElmt == this._origin.elmt)
			$(this._currentElmt).css({x: this._currentElmt.a.x - 4, y: this._currentElmt.a.y - 4});
	}

};

/**
 * save the shape
 */
ShapeEditable.prototype.save = function ()
{
	var result = "[";
	var l = this.sticks.length;
	var o = this._origin;
	for (var i = 0; i < l; ++i)
	{
		var stick = this.sticks[i];
		result +=   parseInt(stick.anchorA.x - o.x) + "," +
					parseInt(stick.anchorA.y - o.y) + "," +
					parseInt(stick.anchorB.x - o.x) + "," +
					parseInt(stick.anchorB.y - o.y);
		if (i < l - 1)
			result += ",";
	}
	result += "]";

	console.log(result);
};

/**
 * @override
 * @param anchor
 * @return {*}
 */
ShapeEditable.prototype.removeAnchor = function (anchor)
{
	this._dom.removeChild(anchor.elmt);
	anchor.elmt.a = null;
	anchor.elmt = null;
	return Shape.prototype.removeAnchor.call(this, anchor);
};

//----------------------------------------------------------- / Anchors handlers

ShapeEditable.prototype._onAnchorDown = function (elmt)
{
	if (this.sys || elmt == this._origin.elmt) // move the anchor
	{
		this._currentElmt = elmt;
		$(elmt).addClass("move");
	}
	else if (elmt != this._origin.elmt && this.alt) // delete the anchor
		this.removeAnchor(elmt.a);
	else if(elmt != this._origin.elmt)// create a new stick based on selected anchor
	{
		var a = this.buildAnchor(this._mx, this._my);
		$(a.elmt).addClass("create");
		this._currentElmt = a.elmt;
		this._lastStick = this.buildStick(elmt.a, a);
	}
};

ShapeEditable.prototype._onAnchorOver = function (elmt)
{
	if (this._currentElmt && elmt != this._currentElmt)
	{
		$(elmt).addClass("merge");
		this._currentElmt.a.x = elmt.a.x;
		this._currentElmt.a.y = elmt.a.y;
		$(this._currentElmt).addClass("hidden");
		this._anchorOver = elmt.a;
	}
};

ShapeEditable.prototype._onAnchorOut = function (elmt)
{
	this._anchorOver = null;
	$(elmt).removeClass("merge");
	$(this._currentElmt).removeClass("hidden");
};

//----------------------------------------------------------- / 

ShapeEditable.prototype.checkMouseUp = function ()
{
	var index, i;
	if(this._currentElmt && this._currentElmt == this._origin.elmt) // origin
	{

	}
	else if (this._anchorOver) // we are over an existing anchor
	{
		// merge anchors
		if(this._lastStick)
		{
			index = this.removeAnchor(this._currentElmt.a);
			this.buildStick(this._lastStick.anchorA, this._anchorOver, index);
		}
		else // merging a moving point
		{
			var linkedSticks = this._currentElmt.a.linkedSticks;
			var l = linkedSticks.length;
			var linkedAnchors = [];
			for(i = 0; i < l; i++)
			{
				var linkedStick = linkedSticks[i];
				if(linkedStick.anchorA == this._currentElmt.a)
					linkedAnchors.push(linkedStick.anchorB);
				else
					linkedAnchors.push(linkedStick.anchorA);
			}
			index = this._removeAnchor(this._currentElmt.a);
			for(i = 0; i < l; i++)
				this.buildStick(linkedAnchors[i], this._anchorOver, index);
		}

		this._currentElmt = null;
		this._anchorOver = null;
	}
	else if (this._currentStickOver) // we are close to a stick line
	{
		// destroy old stick
		index = this.removeStick(this._currentStickOver);

		// create two new linked sticks to replace the old one
		var a = this._currentElmt ?
			this._currentElmt.a :
			this.buildAnchor(this._projection.x, this._projection.y, false, this.anchors.indexOf(this._currentStickOver.anchorA) + 1);
		this.buildStick(this._currentStickOver.anchorA, a, index);
		this.buildStick(a, this._currentStickOver.anchorB, index + 1);

		this._currentStickOver = null;
	}

	if (this._lastStick)
	{
		this._lastStick.setLength(null);
		this._lastStick = null;
	}

	if (this._currentElmt)
	{
		$(this._currentElmt).removeClass("create move");
		if(this._currentElmt.a.linkedSticks)
		{
			var ls = this._currentElmt.a.linkedSticks.length;
			for (i = 0; i < ls; i++)
			{
				var stick = this._currentElmt.a.linkedSticks[i];
				stick.setLength(null);
			}
		}
		this._currentElmt = null;
	}
};

ShapeEditable.prototype.setMousePosition = function (x, y)
{
	this._mx = x;
	this._my = y;

	if (this._currentStickOver)
		$("body").css("cursor", "crosshair");
	else
		$("body").css("cursor", "auto");	
};