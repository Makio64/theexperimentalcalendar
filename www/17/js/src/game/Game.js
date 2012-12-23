/**
 * Game
 * @constructor
 */
function Game(ctx, wrapper)
{
	var self = this;

	this._ctx = ctx;
	//this._ctx.fontFamily = "mrmoustache, serif";

	this._ended = false;
	this._lvl = 0;

	this._m = mat4.create();

	// music
	this._audios = [document.getElementById("ploc1"), document.getElementById("ploc2")];
	this._soundTrack = document.getElementById("soundtrack");
	this._soundTrack.volume = 0.2;

	$(window).blur(function() {
		self._soundTrack.pause();
	});
	$(window).focus(function() {
		self._soundTrack.play();
	});

	// ui
	setTimeout(function() {
		$("#score, #time, #life").css("opacity", 1);
	}, 100);

	// slicer
	this._slicer = new Slicer(wrapper);

	// score
	this._score = new Score();

	// timer
	this._timerElmt = $("#time");

	// life
	this._lifeElmt = $("#life");

	// end screens
	$(".restart").live("click", $.proxy(this._restart, this));

	// shapes init
	this._shapesData = [ShapeData.gift,
		ShapeData.ball,
		ShapeData.slip,
		ShapeData.star,
		ShapeData.gingerMan,
		ShapeData.barleySugar];

	this._initVy = -$(document).height() / 15;

	this.countDown();
}

Game.prototype.layout = function (w, h)
{
	this._w = w;
	this._h = h;

	this._initVy = -h / 15;
};

Game.prototype.countDown = function ()
{
	var self = this;
	setTimeout(function(){
		self._soundTrack.currentTime = 0;
		self._soundTrack.play();
	}, 1000);

	var countDown = 3;
	var timer = $("#timer");
	this._t = 0;
	this._life = 3;
	this._time = Game.TIME = 60;
	if(this._timer)
		clearInterval(this._timer);
	this._timer = setInterval(function()
	{
		if(countDown)
		{
			timer.text(countDown).addClass("displayed");
		}
		else
		{
			clearInterval(self._timer);
			timer.removeClass("displayed");
			self.start();
		}

		countDown--;
	}, 1000);
};

/**
 * Let's roll
 */
Game.prototype.start = function ()
{
	var self = this;

	$(".message").addClass("hidden");

	this._shapes = [];
	this._throwShapes();

	this._timer = setInterval(function()
	{
		self._time--;
		var min = "0" + (self._time / 60 | 0);
		var sec = self._time % 60;
		if(sec.toString().length < 2) sec = "0" + sec;
		self._timerElmt.text(min + ":" + sec);

		if(!self._time)
		{
			clearInterval(self._timer);
			self._outOfTime();
		}
	}, 1000);
};

/**
 * Restart game
 */
Game.prototype._restart = function ()
{
	$(".message").removeClass("displayed");
	$(".restart").attr("disabled", "disabled");
	this._lifeElmt.find(".heart-container").find(".heart-full").css("opacity", 1);

	this._timerElmt.text("01:00");

	this._score.value = 0;
	this._score.unlock();

	this._shapes = null;
	this._lvl = 0;
	this._ended = false;

	this.countDown();
};

Game.prototype._outOfTime = function ()
{
	this._clearTimeouts();

	$("#message-lost").addClass("hidden");

	var elmt = $("#message-won");
	elmt.html(elmt.html().replace('{score}', this._score.value))
		.removeClass("hidden")
		.find(".restart").removeAttr("disabled");

	setTimeout(function() {
		elmt.addClass("displayed");
	}, 100);

	this._ended = true;
};

Game.prototype._lost = function ()
{
	this._clearTimeouts();

	$("#message-won").addClass("hidden");

	$("#message-lost")
		.removeClass("hidden")
		.find(".restart")
		.removeAttr("disabled");

	setTimeout(function() {
		$("#message-lost").addClass("displayed");
	}, 100);


	this._ended = true;
};

Game.prototype._clearTimeouts = function ()
{
	if(this._timer)
		clearInterval(this._timer);

	var l = this._shapes.length;
	for (var i = 0; i < l; i++)
	{
		var shape = this._shapes[i];
		if(shape.timeout)
			clearTimeout(shape.timeout);
	}
};

Game.prototype._getShapeMatrix = function (scale)
{
	var s = scale + Math.random() * 0.2;
	mat4.identity(this._m);
	mat4.translate(this._m, [$(window).width() * 0.5, $(window).height() + 100, 0]);
	mat4.rotate(this._m, Math.random() * 2 * Math.PI, [0, 0, 1]);
	mat4.scale(this._m, [s, s, 0]);

	return this._m;
};

/**
 * Throw shapes
 */
Game.prototype._throwShapes = function ()
{
	var self = this;
	if(this._lvl && (this._lvl % 2))
	{
		var bombShape = new Shape();
		bombShape.bomb = true;
		this._shapes.push(bombShape);
	}

	var newShape = new Shape();
	newShape.initAnchors = this._shapesData[Math.random() * this._shapesData.length | 0];
	this._shapes.push(newShape);

	this._lvl++;

	randomize(this._shapes);

	var sl = this._shapes.length;
	for(var i = 0; i < sl; i++)
	{
		var shape = this._shapes[i];
		shape.firstSlice = true;

		shape.timeout = setTimeout(function(i, shape, sl)
		{
			var vx = sl > 0 ? i * 30 / (sl - 1) - 15 : -15;
			shape.init(self._ctx, shape.bomb ? ShapeData.bomb : shape.initAnchors, shape.bomb ? self._getShapeMatrix(0.4) : self._getShapeMatrix(0.8), vx, self._initVy);
		}, 1000 + i * 500 - this._lvl * 5, i, shape, sl);
	}
};

/**
 * Render the game
 */
Game.prototype.draw = function ()
{
	if(this._shapes)
	{
		this._t += 0.01;

		this._ctx.lineWidth = 1;

		var sl = this._shapes.length;
		var available = true;
		for(var i = 0; i < sl; i++)
		{
			var shape = this._shapes[i];
			shape.vy = 0.8;
			shape.draw(this._w, this._h, this._slicer.slices);

			if(this._ended)
				continue;

			if(!shape.available)
			{
				available = false;

				if(shape.sliced)
					this._audios[Math.random() * this._audios.length | 0].play();

				if(shape.bomb)
				{
					if(shape.sliced && shape.firstSlice)
					{
						this._score.value -= 50;
						if(this._score.value < 0)
							this._score.value = 0;
						shape.firstSlice = false;
						$(this._lifeElmt.find(".heart-container")[3 - this._life]).find(".heart-full").css("opacity", 0);

						this._life--;

						if(!this._life)
						{
							this._score.lock();
							this._lost();
						}
					}
				}
				else
				{
					this._score.value += shape.sliced;
					shape.sliced = 0;
				}
			}
		}

		if(available && !this._ended)
			this._throwShapes();

	}

	// score
	this._score.draw();

	// slicer
	this._slicer.draw(this._ctx);
};
