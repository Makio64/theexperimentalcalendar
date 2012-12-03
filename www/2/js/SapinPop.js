/**
* Makio - @Makio64 - www.makiopolis.com
*/
sapinLineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

var SapinPop = function(scene, angle, radius, scale)
{
	this.scene = scene;
	this.lines = [];
    this.angle = angle;
    this.radius = radius;
	this.geometry = new THREE.Geometry();
    var cos, sin;
    var division = 3+Math.floor(Math.random()*3);
    for (var j = division - 1; j >= 0; j--) {
        cos = Math.cos(j/division*Math.PI);
        sin = Math.sin(j/division*Math.PI);
        
        for (var i = 0; i < sapinVectors.length; i++) {
            this.geometry.vertices.push(new THREE.Vector3(cos*sapinVectors[i].x,sapinVectors[i].y,sin*sapinVectors[i].x));
        };
       for (var i = sapinVectors.length - 2; i >= 0; i--) {
        	this.geometry.vertices.push(new THREE.Vector3(-cos*sapinVectors[i].x,sapinVectors[i].y,sin*sapinVectors[i].x));
        };
    }

    this.line = new THREE.Line(this.geometry, this.material);
    this.line.scale.x = 0.00001;
    this.line.scale.y = 0.00001;
    this.line.scale.z = 0.00001;
    this.line.position.x = Math.cos(this.angle)*this.radius;
    this.line.position.z = Math.sin(this.angle)*this.radius;
    scene.add(this.line);

    this.scale =scale;
    TweenLite.to(this.line.scale,.6,{rotation:Math.PI*Math.random(), ease:Back.easeOut, x:this.scale,y:this.scale,z:this.scale});
}

SapinPop.prototype.constructor = SapinPop;