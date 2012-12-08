/**
* Main experiments 03
*/

var sw, sh;
var clickMe = [];
var clickTexts = [];
var cat, catTail;
var state = 0;
var gift;
var mouseX = 0, mouseY = 0;
var fxs=[];
var PI = Math.PI, PI2 = Math.PI*2, HalfPI = Math.PI/2;
var lastTime = Date.now();
var zzz;

jQuery(document).ready(function($) {
	$(["img/body.png", "img/angryface.png", "img/gift.png", "img/leg1.png","img/fish01.png","img/fish02.png", "img/leg2.png", "img/leg3.png", "img/angrytail.png", "img/ear2.png","img/ear1.png", "img/eye1.png","img/eye2.png","img/hand_left.png","img/hand_right.png","img/head.png","img/mouth.png","img/mustache.png","img/shadow.png","img/tail.png"]).preloadImages(function(){
		init();
	});
});

$(document).mousemove(function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}.bind(this));

//entry point
function init() {
	TweenLite.to($("body"),.7,{css:{opacity:1}});
	sw = $(window).width();
	sh = $(window).height();
	cat = new Cat();
	fxs.push( new CircleNoise() );
	fxs.push( new CircleWaves() );
	
	clickMe.push(new ClickMe(270,0));
	state = 0;
	
	requestAnimationFrame(mainLoop);
	$("#hitbox").click(function(e){
		catClick();
	});
	TweenLite.to($("#catShadow"),0,{css:{marginLeft:"-180px",scaleX:.8}});
}

function createCatTail () {

	if(catTail == null){
		var canvas = document.createElement('canvas');
		canvas.width = 300;
		canvas.height = 300;
		catTail = new CatTail(canvas, 10);
		$('#catTail').append(canvas);
	} else{
		catTail.open();
	}
}

function mainLoop() {
	var dt = Date.now()-lastTime;
	var i;

	cat.update(dt);
	if(catTail != undefined)
		catTail.update(dt);
	for (i = fxs.length - 1; i >= 0; i--) {
		fxs[i].redraw();
	};
	for (i = clickMe.length - 1; i >= 0; i--) {
		clickMe[i].update(dt);
	};
	if(zzz != undefined)
		zzz.update(dt);

	// CSS3D
	// TweenLite.to($("div"),0,{css:{rotationY:(mouseX/sw)*50-25,rotationX:(mouseY/sh)*15}} );

	lastTime = lastTime+dt;
	requestAnimationFrame(mainLoop);
}

// var music = new buzz.sound("./sfx/music", {
//     preload: true,
//     formats: [ "mp3" ],
//     autoplay:true,
//     loop: true
// });;

function catClick()
{
	if(state==10){
		return;

	}
	if(cat.state == 4){
		state = 0;
		TweenLite.to($('#wall'),1.1,{css:{height:0},ease:Quad.easeIn});
	    TweenLite.to($("#catSleep"),.5,{delay:.3,ease:Quad.easeOut,css:{scaleX:1,marginTop:"-136px"}});
	    TweenLite.to($("#cat"),.5,{delay:.3,ease:Quad.easeOut,css:{scaleX:1,marginTop:"-150px"}});
		TweenLite.to($("#catShadow"),.2,{css:{marginLeft:"-180px",scaleX:.8,scaleY:1}});
		fxs[1].activated = false;
		cat.destroyCat(0);
		cat.life = 2;
		cat.state=0;
		clickMe[0].open();
	} else if(fxs[1].activated){
		return;
	} else if(cat.state==0){
		clickMe[0].open();
		zzz = new ZzZzZ($("#zZz"));
		createCatTail();
		cat.open();
		TweenLite.to($("#catShadow"),.2,{css:{marginLeft:"-150px",scaleX:1}});
		for (i = clickMe.length - 1; i >= 0; i--) {
			clickMe[i].activate();
		};
	} else if(cat.life == 0){
		zzz.close();
		cat.close();
		catTail.close();
		for (i = clickMe.length - 1; i >= 0; i--) {
			clickMe[i].close();
		};

		TweenLite.to($('#wall'),1.4,{delay:.3,css:{height:"150px"},ease:Back.easeOut});
		fxs[1].activate();
		TweenLite.to($("#catShadow"),.2,{css:{marginLeft:"-180px",scaleX:.8}});
		TweenLite.to($("#catShadow"),.2,{delay:.2,css:{marginLeft:"-180px",scaleX:.7,opacity:.4}});
		TweenLite.to($("#catShadow"),.4,{delay:.4,css:{marginLeft:"-185px",scaleY:1.9,scaleX:1.1,marginTop:"-100px",opacity:1}});
		TweenLite.to($("#catSleep"),.8,{ease:Back.easeInOut,css:{marginTop:"-214px",scaleX:.9}});
	    TweenLite.to($("#cat"),.8,{ease:Back.easeInOut,css:{marginTop:"-230px",scaleX:.9}});
	    cat.openAngryFace(.55);
	} else {
		switch(cat.life){
			case 2:
				// TweenLite.to(clickMe[0],1.2,{angle:80});
				// clickMe.push(new ClickMe(135,2,-40))
				// clickMe.push(new ClickMe(45,1,-40))
				// break;
		}
		cat.angry();
		fxs[1].madeWave();
		for (i = clickMe.length - 1; i >= 0; i--) {
			clickMe[i].activate();
		};
	} 
}
