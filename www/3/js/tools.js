var tools = function ()
{
	function delegate(method, scope)
	{
		var args = Array.prototype.slice.call(arguments, 2);
		return function()
			{
				var params = Array.prototype.slice.call(arguments);
				params.concat(args);	
				method.apply(scope, params);
			}
	}
	
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
								window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	
	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;




	function Stage(w, h)
	{
		this._canvas = document.createElement("canvas");
		this.resize(w, h);
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(this._canvas);
		this.out = this._canvas.getContext("2d");
	}

	Stage.prototype = {
	
		_tick : function()
		{
			this._callback();
			this._requestFrame = requestAnimationFrame(delegate(this._tick, this), this._fps);
		},

		play : function(callback, scope)
		{
			this._callback = delegate(callback, scope);
			this._tick();
		},

		pause : function() { cancelAnimationFrame(this._requestFrame); },

		resume : function()
		{
			if(!this._callback)
				throw new Error("play should be called before resume");
			this._tick();
		},
		
		resize : function(w, h)
		{
			this._canvas.width = this.width = w;
			this._canvas.height = this.height = h;
		}
	}



	function Mouse()
	{
		this.x = this.y = 0;
		this.oldX = this.oldY = 0;
		this.isDown = false;

		document.onmousemove = delegate(this._onMouseMove, this);
		document.onmousedown = delegate(this._onMouseDown, this);
		document.onmouseup = delegate(this._onMouseUp, this);
	}

	Mouse.prototype = {
	
		_onMouseMove : function(e)
		{
			var ev = e || window.event;//Moz:IE
			if (ev.pageX)
			{
				//Mozilla or compatible
				this.x = ev.pageX;
				this.y = ev.pageY;
			}
			else if(ev.clientX)
			{
				//IE or compatible
				this.x = ev.clientX;
				this.y = ev.clientY
			}
			this.x += document.body.scrollLeft;
			this.y += document.body.scrollTop;

			//synchronization problems with main loop
			//this.savePos();
		},

		_onMouseDown : function(e)
		{
			this.isDown = true;
			this.savePos();
			if(this._onDown) this._onDown();
		},

		_onMouseUp : function(e)
		{
			this.isDown = false;
			this.savePos();
				if(this._onUp) this._onUp();
		},

		savePos : function()
		{
			this.oldX = this.x;
			this.oldY = this.y;
		},

		onDown : function(callback, scope) { this._onDown = delegate(callback, scope); },
		onUp : function(callback, scope) { this._onUp = delegate(callback, scope); }
	}





	function Keyboard()
	{
		this._keys = {};
		this._downCallbacks = [];
		this._upCallbacks = [];
		document.onkeydown = delegate(this._onKeyDown, this);
		document.onkeyup = delegate(this._onKeyUp, this);
	}

	Keyboard.prototype = {

		_onKeyDown : function(e)
		{
			e = e || window.event;
			this._keys[e.keyCode] = true;
			this._call(e.keyCode, this._downCallbacks);
		},

		_onKeyUp : function(e)
		{
			e = e || window.event;
			this._keys[e.keyCode] = false;
			this._call(e.keyCode, this._upCallbacks);
		},
	
		_add : function(callback, scope, key, collection)
		{
			//verify duplicates?
			if(key == undefined) key = "*";
			collection.push({callback:callback, scope:scope, key:key});
		},

		_remove : function(callback, scope, key, collection)
		{
			if(key == undefined) key = "*";
			var n = collection.length;
			for (var i = 0; i < n; i++)
			{
				var f = collection[i];
				if(f.callback == callback && f.scope == scope && f.key == key)
				{
					collection.splice(i, 1);
					n--;
				}
			}
		},

		_call : function(key, collection)
		{
			var n = collection.length;
			for (var i = 0; i < n; i++)
			{
				var f = collection[i];
				if(f.key == key || f.key == "*")
					delegate(f.callback, f.scope, key)();
			}
		},

		isDown : function(key) { return this._keys[key] || false; },
		onDown : function(callback, scope, key) { this._add(callback, scope, key, this._downCallbacks); },
		onUp : function(callback, scope, key) { this._add(callback, scope, key, this._upCallbacks); },
		removeDown : function(callback, scope, key) { this._remove(callback, scope, key, this._downCallbacks); },
		removeUp : function(callback, scope, key) { this._remove(callback, scope, key, this._upCallbacks); }
	}

	return {
			delegate:delegate,
			Stage:Stage,
			Mouse:Mouse,
			Keyboard:Keyboard
		};
}();

/*
tools.delegate(callback, scope);

var stage = new tools.Stage(800, 600);
stage.play(onUpdate, this);
stage.pause();
stage.width;
stage.height;
stage.out;

var mouse = new tools.Mouse();
mouse.x
mouse.y
mouse.isDown
mouse.onDown(onMouseDown);
mouse.onUp(onMouseUp);

var keyboard = new tools.Keyboard();
keyboard.isDown(33);
keyboard.onDown(onKey33Down, 33);
keyboard.onUp(onKey33Up, 33);
keyboard.removeDown(onKey33Down, 33);
keyboard.removeUp(onKey33Up, 33);*/
