var CircleNoise = function()
{	
	this.w = 130;
	this.h = 125;
	this.segments = 100;
	this.points = 5;
	this.radius = 9;
	
	this.canvas = document.createElement('canvas');
	this.canvas.width = this.w + this.radius*2;
	this.canvas.height = this.h + this.radius*2;
	
	this.ctx = this.canvas.getContext("2d");
	
	$("#catSleep").append(this.canvas);

	this.activate = function()
	{
		// this.segments = 100;
		// this.points = 10;
		this.radius = 10;
	}

	this.redraw = function()
	{
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.beginPath();
		this.ctx.strokeStyle = "f25151";
		this.ctx.lineWidth = 1;		
		this.ctx.beginPath();

		var angle,x,xx,y,yy,i,j,halfRadius=this.radius/2,halfH=this.h/2,halfW=this.w/2;

		for (i = 0; i < this.segments; i++) {
			angle = PI2*i/this.segments;
			x = Math.cos(angle)*halfW+halfW;
			y = Math.sin(angle)*halfH+halfH;
			for (j = 0; j < this.points; j++) {
				xx = x+Math.random()*this.radius-halfRadius;
				yy = y+Math.random()*this.radius-halfRadius;
				this.ctx.moveTo(xx,yy);
				this.ctx.lineTo(xx+1,yy);
			};
		};	
		
		this.ctx.stroke();
		// this.ctx.restore();
	}

	this.redraw();
}



CircleNoise.prototype.constructor = CircleNoise;