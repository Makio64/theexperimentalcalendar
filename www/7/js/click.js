var ClickMe = function(angle,state,offsetY)
{
	this.offsetX = -40;
	this.offsetY = offsetY || 0;
	this.angle = angle;
	this.t = 0;
	//this.state = state;
	this.baseDistance = 170;
	this.clickImg = $('<img class="clickImg" src="img/arrow.png" />');
	TweenLite.to(this.clickImg,0,{css:{rotation:Math.atan2(Math.sin(this.angle/180*Math.PI),Math.cos(this.angle/180*Math.PI))*180/Math.PI +90}});

	$("#texts").append(this.clickImg);
	TweenLite.from(this.clickImg,.8,{delay:.6,css:{opacity:0}});
	
	this.update = function(dt){
		if(this.state>=3){
			return;
		}
		this.t += dt;
		this.distance = Math.sin(this.t/120)*5+this.baseDistance;
		this.clickImg.css('top',(Math.sin(this.angle/180*Math.PI)*this.distance+this.offsetY)+"px");
		this.clickImg.css('left',(Math.cos(this.angle/180*Math.PI)*this.distance)+"px");
	}

	this.activate = function(){
		TweenLite.to(this,.25,{baseDistance:100, ease:Quad.easeOut});
		TweenLite.to(this,.8,{delay:.3, baseDistance:170, ease:Back.easeOut});
	}

	this.onOpenComplete = function(bouboup){
		bouboup.state =2; 
	}

	this.onCloseComplete = function(bouboup){
		bouboup.state =3; 
	}

	this.open = function(){
		this.state= 0;
		TweenLite.to(this,.25,{baseDistance:170, ease:Quad.easeOut});
		TweenLite.to(this.clickImg,.6,{delay:.3, css:{opacity:1}});
	}

	this.close = function(){
		TweenLite.to(this,.25,{baseDistance:100, ease:Quad.easeOut});
		TweenLite.to(this,.8,{delay:.3, baseDistance:300, ease:Back.easeOut});
		TweenLite.to(this.clickImg,.8,{delay:.3, css:{opacity:0},onComplete:this.onCloseComplete,onCompleteParams:[this]});
	}

	this.init = function(){
		
	}

	this.init();
}

ClickMe.prototype.constructor = ClickMe;