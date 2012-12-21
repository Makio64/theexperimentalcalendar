function Litho(){

	var canvas;
	var stage;
	var shape;
	var graphics;
	var points_ar;
	this.shape_ar= new Array();

	var litho = {calcul:{}, centre:{}, memoire:{burinage:[], semiBurinage:[]}, decalage:{}};
	this.litho = litho;
	var pierre = {};
	this.pierre = pierre;
	var burin = {};
	this.burin = burin;
	var encre = {initial:{}, final:{}};	
	this.encre = encre;

	var ims;
	var decalageX;
	var decalageY;
	
	this.oldX;
	this.oldY;
	
	this.active=false;

}

Litho.prototype.init = function(param_duree_num, param_spotRVB_num, param_imprecision_num, param_nervosite_num, param_color_obj, pStage, pCanvas, pX, pY, pArray, pSize) {
	
	this.stage = pStage;
	this.canvas = pCanvas;

	this.points_ar = pArray;
	this.litho.calcul.finesse = this.points_ar.length -1;
			
	this.litho.duree = param_duree_num;
	if(pSize){
		this.litho.agrandir = pSize;
	}else{
		this.litho.agrandir = 2;
	}
	
	this.litho.expand = 1.0020;
	this.burin.reactivite = .005;
	this.burin.puissance = 5;
	this.burin.inclinaison = .1;
	this.burin.proximite = 0;
	
	this.decalageX = pX;
	this.decalageY = pY;
	
	this.litho.centre.x =  0;
	this.litho.centre.y = 0;
	this.litho.longueur = 150;
	this.litho.largeur = 150;
	this.litho.decalage.horizontal = 0;
	this.litho.decalage.vertical = 0;

	this.litho.calcul.nervosite = param_nervosite_num;
	this.litho.calcul.mobilite = 1;

	this.litho.calcul.imprecision = param_imprecision_num; 

	this.pierre.longueur = 2048;
	this.pierre.largeur = 1536;
	this.pierre.durete = 0;
	
	this.encre.initial.rouge = param_color_obj.initial.r;
	this.encre.initial.vert = param_color_obj.initial.v;
	this.encre.initial.bleu = param_color_obj.initial.b;
	
	this.encre.final.rouge = param_color_obj.final.r;
	this.encre.final.vert = param_color_obj.final.v;
	this.encre.final.bleu = param_color_obj.final.b;
	
	this.encre.dilution = 50;
	this.encre.spotRVB = param_spotRVB_num;

	this.initWorld();
	
	this.active = true;
}

Litho.prototype.initWorld = function() {

	this.ims = 0;
	
	for (var i=0; i<this.litho.calcul.finesse; i++) {
		this.litho.memoire.burinage[i] = {};

		this.litho.memoire.burinage[i].horizontal = this.litho.memoire.burinage[i].impactBurinHorizontal=this.points_ar[i].x +this.decalageX ;
		this.litho.memoire.burinage[i].vertical = this.litho.memoire.burinage[i].impactBurinVertical=this.points_ar[i].y+this.decalageY;

		this.litho.memoire.burinage[i].forceHorizontale = this.litho.memoire.burinage[i].forceVerticale=0;
		this.litho.memoire.semiBurinage[i] = {};
	}

	this.initShape();
}


Litho.prototype.initShape = function() {
	this.shape = new createjs.Shape();
	this.shape_ar.push(this.shape);
	this.graphics = this.shape.graphics;

	this.shape.x = 0;
	this.shape.y = 0;

	this.stage.addChildAt(this.shape, this.stage.getNumChildren()-11);
}

Litho.prototype.initCenter = function() {
	this.litho.centre.x =  this.stage.mouseX;
	this.litho.centre.y = this.stage.mouseY;
	
	this.oldX=this.litho.centre.x;
	this.oldY=this.litho.centre.y;
}

Litho.prototype.render = function() {
	
	this.ims++;

	var sommeImpactHorizontal = 0;
	var sommeImpactVertical = 0;
	
	var i=0;
	var fLength=this.litho.calcul.finesse-1;
	
	var distX = (this.stage.mouseX-this.oldX);
	var distY = (this.stage.mouseY-this.oldY);
	var dist = Math.sqrt(distX*distX+distY*distY);
	
	if(dist>100) dist=100;
	
	this.litho.calcul.nervosite = (dist*.002)+.2;
	this.litho.calcul.imprecision = (dist*.09)+1;
	
	var distX = (this.stage.mouseX-this.litho.centre.x);
	var distY = (this.stage.mouseY-this.litho.centre.y);
	var dist = Math.sqrt(distX*distX+distY*distY);
	
	if(dist>300) dist=300;
	this.litho.expand = (dist*.000012)+1.001;
	
	this.oldX = this.stage.mouseX;
	this.oldY = this.stage.mouseY;
	
	while(fLength--) {

		var impact = this.litho.memoire.burinage[i];
		impact.forceHorizontale += (Math.random()-.5)*this.litho.calcul.imprecision;
		impact.forceVerticale += (Math.random()-.5)*this.litho.calcul.imprecision;
		
		var burinHorizontal = impact.horizontal+this.litho.centre.x-Math.random()*(this.canvas.width/2);//(this.canvas.width/2-this.stage.mouseX);
		var burinVertical = impact.vertical+this.litho.centre.y-Math.random()*(this.canvas.height/2);//(this.canvas.height/2-this.stage.mouseY);

		var longueurImpact = Math.sqrt(burinHorizontal*burinHorizontal+burinVertical*burinVertical);
		
		if (longueurImpact<this.burin.proximite) {
			var angleAttaque = 90;
			var impactBurinHorizontal = (this.canvas.width/2)+Math.cos(angleAttaque)*this.burin.proximite*this.burin.puissance;
			var impactBurinVertical = (this.canvas.height/2)+Math.sin(angleAttaque)*this.burin.proximite*this.burin.puissance;

			impact.forceHorizontale += (impactBurinHorizontal-(impact.horizontal+this.litho.centre.x))*this.burin.reactivite;
			impact.forceVerticale += (impactBurinVertical-(impact.vertical+this.litho.centre.y))*this.burin.reactivite;
		}

		impact.forceHorizontale += (impact.impactBurinHorizontal-impact.horizontal)*this.burin.inclinaison;
		impact.forceVerticale += (impact.impactBurinVertical-impact.vertical)*this.burin.inclinaison;
		impact.forceHorizontale *= this.litho.calcul.nervosite;
		impact.forceVerticale *= this.litho.calcul.nervosite;
		impact.horizontal += impact.forceHorizontale;
		impact.vertical += impact.forceVerticale;
		
		impact.horizontal = (impact.horizontal>(this.pierre.longueur-this.litho.centre.x)) ? (this.pierre.longueur-this.litho.centre.x) : impact.horizontal;
		impact.horizontal = (impact.horizontal<(-this.litho.centre.x)) ? (-this.litho.centre.x) : impact.horizontal;
		impact.vertical = (impact.vertical>this.pierre.largeur-this.litho.centre.y) ? (this.pierre.largeur-this.litho.centre.y) : impact.vertical;
		impact.vertical = (impact.vertical<(-this.litho.centre.y)) ? (-this.litho.centre.y) : impact.vertical;
		
		sommeImpactHorizontal += (impact.horizontal+this.litho.centre.x);
		sommeImpactVertical += (impact.vertical+this.litho.centre.y);
		
		if(i!=(this.litho.calcul.finesse-1)){
		
		this.litho.memoire.semiBurinage[i].horizontal = (impact.horizontal+this.litho.memoire.burinage[i+1].horizontal)/2;
		this.litho.memoire.semiBurinage[i].vertical = (impact.vertical+this.litho.memoire.burinage[i+1].vertical)/2;

		}
		
		i++;

	}

	this.litho.memoire.semiBurinage[i-1].horizontal = (this.litho.memoire.burinage[i-1].horizontal+this.litho.memoire.burinage[0].horizontal)/2;
	this.litho.memoire.semiBurinage[i-1].vertical = (this.litho.memoire.burinage[i-1].vertical+this.litho.memoire.burinage[0].vertical)/2;
	
	this.litho.decalage.horizontal += ((sommeImpactHorizontal/this.litho.calcul.finesse)-this.litho.centre.x)*this.burin.reactivite*this.litho.calcul.mobilite;
	this.litho.decalage.vertical += ((sommeImpactVertical/this.litho.calcul.finesse)-this.litho.centre.y)*this.burin.reactivite*this.litho.calcul.mobilite;
	this.litho.decalage.horizontal *= this.litho.calcul.nervosite;
	this.litho.decalage.vertical *= this.litho.calcul.nervosite;
	this.litho.centre.x += this.litho.decalage.horizontal;
	this.litho.centre.y += this.litho.decalage.vertical;
	
	var rouge = this.encre.initial.rouge-Math.round(((this.ims*(this.encre.initial.rouge-this.encre.final.rouge))/this.litho.duree));
	var vert = this.encre.initial.vert-Math.round(((this.ims*(this.encre.initial.vert-this.encre.final.vert))/this.litho.duree));
	var bleu = this.encre.initial.bleu-Math.round(((this.ims*(this.encre.initial.bleu-this.encre.final.bleu))/this.litho.duree));
	
	var couleur = this.encre.spotRVB*rouge << 16 | this.encre.spotRVB*vert << 8 | this.encre.spotRVB*bleu;

	this.shape.graphics.setStrokeStyle(this.pierre.durete);
	this.shape.graphics.beginStroke(createjs.Graphics.getRGB(couleur, (Math.round(this.encre.dilution-((this.ims*this.encre.dilution)/this.litho.duree)))/100) );
				
	this.litho.agrandir*= this.litho.expand;
	this.litho.agr = this.litho.agrandir;

	this.shape.graphics.moveTo(this.litho.memoire.semiBurinage[0].horizontal*this.litho.agr+this.litho.centre.x, this.litho.memoire.semiBurinage[0].vertical*this.litho.agr+this.litho.centre.y);
	
	for (i=1; i<this.litho.calcul.finesse; i++) {
		impact = this.litho.memoire.burinage[i];
		this.shape.graphics.curveTo(impact.horizontal*this.litho.agr+this.litho.centre.x, impact.vertical*this.litho.agr+this.litho.centre.y, this.litho.memoire.semiBurinage[i].horizontal*this.litho.agr+this.litho.centre.x, this.litho.memoire.semiBurinage[i].vertical*this.litho.agr+this.litho.centre.y);

	}
	
	this.shape.graphics.curveTo(this.litho.memoire.burinage[0].horizontal*this.litho.agr+this.litho.centre.x, this.litho.memoire.burinage[0].vertical*this.litho.agr+this.litho.centre.y, this.litho.memoire.semiBurinage[0].horizontal*this.litho.agr+this.litho.centre.x, this.litho.memoire.semiBurinage[0].vertical*this.litho.agr+this.litho.centre.y);
	this.litho.agr -= .05;

	this.shape.cache(0, 0, this.canvas.width, this.canvas.height);
	
	if(this.ims >= this.litho.duree){
		
		this.active=false;
	}
	
	
}

Litho.prototype.fade = function() {
	
	createjs.Tween.get(this.shape,{loop:false, ignoreGlobalPause:true})
			.wait(10000)
			.to({alpha:0}, 3000, createjs.Ease.quadOut).call(this.clearShape, "", this);
}

Litho.prototype.clearShape = function(tween) {

	tween._target.uncache();
	tween._target.graphics.clear();
	
}

Litho.prototype.clearAll = function() {
	var shape_num = this.shape_ar.length;
	for(var i=0; i<shape_num; i++){
		this.shape_ar[i].uncache();
		this.shape_ar[i].graphics.clear();
	}
}
