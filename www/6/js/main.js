/*
* 18 Days Left - Elodie Fabbri
* @author Aurelien Gantier http://www.arlg.me
* Loads images and show them like a gif
                                                       _v
                                                     __* (__)
             ff     ff     ff     ff                {\/ (_(__).-.
      ff    <_\__, <_\__, <_\__, <_\__,      __,~~.(`>|-(___)/ ,_)
    o<_\__,  (_ ff ~(_ ff ~(_ ff ~(_ ff~~~~~@ )\/_;-"``     |
      (___)~~//<_\__, <_\__, <_\__, <_\__,    | \__________/|
      // >>     (___)~~(___)~~(___)~~(___)~~~~\\_/_______\_//
                // >>  // >>  // >>  // >> jgs `'---------'`

*/


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
	FPS : 5,
	ctx:'',
	current : 0,
	preloaded : 0,
	preloadedId : document.getElementById("number"),
	preloadedWrapper : document.getElementById("preload"),


	init: function() {
		APP.Main.initCanvas();
		APP.Main.loadImages();
	},

	loadImages: function() {
		for(var i = 0; i < APP.Main.imagesLength; i++) {
			var image = new Image();
			image.src = APP.Main.imagesPath + (i + 1) + APP.Main.imagesExt;
			image.onload = function() {
				APP.Main.onLoaded();
			};
			APP.Main.images[i] = image;
		}
	},

	initCanvas: function() {
		
		APP.Main.canvas.width = APP.Main.CANVAS_WIDTH;
		APP.Main.canvas.height = APP.Main.CANVAS_HEIGHT;
		APP.Main.ctx = APP.Main.canvas.getContext('2d');

		//this.loop();
	},

	onLoaded: function(){
		APP.Main.preloaded++;
		APP.Main.preloadedId.innerHTML = APP.Main.preloaded;
		if(APP.Main.preloaded == APP.Main.imagesLength){
			APP.Main.loop();
			APP.Main.preloadedWrapper.style.visibility = 'hidden';
		}
	},

	loop : function(){
		//Clear
		APP.Main.ctx.clearRect( 0, 0, APP.Main.CANVAS_WIDTH, APP.Main.CANVAS_HEIGHT );

		if(APP.Main.current == APP.Main.imagesLength) APP.Main.current = 0;
		APP.Main.ctx.drawImage(APP.Main.images[APP.Main.current], 0, 0);
		APP.Main.current++;

		//next
		setTimeout(APP.Main.loop, 1000 / APP.Main.FPS);
	}

};

APP.Main.init();