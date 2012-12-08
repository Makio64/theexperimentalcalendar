/**
* ZzzzZzzzZzzZzzzZz
*/

var ZzZzZ = function (container)
{
	this.container = container;
	this.t = 0;
	this.pass = 0;
	this.texts = [];
	this.opacitys = [];
	this.state = 0;
	this.lastText = 0;
	

	this.close = function(){
		this.state = 1;
		//for (var i = this.texts.length - 1; i >= 0; i--) {
		//	TweenLite.to(this.texts[i],.5+Math.random()*.5,{css:{scaleX:.8,scaleY:.8, opacity:0}});
		//}
	}

	this.update = function(dt) {
		this.t += dt/Math.PI/30;
		
		if(this.state>=0){
			var text;
			if(this.texts.length<5){
				this.lastText+=dt
				if(this.lastText >= 900){
					var text = $("<img src='img/z.png' />");
					text.css("top", 250+"px");
					text.css("opacity", 0);
					container.append(text);
					this.texts.push(text);
					this.opacitys.push(0);
					this.lastText = 0;
				}
			}
			for (var i = this.texts.length - 1; i >= 0; i--) {
				text = this.texts[i];
				opacity = this.opacitys[i];
				if(this.state == 1){
					this.opacitys[i] -= 0.05;
					text.css("opacity", this.opacitys[i]);
				}
				text.css("left", String(Math.cos((this.t/6) * .7+Math.PI/2* i  )*40)+"px");
				text.css("top", (text.position().top-dt/30)+"px");
				if(text.position().top<0) {
					if(state == 1){
						text.css("display","none");	
					}
					this.opacitys[i] -= 0.05;
					opacity = this.opacitys[i];
					text.css("opacity", this.opacitys[i]);
					if(this.opacitys[i]<=0) {
						this.opacitys[i] = 0;
						text.css("top","250px");
					}
				} else if(this.opacitys[i] < 1 && this.state == 0) {
					this.opacitys[i] += 0.02;
					text.css("opacity", this.opacitys[i]);
				};
			};	
		}
	}
}

ZzZzZ.prototype.constructor = ZzZzZ;