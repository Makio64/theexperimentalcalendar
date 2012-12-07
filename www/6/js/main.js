var APP = window.APP || {};

APP.Main = {

	//Vars
	images: [],
	imagesLength: 10,
	imagesPath: "images/",
	imagesExt: ".gif",
	canvas: document.getElementById("canvas"),
	CANVAS_WIDTH: 1000,
	CANVAS_HEIGHT: 665,
	ctx:'',
	current : 1,

	init: function() {
		APP.Main.initCanvas();
		APP.Main.loadImages();
		
		setTimeout(APP.Main.loop, 3000);
		//this.ctx.drawImage(this.images[0], 0, 0);
	},

	loadImages: function() {
		for(var i = 0; i < APP.Main.imagesLength; i++) {
			var image = new Image();
			image.src = APP.Main.imagesPath + (i + 1) + APP.Main.imagesExt;
			APP.Main.images[i] = image;
		}
	},

	initCanvas: function() {
		
		APP.Main.canvas.width = APP.Main.CANVAS_WIDTH;
		APP.Main.canvas.height = APP.Main.CANVAS_HEIGHT;
		APP.Main.ctx = APP.Main.canvas.getContext('2d');

		//this.loop();
	},

	loop : function(){
		//Clear
		APP.Main.ctx.clearRect( 0, 0, APP.Main.CANVAS_WIDTH, APP.Main.CANVAS_HEIGHT );

		//update

		if(APP.Main.current == APP.Main.imagesLength) APP.Main.current = 0;

		APP.Main.ctx.drawImage(APP.Main.images[APP.Main.current], 0, 0);
		APP.Main.current++;

		console.log(APP.Main.current);


		//draw

		//next
		//requestAnimFrame(APP.Main.loop);
		setTimeout(APP.Main.loop, 1000 / 5);

	}

};


APP.Main.init();

