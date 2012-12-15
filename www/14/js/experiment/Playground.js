var Playground = function(canvas)
{
	this.context = canvas.getContext('2d');

	// Public variables for dat.gui use
	this.trails = false;
	this.treesNumber = 35;
	this.treesBGNumber = 15;

	this.snow = [];
	this.trees = [];
	this.treesBG = [];

	this.speed = 2;

	this.baseColors = ['white'];
	this.redColors = fw.createColorRange('#FF0000', '#FFFFFF', 10);
	this.rainbowColors = [
		'#FF7F00',
		'#FFFF00',
		'#00FF00',
		'#0000FF',
		'#FF0000',
		'#4B0082',
		'#8F00FF'
	];
	this.colors = this.baseColors;
	this.ballColors = this.baseColors;
	this.nightGradient = this.context.createLinearGradient(screenWidth>>1, 0, screenWidth>>1, screenHeight);
	this.nightGradient.addColorStop(0, '#011133');
	this.nightGradient.addColorStop(0.7, '#000000');
	this.context.fillStyle = this.nightGradient;
	this.context.fillRect(0, 0, screenWidth, screenHeight);

	this.santa = new Santa(-(screenWidth>>1), screenHeight>>3, this.context);

	this.treeColors = fw.createColorRange('#1C6300', '#96F272', 10);
	for(i = 0; i < this.treesNumber; i++)
	{
		this.trees.push(new Tree(fw.rand(-100, screenWidth+100), screenHeight, fw.rand(120, 160), fw.rand(400, 1600), fw.getColorInRange(this.treeColors, fw.rand(0.6, 1)), this.context));
	}
	for(i = 0; i < this.treesBGNumber; i++)
	{
		this.treesBG.push(new Tree(fw.rand(-100, screenWidth+100), screenHeight, fw.rand(90, 120), fw.rand(200, 1200), fw.getColorInRange(this.treeColors, fw.rand(0.6, 1)), this.context));
	}

	this.timerBG = 0;
	this.bgPos = 0;
	this.nyan = false;
	this.theta = 0.03;
	this.showNyan = false;

	this.mouseX = screenWidth>>1;
	this.mouseY = screenHeight>>1;

	var self = this;
	setTimeout(function()
	{
		document.querySelector('.preload').innerHTML = 'Crank the volume and click me !';
		document.querySelector('.preload').addEventListener('click', self.setup.bind(self), false);
	}, 2500);

};

Playground.prototype = {
	setup: function()
	{
		document.querySelector('.preload').removeEventListener('click', this.setup.bind(this), false);
		document.querySelector('.preload').style.display = 'none';

		this.santa.image.src = this.santa.images[0];
		this.santa.current = 0;

		document.getElementsByTagName('audio')[0].play();
		document.querySelector('.preload').className += " fade";
		this.animate();
		var self = this;
		setTimeout(function()
		{
			self.showNyan = true;
			self.toggleNyan();
			document.addEventListener("mousemove", self.onMouseMove.bind(self));
			document.addEventListener("click", self.toggleNyan.bind(self));
		}, 8600);
	},

	toggleNyan: function()
	{
		var song = document.getElementsByTagName('audio')[0], src;
		if(this.nyan)
		{
			this.nyan = false;
			this.colors = this.baseColors;
			this.ballColors = this.baseColors;
			this.speed = 2;
			src = "songs/merry1";
		}
		else
		{
			this.nyan = true;
			this.colors = this.rainbowColors;
			this.ballColors = this.redColors;
			this.speed = 15;
			src = "songs/nyan1";
		}
		this.santa.changeImage();
		song.querySelectorAll('source')[0].src = src + ".mp3";
		song.querySelectorAll('source')[1].src = src + ".ogg";
		song.load();
		song.play();
	},

	onMouseMove: function(event)
	{
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	},

	animate: function()
	{
		this.context.fillStyle = this.nightGradient;
		this.context.fillRect(0, 0, screenWidth, screenHeight);
//		this.context.clearRect(0, 0, screenWidth, screenHeight);

		if(this.nyan)
		{
			this.timerBG++;
			this.theta += 0.03;
			if(this.timerBG == 5)
			{
				this.timerBG = 0;
				this.bgPos++;
				if(this.bgPos > this.colors.length)
				{
					this.bgPos = 0;
				}
			}
			this.context.fillStyle = this.colors[this.bgPos];
			this.context.fillRect(0, 0, screenWidth, screenWidth);

		}
		if(this.showNyan) this.santa.update(this.mouseX, this.mouseY);

		if(this.snow.length < 400)
		{
			this.snow.push(new Particle(screenWidth, fw.rand(0, screenHeight-100), this.colors[~~(Math.random()*this.colors.length)], this.context));
		}

		for(i = 0; i < this.snow.length; i++)
		{
			this.snow[i].update();
			if(this.snow[i].radius < 1 || this.snow[i].x < -10)
			{
				this.snow.shift();
				this.snow.push(new Particle(screenWidth, fw.rand(0, screenHeight-100), this.ballColors[~~(Math.random()*this.ballColors.length)], this.context));
			}
		}

		for(i = 0; i < this.treesNumber; i++)
		{
			var t = this.trees[i], y = this.treesBG[i];
			t.x -= this.speed;
			t.y = screenHeight;
			if(t.x < - 160)
			{
				t.x = screenWidth;
				t.update(t.x, t.y, t.width, t.height/t.floors);
			}
			else t.update(t.x, t.y, t.width, t.height/t.floors);
			if(y)
			{
				y.x -= (this.speed - this.speed/2);
				y.y = screenHeight;
				if(y.x < - 120)
				{
					y.x = screenWidth;
					y.update(y.x, y.y, y.width, y.height/y.floors);
				}
				else y.update(y.x, y.y, y.width, y.height/y.floors);
			}
		}

		requestAnimationFrame(this.animate.bind(this));
	}
};