/*
**	Author: Guillaume Gouessan - guillaumegouessan.com
*/

var StarrySky = (function() {

	/*---------------------------------------------------
	Constructor
	---------------------------------------------------*/
	function StarrySky(nbParticles) {
		THREE.Object3D.call(this);

		this.nbParticles = nbParticles || 400;

		var textureSmoke = new THREE.Texture(this.generateSprite());
		textureSmoke.needsUpdate = true;

		this.pgeometry = new THREE.Geometry();
		var material = new THREE.ParticleBasicMaterial( { size: 0.2, opacity:0.2, fog: false, map: textureSmoke, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );

		this.psystem = new THREE.ParticleSystem(this.pgeometry, material);
		this.psystem.dynamic = true;
		this.add(this.psystem);

		for (var i = 0; i < this.nbParticles; i++) {
			this.pgeometry.vertices.push(new THREE.Vector3(Math.random() * 60 - 30, Math.random() * 4 - 2, Math.random() * 20 - 10));
		}

		this.psystem.sortParticles = true;

	}

	StarrySky.prototype = new THREE.Object3D();
	StarrySky.prototype.constructor = StarrySky;
	
	/*---------------------------------------------------
	Drawing
	---------------------------------------------------*/
	StarrySky.prototype.generateSprite = function() {
        var canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;

        var context = canvas.getContext('2d');
        context.beginPath();
        context.arc(32, 32, 30, 0, Math.PI * 2, false);
        context.closePath();
        context.lineWidth = 0.5; //0.05
        context.stroke();
        context.restore();

        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.6, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        context.fillStyle = gradient;
        context.fill();

        return canvas;
    };


	return StarrySky;

})();
