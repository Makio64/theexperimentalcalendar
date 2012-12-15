var Playground = function(canvas)
{
	this.context = canvas.getContext('2d');

	// Public variables for dat.gui use
	this.trails = true;
	this.treesNumber = 200;

	//background
/*	this.context.save();
	this.context.globalCompositeOperation = "source-over";//lighter";
	for(i = 0; i < 1000; i++)
	{
		var green = 1 + (i/4);
		this.context.fillStyle = "rgb("+(255 - green)+","+green+",0)";
		this.context.fillRect(-50+i,-50+i,i,i);
		this.context.rotate(5);
	}
	this.context.restore();*/

//	var colors = fw.createColorRange('#00FF5E', '#098526', 10);


	this.treeColors = fw.createColorRange('#1C6300', '#96F272', 10);
	var i, angle = 0, time = 0, radius = (screenHeight>>1), angleIncrement = 2 * Math.PI / this.treesNumber,
	x, y, width, height, rotate, centerX, centerY;
	this.context.save();
	for(i = 0; i < this.treesNumber; i++)
	{
		x = (screenWidth>>1) + radius * Math.cos(angle);
		y = (screenHeight>>1) + radius * Math.sin(angle);
		width = fw.rand(90, 100);
		height = fw.rand(400, screenHeight>>1);
		centerX = x + width>>1;
		centerY = y + height>>1;

		this.context.save();
		this.context.translate(centerX, centerY);
		this.context.rotate(angle + Math.PI/2);

		var t =	new Tree(0, 0, width, height, fw.getColorInRange(this.treeColors, fw.rand(0.1, 0.9)), context);
		/*this.context.fillStyle = 'white';
		this.context.strokeStyle = 'black';
		this.context.fillRect(0, 0, 50, 50);
		this.context.strokeRect(0, 0, 50, 50);*/

		this.context.restore();
		angle += angleIncrement;
		time += 0.1;
	}
	this.context.restore();

	this.spiral = new Spiral(screenWidth-200, 200, this.context);
	this.spiral2 = new Spiral(200, 350, this.context);
	this.isDebug = true;

	//ref circle
	this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = 'white';
    this.context.translate(screenWidth>>1, screenHeight>>1);
    //this.context.arc(0, 0, radius, 0, Math.PI*2, true);
    this.context.closePath();
    this.context.stroke();
    this.context.restore();

	if(this.isDebug)
	{
		this.debug();
	}
	//this.animate();
};

Playground.prototype = {
	animate: function()
	{
		if(this.trails)
		{
			this.context.fillStyle = "rgba(0,0,0,0.03)";
			this.context.fillRect(0, 0, screenWidth, screenHeight);
		}
		else
		{
			this.context.clearRect(0, 0, screenWidth, screenHeight);
		}

		// EXPERIMENT LOGIC
		/*for(var i = 0, l = this.snow.length; i < l; i++)
		{
			//this.snow[i].update();
		}*/
		//this.spiral.update();

		this.context.save();
		for(i = 0; i < this.treesNumber>>5; i++)
		{
			//new Tree(w, h, color, context);
			var t =	new Tree(fw.rand(10, 500), fw.rand(30, screenHeight<<1), fw.getColorInRange(this.treeColors, fw.rand(0.1, 0.9)), context);
		}
		this.context.restore();

		if(this.isDebug)
		{
			this.stats.update();
		}
		requestAnimationFrame(this.animate.bind(this));
	},

	debug: function()
	{
		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = 0;
		this.stats.domElement.style.left = 0;
		this.stats.domElement.style.zIndex = 100;
		document.body.appendChild(this.stats.domElement);
	}
};