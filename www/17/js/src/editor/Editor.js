/**
 * Editor
 * @constructor
 */
function Editor(ctx, wrapper)
{
	this._ctx = ctx;
	this._wrapper = wrapper;
	this._guides = new Guides(16);
	this._shape = new ShapeEditable();
	this._shape.color = "#EEE";
	this._shape.init(ctx, []);

	// ui
	var gui = new dat.GUI();

	var f1 = gui.addFolder('Shapes');
	f1.add(this, 'loadGift');
	f1.add(this, 'loadBall');
	f1.add(this, 'loadGingerMan');
	f1.add(this, 'loadBarleySugar');
	f1.add(this, 'loadTree');
	f1.add(this, 'loadStar');
	f1.add(this, 'loadLeaf');
	f1.add(this, 'loadFlake');
	f1.add(this, 'loadHeart');
	f1.open();

	var f2 = gui.addFolder('Actions');
	f2.add(this._shape, 'save');
	f2.add(this._shape, 'erase');
	f2.open();

	var f3 = gui.addFolder('Physics');
	f3.add(this._shape, 'update');
	f3.add(this._shape, 'constrains');
	f3.add(this._shape, 'vx').min(-1.0).max(1.0).step(0.10);
	f3.add(this._shape, 'vy').min(-1.0).max(1.0).step(0.10);
	f3.add(this._shape, 'frictions').min(0.1).max(0.99).step(0.01);
	f3.add(this._shape, 'rigidity').min(0.1).max(0.99).step(0.01);
	f3.open();

	$("body").css("background", "#EEE");

	// handlers
	$(wrapper).mousemove($.proxy(this._onMouseMove, this));
	$(wrapper).mousedown($.proxy(this._onMouseDown, this));
	$(wrapper).mouseup($.proxy(this._onMouseUp, this));
	$(document).keydown($.proxy(this._onKeyDown, this));
	$(document).keyup($.proxy(this._onKeyUp, this));

	// slicer
	this._slicer = new Slicer(wrapper);
}

//----------------------------------------------------------- / keyboard handlers

Editor.prototype._onKeyDown = function (e)
{
	//console.log(e.keyCode)
	switch (e.keyCode)
	{
		case 91:
			this._shape.sys = true;
			break;
		case 18:
			this._shape.alt = true;
			break;
	}
};

Editor.prototype._onKeyUp = function ()
{
	this._shape.sys = this._shape.alt = false;
};

//----------------------------------------------------------- / mouse handlers

Editor.prototype._onMouseMove = function (e)
{
	this._mx = e.pageX;
	this._my = e.pageY;
	this._shape.setMousePosition(e.pageX, e.pageY);
};

Editor.prototype._onMouseDown = function (e)
{
	e.preventDefault();
	if (!this._shape._currentElmt && !this._shape.anchors.length) // first points
	{
		var a = this._shape.buildAnchor(this._mx, this._my, true);
		this._shape._currentElmt = a.elmt;
	}
};

Editor.prototype._onMouseUp = function ()
{
	this._shape.checkMouseUp();
};

//----------------------------------------------------------- / public

/**
 * Destroy the editor
 */
Editor.prototype.destroy = function ()
{
	$(this._wrapper)
		.unbind("mousemove")
		.unbind("mousedown")
		.unbind("mouseup");

	$(document)
		.unbind("keydown")
		.unbind("keyup");
};

/**
 * draw the shape
 */
Editor.prototype.draw = function ()
{
	var w = $(window).width();
	var h = $(window).height();

	// guides
	this._guides.draw(this._ctx, w, h);

	this._ctx.lineWidth = 1;

	// shape
	this._shape.draw(w, h, this._shape.update ? this._slicer.slices : []);

	// slicer
	this._slicer.locked = !this._shape.update;
	this._slicer.draw(this._ctx);
};

//----------------------------------------------------------- / Ui callbacks

Editor.prototype.loadGift = function ()
{
	this._shape.erase();
	this._shape.init(this._ctx, ShapeData.gift);
};

Editor.prototype.loadBall = function ()
{
	this._shape.erase();
	this._shape.init(this._ctx, ShapeData.ball);
};

Editor.prototype.loadGingerMan = function ()
{
	this._shape.erase();
	this._shape.init(this._ctx, ShapeData.gingerMan);
};

Editor.prototype.loadBarleySugar = function ()
{
	this._shape.erase();
	this._shape.init(this._ctx, ShapeData.barleySugar);
};

Editor.prototype.loadTree = function ()
{
	this._shape.erase();
	this._shape.init(this._ctx, ShapeData.tree);
};

Editor.prototype.loadStar = function ()
{
	this._shape.erase();
	this._shape.init(this._ctx, ShapeData.star);
};

Editor.prototype.loadLeaf = function ()
{
	this._shape.erase();
	this._shape.init(this._ctx, ShapeData.leaf);
};

Editor.prototype.loadFlake = function ()
{
	this._shape.erase();
	this._shape.init(this._ctx, ShapeData.flake);
};

Editor.prototype.loadHeart = function ()
{
	this._shape.erase();
	this._shape.init(this._ctx, ShapeData.bomb);
};
