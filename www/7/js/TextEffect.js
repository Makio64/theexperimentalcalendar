/**
* By David Ronai aka @Makio64
* http://makiopolis.com
*/

var TextEffect = function(container) {

	this.container = container;
	this.text = null;

	this.write = function(text) {
		var delay = 0;
		if(this.text != null ){
			TweenLite.to(this.text,.3,{css:{top:"-30px"}});
		}
		this.text = $('<div>'+text+'</div>');
		container.append(this.text); 
		TweenLite.to(this.text,.6,{delay:delay,css:{opacity:1,top:"0px"}});
	}

	this.init = function() {
		
	};

	this.init();
}

TextEffect.prototype.constructor = TextEffect;