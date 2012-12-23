/**
 * Shape
 * @constructor
 */
function Shape()
{
	this.vx = 0.00;
	this.vy = 0.00;

	this.frictions = 0.9;
	this.rigidity = 0.5;
	this.constrains = false;
	this.update = true;

	this.sliced = 0;
	this.bomb = false;

	this.anchors = [];
	this.sticks = [];

	this.color = "#0a1f4a";
}

/**
 * Init the shape
 */
Shape.prototype.init = function (ctx, anchors, matrix, vx, vy)
{
	this._initialized = true;
	this._ctx = ctx;
	this._anchorsData = anchors;
	this._matrix = matrix;

	this.sliced = 0;
	this.displayed = false;
	this.firstSlice = true;
	this.available = false;
	this.anchors = [];
	this.sticks = [];
	this.initVx = vx;
	this.initVy = vy;

	if(!this.initVx) this.initVx = 0;
	if(!this.initVy) this.initVy = 0;

	var l = anchors.length;
	var parameters = 4;
	var v1 = vec3.create();
	var v2 = vec3.create();
	for (var i = 0; i < l; i += parameters)
	{
		var a1 = null;
		var a2 = null;
		vec3.set([anchors[i], anchors[i + 1], 0], v1);
		vec3.set([anchors[i + 2], anchors[i + 3], 0], v2);

		if(this._matrix)
		{
			mat4.multiplyVec3(this._matrix, v1);
			mat4.multiplyVec3(this._matrix, v2);
		}

		var al = this.anchors.length;
		for (var j = 0; j < al; j++)
		{
			var anchor = this.anchors[j];
			if(v1[0] == anchor.x && v1[1] == anchor.y)
				a1 = anchor;
			if(v2[0] == anchor.x && v2[1] == anchor.y)
				a2 = anchor;
		}

		if(!a1) a1 = this.buildAnchor(v1[0], v1[1], false, null);
		if(!a2) a2 = this.buildAnchor(v2[0], v2[1], false, null);

		a1.vx = this.initVx;
		a1.vy = this.initVy;

		this.buildStick(a1, a2, null);
	}

	this.initAnchors = anchors;
	//this.initSticks = this.sticks;
};

/**
 * Reset the shape,
 * call this is the shape has already been initialized once
 */
Shape.prototype.reset = function (vx, vy)
{
	if(!this._initialized)
	{
		console.log("Shape error: call init before reset");
		return;
	}

	this.init(this._ctx, this._anchorsData, this._matrix, vx, vy);
};

/**
 * draw the shape
 */
Shape.prototype.draw = function (w, h, slices)
{
	if(this._initialized)
	{
		// reset current stick
		this._currentStickOver = null;

		// update sticks
		var sl = slices.length;
		var sticksToBuild = [];
		var stick, intersec, vx, vy;
		var ls = this.sticks.length;
		for (var j = 0; j < ls; ++j)
		{
			stick = this.sticks[j];
			stick.rigidity = this.rigidity;

			// slices test
			var a1 = stick.anchorA;
			var a2 = stick.anchorB;
			var pSlice = null;
			for (var n = 0; n < sl; ++n)
			{
				var slice = slices[n];
				if(pSlice)
				{
					intersec = segmentIntersection(a1, a2, slice, pSlice);
					if(intersec && !stick.intersected)
					{
						vx = slice.x - pSlice.x;
						vy = slice.y - pSlice.y;

						this.sliced++;

						stick.intersected = true;
						sticksToBuild.push(stick, intersec, vx, vy);
					}
				}

				pSlice = slice;
			}

			if (this.update)
				stick.update();
		}

		// build intersected sticks
		var lis = sticksToBuild.length;
		for(var m = 0; m < lis; m += 4)
		{
			stick = sticksToBuild[m];
			intersec = sticksToBuild[m + 1];

			// destroy old stick
			var index = this.removeStick(stick);

			// impact velocity
			var f = 0.8;
			var vmax = 40;
			var randomEffector = 20;
			vx = sticksToBuild[m + 2] * f;
			if(vx > vmax) vx = vmax;
			else if(vx < -vmax) vx = -vmax;
			vy = sticksToBuild[m + 3] * f;
			if(vy > vmax) vy = vmax;
			else if(vy < -vmax) vy = -vmax;
			// create two new linked sticks to replace the old one
			var an1 = this.buildAnchor(intersec.x, intersec.y, false);
			an1.vx = vx * 2 * Math.random() + randomEffector * Math.random() - randomEffector * Math.random();
			an1.vy = vy * 2 * Math.random() + randomEffector * Math.random() - randomEffector * Math.random();
			var an2 = this.buildAnchor(intersec.x, intersec.y, false);
			an2.vx = vx * 2 * Math.random() + randomEffector * Math.random() - randomEffector * Math.random();
			an2.vy = vy * 2 * Math.random() + randomEffector * Math.random() - randomEffector * Math.random();
			var s1 = this.buildStick(stick.anchorA, an1, index);
			s1.intersected = true;
			var s2 = this.buildStick(an2, stick.anchorB, index + 1);
			s2.intersected = true;
		}

		// update and draw anchors
		if(this.bomb)
		{
			this._ctx.strokeStyle =
			this._ctx.fillStyle = Math.random() > 0.5 ? "#AA0000" : "#FF0000";
		}
		else
		{
			this._ctx.fillStyle =
			this._ctx.strokeStyle = this.color;
		}

		var pa, a;
		var la = this.anchors.length;
		if(this.displayed)
			this.available = true;
		for (var i = 0; i < la; ++i)
		{
			a = this.anchors[i];
			//a.f = this.frictions;
			a.vx += this.vx;
			a.vy += this.vy;
			a.update();

			// constrains
			var ax = a.x;
			var ay = a.y;
			if(this.constrains)
			{
				var bounceFrictions = 0.8;
				if(ax > w)
				{
					ax = w;
					a.vx *= -bounceFrictions;
				}
				else if(ax < 0)
				{
					ax = 0;
					a.vx *= -bounceFrictions;
				}

				if(ay > h)
				{
					ay = h;
					a.vy *= -bounceFrictions;
				}
				else if(ay < 0)
				{
					ay = 0;
					a.vy *= -bounceFrictions;
				}

				a.x = a._ox = ax;
				a.y = a._oy = ay;
			}
			else if(ax < w && ax > 0 && ay < h && ay > 0)
			{
				this.available = false;
				this.displayed = true;
			}

			this._ctx.fillRect(a.x - 1, a.y - 1, 2, 2);

			pa = a;
		}

		// drawing

		this._ctx.beginPath();

		ls = this.sticks.length;
		for (var k = 0; k < ls; ++k)
		{
			stick = this.sticks[k];
			this._ctx.moveTo(stick.anchorA.x, stick.anchorA.y);
			this._ctx.lineTo(stick.anchorB.x, stick.anchorB.y);
		}
		this._ctx.stroke();
	}
};

Shape.prototype.buildAnchor = function (x, y, buildStick, index)
{
	var a = new Anchor(x, y, 0.945 + Math.random() * 0.01);
	if (index)
		this.anchors.splice(index, 0, a);
	else
		this.anchors.push(a);

	if (buildStick && this._pa)
		this.buildStick(this._pa, a);

	this._pa = a;

	return a;
};

Shape.prototype.removeAnchor = function (anchor)
{
	var ls = anchor.linkedSticks.length;
	var stickIndex;
	for (var i = 0; i < ls; i++)
	{
		var stick = anchor.linkedSticks[i];
		if (stick.anchorA && anchor != stick.anchorA && stick.anchorA.linkedSticks.indexOf(stick) != -1) stick.anchorA.linkedSticks.splice(stick.anchorA.linkedSticks.indexOf(stick), 1);
		if (stick.anchorB && anchor != stick.anchorB && stick.anchorB.linkedSticks.indexOf(stick) != -1) stick.anchorB.linkedSticks.splice(stick.anchorB.linkedSticks.indexOf(stick), 1);
		stickIndex = this.sticks.indexOf(stick);
		this.sticks.splice(stickIndex, 1);
	}

	anchor.linkedSticks = null;
	this.anchors.splice(this.anchors.indexOf(anchor), 1);
	anchor = null;

	return stickIndex;
};

Shape.prototype.buildStick = function (a1, a2, index)
{
	var stick = new Stick(a1, a2, null, 0.6);
	a1.linkedSticks.push(stick);
	a2.linkedSticks.push(stick);

	if (index)
		this.sticks.splice(index, 0, stick);
	else
		this.sticks.push(stick);

	return stick;
};

Shape.prototype.removeStick = function (stick)
{
	stick.anchorA.linkedSticks.splice(stick.anchorA.linkedSticks.indexOf(stick), 1);
	stick.anchorB.linkedSticks.splice(stick.anchorB.linkedSticks.indexOf(stick), 1);
	var index = this.sticks.indexOf(stick);
	this.sticks.splice(index, 1);
	stick = null;

	return index;
};

/**
 * Erase the shape
 */
Shape.prototype.erase = function ()
{
	while(this.anchors.length)
		this.removeAnchor(this.anchors[0]);
	this._pa = null;
};
