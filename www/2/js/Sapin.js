/**
* Makio - @Makio64 - www.makiopolis.com
*/
var sapinVectors = [{x:0,y:0},{x:1,y:0},{x:1,y:3},{x:4,y:3},{x:2,y:6},{x:3,y:6},{x:1,y:9},{x:2,y:9},{x:0,y:13}];

var Sapin = function(scene)
{
	this.scene = scene;
	this.lines = [];
	this.geometry = new THREE.Geometry()
	this.material = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
    });
    this.vx = 0;
    this.ax = 0;
    this.speed = 0;

    var vectors = [{x:0,y:0},{x:1,y:0},{x:1,y:3},{x:4,y:3},{x:2,y:6},{x:3,y:6},{x:1,y:9},{x:2,y:9},{x:0,y:13}];

    for (var i = 0; i < vectors.length; i++) {
    	this.geometry.vertices.push(new THREE.Vector3(vectors[i].y,0,vectors[i].x));
    };

   for (var i = vectors.length - 2; i >= 0; i--) {
    	this.geometry.vertices.push(new THREE.Vector3(vectors[i].y,0,-vectors[i].x));
    };

    var line = new THREE.Line(this.geometry, this.material);
    this.rotation = line.rotation;

    this.particlesGeo = new THREE.Geometry();
    this.values = [];
    
    

    for (var i = 1; i < vectors.length; i++) {
        var start = vectors[i-1]; 
        var dest = vectors[i];
        var division = 100;
        for (var j = 0; j < division; j++) {
            var vertex = new THREE.Vector3();
            vertex.x = start.x + (dest.x-start.x)*j/division;
            this.values.push({coeff:vertex.x,x:0});
            vertex.y = start.y + (dest.y-start.y)*j/division;
            this.particlesGeo.vertices.push( vertex );
            
            vertex = new THREE.Vector3();
            vertex.x = -(start.x + (dest.x-start.x)*j/division);
            this.values.push({coeff:vertex.x,x:Math.PI});
            vertex.y = start.y + (dest.y-start.y)*j/division;
            this.particlesGeo.vertices.push( vertex );
        };
    }

    if(navigator.appVersion.indexOf("Mac")!=-1){
        console.log("mac");
        this.material = new THREE.ParticleBasicMaterial( { size: 0.3, depthTest: false, color:0xFFFFFF } );
    } else {
        console.log("windows");
        var sprite = THREE.ImageUtils.loadTexture( "img/circle.png" );
        this.material = new THREE.ParticleBasicMaterial( { size: .5,  depthTest: false, map: sprite, blending:THREE.AdditiveBlending,  transparent : true  } );
    }
    this.particleSystem = new THREE.ParticleSystem(this.particlesGeo, this.material);
    this.particleSystem.sortParticles = false;

    scene.add( this.particleSystem );

    this.update = function(scroll) 
    {    
        if(scroll) {
            this.ax += Math.PI/40;
        } else {
            this.ax -= Math.PI/40; 
        }
        this.vx += this.ax;
        this.speed += this.vx;
        var s = this.speed;
        if(this.speed=0)
            return;
        var coeffX = 2;
        var coeffZ = 2;
        var degreeMax = 40;
 
        var basevx = tmpvx = Math.PI*degreeMax/180;
        var p;
        var v;
        var deceleration = basevx/1900;
        var l = this.particlesGeo.vertices.length;
        for (var i = 0; i < l; i++) {
            if(tmpvx<0)
                return;
            p = this.particlesGeo.vertices[i];
            v = this.values[i];
            v.x += tmpvx;
            p.x = Math.cos(v.x)*v.coeff; 
            p.z = Math.sin(v.x)*v.coeff; 
            tmpvx -= deceleration;
        };
        this.particlesGeo.verticesNeedUpdate = true;
    }
}

Sapin.prototype.constructor = Sapin;