/*
**	Author: Guillaume Gouessan - guillaumegouessan.com
*/

var SnowParticles = (function() {

	/*---------------------------------------------------
	Constructor
	---------------------------------------------------*/
	function SnowParticles(nbParticles) {
		THREE.Object3D.call(this);

		this.nbParticles = nbParticles || 600;

		var textureSmoke = new THREE.Texture(this.generateSprite());
		textureSmoke.needsUpdate = true;

		this.pgeometry = new THREE.Geometry();
		var material = new THREE.ParticleBasicMaterial( { size: 0.05, opacity:0.2, fog: false, map: textureSmoke, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );

		this.psystem = new THREE.ParticleSystem(this.pgeometry, material);
		this.psystem.dynamic = true;
		this.add(this.psystem);

		this.Pool = {
			__pools: [],
			get: function() {
				if (this.__pools.length > 0) return this.__pools.pop();
				return null;
			},
			add: function(v) {
				this.__pools.push(v);
			}
		};

		for (var i = 0; i < this.nbParticles; i++) {
			this.pgeometry.vertices.push(new THREE.Vector3(0, 0, 0));
			this.Pool.add(i);
		}

		var pcounter = new SPARKS.SteadyCounter(this.nbParticles * 0.5);
		this.pemitter = new SPARKS.Emitter(pcounter);
		var pcounter2 = new SPARKS.SteadyCounter(this.nbParticles * 0.5);
		this.pemitter2 = new SPARKS.Emitter(pcounter2);

		this.pemitter.addInitializer(new SPARKS.Position(new SPARKS.PointZone(new THREE.Vector3(-0.8, 0, 0))));
		this.pemitter.addInitializer(new SPARKS.Lifetime(1, 1.1));
		this.pemitter.addInitializer(new SPARKS.Velocity(new SPARKS.PointZone(new THREE.Vector3(0, 0.1, -1))));
		this.pemitter.addInitializer(new SPARKS.Target(null, this.setTargetParticle.bind(this)));

		this.pemitter.addAction(new SPARKS.Age());
		this.pemitter.addAction(new SPARKS.Accelerate(-2, 1, -2));
		this.pemitter.addAction(new SPARKS.Move());
		this.pemitter.addAction(new SPARKS.RandomDrift(20, 10, 0));

		this.pemitter.addCallback("created", this.onParticleCreated.bind(this));
		this.pemitter.addCallback("dead", this.onParticleDead.bind(this));

		this.pemitter2.addInitializer(new SPARKS.Position(new SPARKS.PointZone(new THREE.Vector3(0.8, 0, 0))));
		this.pemitter2.addInitializer(new SPARKS.Lifetime(1, 1.1));
		this.pemitter2.addInitializer(new SPARKS.Velocity(new SPARKS.PointZone(new THREE.Vector3(0, 0.1, -1))));
		this.pemitter2.addInitializer(new SPARKS.Target(null, this.setTargetParticle.bind(this)));

		this.pemitter2.addAction(new SPARKS.Age());
		this.pemitter2.addAction(new SPARKS.Accelerate(2, 1, -2));
		this.pemitter2.addAction(new SPARKS.Move());
		this.pemitter2.addAction(new SPARKS.RandomDrift(20, 10, 0));

		this.pemitter2.addCallback("created", this.onParticleCreated.bind(this));
		this.pemitter2.addCallback("dead", this.onParticleDead.bind(this));

		this.pemitter.start();
        this.pemitter2.start();

		this.psystem.sortParticles = true;

	}

	SnowParticles.prototype = new THREE.Object3D();
	SnowParticles.prototype.constructor = SnowParticles;

	/*---------------------------------------------------
	Life Management
	---------------------------------------------------*/
	SnowParticles.prototype.setTargetParticle = function() {
		var target = this.Pool.get();
		return target;
	}

	SnowParticles.prototype.onParticleCreated = function(p) {
		var target = p.target;
		if (target) {
			this.pgeometry.vertices[target] = p.position;
		}
	}

	SnowParticles.prototype.onParticleDead = function(p) {
		var target = p.target;
		if (target) {
			this.pgeometry.vertices[target] = new THREE.Vector3(0, 0, 0);

			this.Pool.add(target);
		}
	}

	/*---------------------------------------------------
	Drawing
	---------------------------------------------------*/
	SnowParticles.prototype.generateSprite = function() {
		var canvas = document.createElement('canvas');
		canvas.width = 64;
		canvas.height = 64;

		var context = canvas.getContext('2d');
		context.beginPath();
		context.arc(32, 32, 30, 0, Math.PI * 2, false);
		context.closePath();
		context.lineWidth = 0.5;
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


	return SnowParticles;

})();
