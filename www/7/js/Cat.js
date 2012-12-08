

var Cat = function(){

	this.t = 0;
	this.state = 0;
	this.life = 2;
	this.angryEyesTime = 0;

	this.ronflement = new buzz.sound("./sfx/cat_sleeping", {
	    preload: true,
	    formats: [ "mp3" ],
	    loop: true
	});;

	this.meow = new buzz.sound("./sfx/cat_meow", {
	    preload: true,
	    formats: [ "mp3" ],
	});;
	this.meow.setVolume(6);

	this.electricity = new buzz.sound("./sfx/general_electricity2", {
	    preload: true,
	    formats: [ "mp3" ]
	});;

	this.electricity.setVolume(10);

	this.grrr = new buzz.sound("./sfx/cat_angry", {
	    preload: true,
	    formats: [ "mp3" ],
	});

	this.body = $("<img class='body' src='./img/body.png'/>");
	this.body2 = $("<img class='body' src='./img/body.png'/>");
	this.handLeft = $("<img id='handLeft' src='./img/hand_left.png'/>");
	this.ear2 = $("<img id='ear2' src='./img/ear2.png'/>");
	this.head = $("<img id='head' src='./img/head.png'/>");
	this.ear1 = $("<img id='ear1' src='./img/ear1.png'/>");
	this.mouth = $("<img id='mouth' src='./img/mouth.png'/>");
	this.mustache = $("<img id='mustache' src='./img/mustache.png'/>");
	this.handRight = $("<img id='handRight' src='./img/hand_right.png'/>");
	this.tail = $("<img id='tail' src='./img/tail.png'/>");
	this.eye1 = $("<img id='eye1' src='./img/eye1.png'/>");
	this.eye2 = $("<img id='eye2' src='./img/eye2.png'/>");
	this.angryEyes = $("<img id='angryEyes' src='./img/eyeangry.png'/>");

	this.angryEyes.css("opacity",1);
	this.angryEyes.css("display","none");

	container = $("#cat");
	container.append(this.body);
	container.append(this.handLeft);
	container.append(this.ear2);
	container.append(this.head);
	container.append(this.ear1);
	container.append(this.mouth);
	container.append(this.mustache);
	container.append(this.handRight);
	container.append(this.tail);
	container.append(this.eye1);
	container.append(this.eye2);
	container.append(this.angryEyes);
	container.append(this.body2);
	this.body2.css("opacity",0);

	TweenLite.to(this.handLeft,0,{css:{opacity:0,left:75}});
	TweenLite.to(this.body2,0,{css:{opacity:1}});
	TweenLite.to(this.ear2,0,{css:{opacity:0,left:95}});
	TweenLite.to(this.ear1,0,{css:{opacity:0,left:75,top:30}});
	TweenLite.to(this.head,0,{css:{opacity:0,left:75}});
	TweenLite.to(this.mouth,0,{css:{opacity:0,left:75}});
	TweenLite.to(this.mustache,0,{css:{opacity:0,left:75}});
	TweenLite.to(this.handRight,0,{css:{opacity:0,left:75}});
	TweenLite.to(this.tail,0,{css:{opacity:0,left:70,top:50}});
	TweenLite.to(this.eye1,0,{css:{opacity:0,left:130}});
	TweenLite.to(this.eye2,0,{css:{opacity:0,left:130}});

	this.handRight.mouseenter(function (e) {
		TweenLite.to(this.handRight,.5,{css:{rotation:-30}});
	}.bind(this));

	this.update = function(dt) {
		this.t += dt;
		if(this.angryEyesTime > 0){
			this.angryEyesTime -= dt;
			if(this.angryEyesTime<= 0){
				this.eye1.css("display","block");
				this.eye2.css("display","block");
				this.angryEyes.css("display","none");
			}
		}
		switch(this.state){
			default:
			case 0:
				//Do nothing
				break;
			case 2:
				this.handLeft.css('top',String(75+4*Math.sin(this.t/500))+"px");
				this.body.css('top',String(Math.floor(16+(1-Math.sin(this.t/300))*4))+"px");
				this.body.css('height',String(Math.floor(129+Math.sin(this.t/300)*4))+"px");
				this.body2.css('top',String(Math.floor(16+(1-Math.sin(this.t/300))*4))+"px");
				this.body2.css('height',String(Math.floor(129+Math.sin(this.t/300)*4))+"px");
				this.handRight.css('top',String(75+4*Math.abs(Math.sin(this.t/1800)))+"px");
				break;
			case 4:
				this.angryTail.css('top', Math.floor(-168+(1-Math.sin(this.t/300+PI/32))*8)+"px");
				this.body.css('top', Math.floor(16+(1-Math.sin(this.t/300))*2)+"px");
				this.angryFace.css('top',Math.floor(55+Math.sin(this.t/300)*5)+"px");
				break;
		}
	};

	this.open = function(){
		this.meow.play();
		this.bounce();
		this.ronflement.play();
		this.state = 1;
		TweenLite.to(this.handLeft,.2,{ease:Quad.easeOut,delay:.2,css:{opacity:1,left:165}});
		TweenLite.to(this.body2,.2,{ease:Quad.easeOut,delay:.2,css:{opacity:0}});
		TweenLite.to(this.ear2,.2,{ease:Quad.easeOut,delay:.2,css:{opacity:1,left:235}});
		TweenLite.to(this.ear1,.2,{ease:Quad.easeOut,delay:.2,css:{opacity:1,left:205,top:0}});
		TweenLite.to(this.head,.2,{ease:Quad.easeOut,delay:.2,css:{opacity:1,left:155}});
		TweenLite.to(this.mouth,.05,{ease:Quad.easeOut,delay:.2,css:{opacity:1,left:195}});
		TweenLite.to(this.mustache,.05,{ease:Quad.easeOut,delay:.2,css:{opacity:1,left:170}});
		TweenLite.to(this.handRight,.2,{ease:Quad.easeOut,delay:.2,css:{opacity:1,left:115}});
		TweenLite.to(this.tail,.2,{ease:Quad.easeOut,delay:.2,css:{opacity:1,left:35,top:90},onComplete:this.onOpenComplete, onCompleteParams:[this]});
		TweenLite.to(this.eye1,.05,{ease:Quad.easeOut,delay:.2,css:{opacity:1,left:200}});
		TweenLite.to(this.eye2,.05,{ease:Quad.easeOut,delay:.2,css:{opacity:1,left:215}});
	}

	this.openAngryFace = function(delay){
		this.grrr.play(3);
		container.empty();
		this.leg1 = $("<img id='leg1' src='./img/leg1.png'/>");
		this.leg2 = $("<img id='leg2' src='./img/leg2.png'/>");
		this.leg3 = $("<img id='leg3' src='./img/leg3.png'/>");
		this.angryTail = $("<img id='angrytail' src='./img/angrytail.png'/>");
		this.angryFace = $("<img id='angryface' src='./img/angryface.png'/>");

		container.append(this.leg1);
		container.append(this.leg3);
		container.append(this.leg2);
		container.append(this.angryTail);
		container.append(this.body);
		container.append(this.angryFace);

		this.leg1.css("opacity",1);
		this.leg2.css("opacity",1);
		this.leg3.css("opacity",1);
		this.angryTail.css("opacity",1);
		this.angryFace.css("opacity",1);

		TweenLite.from(this.leg1,.2,{delay:delay,ease:Back.easeOut,css:{opacity:0, top:20, left:50}});
		TweenLite.from(this.leg2,.2,{delay:delay,ease:Back.easeOut,css:{opacity:0, top:20, left:50}});
		TweenLite.from(this.leg3,.2,{delay:delay,ease:Back.easeOut,css:{opacity:0, top:20, left:50}});
		TweenLite.from(this.angryTail,.6,{delay:delay,ease:Back.easeOut,css:{opacity:0,scaleX:.8,scaleY:.8, top:0, left:50}});
		TweenLite.from(this.angryFace,.2,{delay:delay,ease:Back.easeOut,css:{opacity:0,scaleX:.8,scaleY:.8, top:0, left:50},onComplete:this.onOpenAngryComplete,onCompleteParams:[this]});
	}

	this.destroyCat = function(delay){
		TweenLite.to(this.leg1,.2,{delay:delay,ease:Quad.easeIn,css:{opacity:0, top:20, left:50}});
		TweenLite.to(this.leg2,.2,{delay:delay,ease:Quad.easeIn,css:{opacity:0, top:20, left:50}});
		TweenLite.to(this.leg3,.2,{delay:delay,ease:Quad.easeIn,css:{opacity:0, top:20, left:50}});
		TweenLite.to(this.angryTail,.2,{delay:delay,ease:Quad.easeIn,css:{opacity:0,scaleX:.8,scaleY:.8, top:0, left:50}});
		TweenLite.to(this.angryFace,.2,{delay:delay,ease:Quad.easeIn,css:{opacity:0,scaleX:.8,scaleY:.8, top:0, left:50}});
		container.append(this.handLeft);
		container.append(this.ear2);
		container.append(this.head);
		container.append(this.ear1);
		container.append(this.mouth);
		container.append(this.mustache);
		container.append(this.handRight);
		container.append(this.tail);
		container.append(this.eye1);
		container.append(this.eye2);
		container.append(this.angryEyes);
		container.append(this.body2);
		this.body2.css("opacity",0);
	}

	this.onOpenComplete = function(cat){
		cat.state = 2;
	}

	this.onOpenAngryComplete= function(cat){
		cat.state = 4;
	}

	this.close = function(){
		this.electricity.play();
		this.ronflement.stop();
		this.state = 0;
		TweenLite.to(this.handLeft,.2,{css:{opacity:0,left:75}});
		TweenLite.to(this.body2,0.2,{css:{opacity:1}});
		TweenLite.to(this.ear2,.2,{css:{opacity:0,left:95}});
		TweenLite.to(this.ear1,.2,{css:{opacity:0,left:75,top:30}});
		TweenLite.to(this.head,.2,{css:{opacity:0,left:75}});
		TweenLite.to(this.mouth,.05,{css:{opacity:0,left:75}});
		TweenLite.to(this.mustache,.05,{css:{opacity:0,left:75}});
		TweenLite.to(this.handRight,.2,{css:{opacity:0,left:75}});
		TweenLite.to(this.tail,.2,{css:{opacity:0,left:70,top:50}});
		TweenLite.to(this.eye1,.05,{css:{opacity:0,left:130}});
		TweenLite.to(this.eye2,.05,{css:{opacity:0,left:130}});

		TweenLite.to(this.body2,0,{delay:.2, css:{opacity:0}});
	}

	this.angry = function(){
		this.life--;
		this.electricity.play();
		this.meow.play();
		TweenLite.to(this.ear1,.3,{css:{rotation:10}});
		TweenLite.to(this.ear1,.3,{delay:.3,css:{rotation:0}});
		TweenLite.to(this.ear2,.3,{css:{rotation:-10}});
		TweenLite.to(this.ear2,.3,{delay:.3,css:{rotation:0}});
		this.eye1.css("display","none");
		this.eye2.css("display","none");
		this.angryEyes.css("display","block");
		this.angryEyesTime = 700;
	}

	this.bounce = function(){
		TweenLite.to($("#cat"),.4,{ease:Quad.easeInOut,css:{marginLeft:"-115px",marginTop:"-250px", scaleX:.7,scaleY:.7}});
		TweenLite.to($("#cat"),.6,{delay:.1,css:{marginLeft:"-150px",marginTop:"-150px",scaleX:1,scaleY:1}});
		TweenLite.to($("#catSleep"),.4,{ease:Quad.easeInOut,css:{marginLeft:"-68px",marginTop:"-234px", scaleX:.7,scaleY:.7}});
		TweenLite.to($("#catSleep"),.6,{delay:.1,css:{marginLeft:"-103px",marginTop:"-134px",scaleX:1,scaleY:1}});
	}

	this.init = function(){

	};

	this.init();
} 

Cat.prototype.constructor = Cat;