/*
Denis Hovart, 2012

Available under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

var circleImg = new Image();
circleImg.src = "img/circle.png";

var Tentacle = function (position, nbParts, orientation) {
    this.parts = [];
    this.nbParts = nbParts;
    this.position = position;
    this.distanceInBetween = 4;
    this.orientation = orientation;
    this.partSize = 15;
    
    this.parts.push({
        position : this.position,
        scaleX : 1,
        scaleY : 1
    });
    for (var i = 1; i < nbParts; i++) {
      var part = {};
      part.scaleX = 1 - (i / this.nbParts);
      part.scaleY = 1 - (i / this.nbParts);
      part.position = new Vec2d(
          position.x + Math.cos(this.orientation) * this.distanceInBetween * i,
          position.y + Math.sin(this.orientation) * this.distanceInBetween * i
      );
      this.parts.push(part);
    }
};

Tentacle.prototype.update = function() {
    var i = 1, len = 4;
    while( i < len ) {
        this.parts[i].position.x = this.parts[i-1].position.x + ( this.distanceInBetween * Math.cos( this.orientation ) );
        this.parts[i].position.y = this.parts[i-1].position.y + ( this.distanceInBetween * Math.sin( this.orientation ) );
        i++;
    }
    
    for (var i = len; i < this.nbParts; i++) {
        
        //var r = 2 + parseInt(Math.random() *len - 1);
	var r = 2 + parseInt(Math.random() * 2);
	if(typeof this.parts[i-r] == "undefined") continue; 
        var dist = Vec2d.subtract( this.parts[i].position, this.parts[i-r].position );
    
        dist.normalize();
        dist.multiply(this.distanceInBetween);
        this.parts[i].position = Vec2d.add(this.parts[i-1].position, dist);
        
    }
}

Tentacle.prototype.draw = function (context) {
    for (var i = 0; i < this.nbParts; i++) {
        context.save();
        context.translate(this.parts[i].position.x, this.parts[i].position.y);
        context.scale(this.parts[i].scaleX, this.parts[i].scaleY);
        context.drawImage(circleImg, -this.partSize/2, -this.partSize/2, this.partSize, this.partSize);
        context.restore();
    }
};

var Medusa = function(radius, position, orientation, maxSpeed, maxRotation) {
    Agent.call(this, position, orientation, maxSpeed, maxRotation);

    this.radius = 2;
    this.tentacles = [];
    this.nbTentacles = 8;
    this.tentaclesLength = 70;
    
    var nbTentacles = this.nbTentacles, i = 0;
    var margin = 10 * (Math.PI/180);
    while (nbTentacles--) {
        var tx = this.position.x + (Math.cos(margin + Math.PI/2 + (i * (Math.PI*2 - margin)) / this.nbTentacles)) * this.radius;
        var ty = this.position.y + (Math.sin(margin + Math.PI/2 + (i * (Math.PI*2 - margin)) / this.nbTentacles)) * this.radius;
        var to = Math.atan2(ty - this.position.y, tx - this.position.x);
        var tentacle = new Tentacle(new Vec2d(tx, ty), this.tentaclesLength, to);
        this.tentacles.push(tentacle);
        i++;
    }
};

Medusa.prototype = Object.create(Agent.prototype);

Medusa.prototype.update = function() {
    Agent.prototype.update.apply(this, arguments);
    var nbTentacles = this.nbTentacles, i = 0;
    var margin = 180 * (Math.PI/180);
    while (nbTentacles--) {

        // this.tentacles[i].position.x = (this.position.x) + ( Math.cos((i * Math.PI*2) / this.nbTentacles) * this.radius);
        // this.tentacles[i].position.y = (this.position.y) + ( Math.sin((i * Math.PI*2) / this.nbTentacles) * this.radius);
        this.tentacles[i].position.x = this.position.x + ( (Math.cos(this.orientation - Math.PI/2 - margin + (i * (Math.PI*2 - margin)) / this.nbTentacles)) * this.radius);
        this.tentacles[i].position.y = this.position.y + ( (Math.sin(this.orientation - Math.PI/2 - margin + (i * (Math.PI*2 - margin)) / this.nbTentacles)) * this.radius);
        this.tentacles[i].orientation = Math.atan2(this.tentacles[i].position.y - this.position.y, this.tentacles[i].position.x - this.position.x);

        this.tentacles[i].update();
        i++;
    }
};

Medusa.prototype.draw = function (context) {
    var nbTentacles = this.nbTentacles, i = 0;
    while (nbTentacles--) {
        this.tentacles[i].draw(context);
        i++;
    }
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(-Math.PI/2 + this.orientation);
    // context.drawImage(eyeImg, -this.radius, -this.radius, this.radius*2, this.radius*2);
    context.restore();
};
