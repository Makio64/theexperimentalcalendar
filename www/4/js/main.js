/*
**	Author: Guillaume Gouessan - guillaumegouessan.com
*/

/* ========================================================
	Cool function for scope binding
=========================================================*/
Function.prototype.bind = function(scope) {
  var _function = this;

  return function() {
    return _function.apply(scope, arguments);
  }
}

/* ========================================================
	When dom ready, we init our application
=========================================================*/
$(document).ready(function() {

	// if webgl is not supported.
	if (Detector.webgl === false) {
		Detector.addGetWebGLMessage();
		return;
	}

	var app = new Application();
	app.init();

	$(document).on("mousemove", function(e) {
		app.mousemove(e);
	});
});

/* ========================================================
	Main application
=========================================================*/
var Application = (function() {

	/*---------------------------------------------------
	Constructor
	---------------------------------------------------*/
	function Application() {
		this.domContainer = $("#container");
		this.angle = 0;
		this.speed = -0.2;
		this.skyColor = 0x272a36;
		this.treeColor = 0xFFFFFF;
		this.nbTrees = 30;
		this.nbRocks = 40;
		this.nbParticles = 400;
		this.crazyColors = [0xff7f18, 0x189aff, 0x7dc332, 0xff67dd];
		this.mouse = new THREE.Vector2(0,0);
	}
	Application.prototype.constructor = Application;

	/*---------------------------------------------------
	Initialisation
	---------------------------------------------------*/
	Application.prototype.init = function() {

		// Tween Engine start (for the snow particles SPARKS)
		TWEEN.start();

		// We create the renderer
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			preserveDrawingBuffer: true,
			maxLights: 2,
			clearColor: this.skyColor,
			clearAlpha: 1
		});
		this.renderer.setFaceCulling(0);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.domContainer.append(this.renderer.domElement);
		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;

		// Scene + fog
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.FogExp2(this.skyColor, 0.2);

		// Camera
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
		this.scene.add(this.camera);
		this.camera.position.y = 1;
		this.camera.lookAt(new THREE.Vector3(0, 4, -20));

		// Lights
		this.pointLight = new THREE.PointLight(0xFFFFFF, 1.0);
		this.scene.add(this.pointLight);


		// Content of the scene
		this.floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 30, 30), new THREE.MeshBasicMaterial({color: this.treeColor}));
		this.scene.add(this.floor);
		this.floor.rotation.x = -Math.PI * 0.5;

		var tree;
		this.trees = [];
		for(var i = 0; i < this.nbTrees; i++){
			tree = new Tree(this.treeColor, Math.random() * 8 + 4, Math.random() * 5 + 3, 0.5);
			this.scene.add(tree);
			this.trees.push(tree);
		}

		var rock;
		this.rocks = [];
		for(i = 0; i < this.nbRocks; i++){
			rock = new Rock(this.treeColor, 0.5);
			this.scene.add(rock);
			this.rocks.push(rock);
		}

		this.snowman = new Snowman();
		this.scene.add(this.snowman);
		this.snowman.position.z = -2;
		this.snowman.position.y = -0.3;

		this.snowParticles = new SnowParticles(this.nbParticles);
		this.scene.add(this.snowParticles);
		this.snowParticles.position.set(0, -1.4, -3);

		this.starrySky = new StarrySky();
		this.scene.add(this.starrySky);
		this.starrySky.position.set(0,6,-15);
		this.starrySky.rotation.x = -Math.PI * 0.25;

		this.initSound();

		this.animate();
	};

	/*---------------------------------------------------
	Audio Management
	---------------------------------------------------*/
	Application.prototype.initSound = function() {
		this.songPlayer = new SongPlayer();
		this.songPlayer.addSong("Let it snow", "Dean Martin - freel0ader remix","assets/sounds/letitsnow.mp3");
		this.songPlayer.events.songStarted.add(this.onSongStart.bind(this));
		this.songPlayer.events.songCompleted.add(this.onSongComplete.bind(this));
		this.songPlayer.playSong(0);
	}

	Application.prototype.onSongStart = function() {
		this.songStarted = true;
	};

	Application.prototype.onSongComplete = function() {
		this.changeBackgroundColor(this.skyColor);
		this.snowman.resetCrazyness();
	};

	/*---------------------------------------------------
	Mouse events
	---------------------------------------------------*/
	Application.prototype.mousemove = function(e) {
		this.mouse.x = ((e.clientX / window.innerWidth) - 0.5) * 2;
		this.mouse.y = ((e.clientY / window.innerHeight) - 0.5) * 2;
	};

	/*---------------------------------------------------
	Color crazyness
	---------------------------------------------------*/
	Application.prototype.changeBackgroundColor = function(color) {
		this.renderer.setClearColorHex(color, 1);
		this.scene.fog = new THREE.FogExp2(color, 0.2);
	};

	/*---------------------------------------------------
	Loop
	---------------------------------------------------*/
	Application.prototype.animate = function() {
		this.render();
		requestAnimationFrame(this.animate.bind(this));
	};

	Application.prototype.render = function() {

		for(var i = 0; i < this.nbTrees; i++){
			this.trees[i].update(this.speed);
		}

		for(i = 0; i < this.nbRocks; i++){
			this.rocks[i].update(this.speed);
		}


		if(this.songStarted){
			this.snowman.update();
			var soundHighAverage = this.songPlayer.getSoundDataAverageHigh();
			var soundAverage = this.songPlayer.getSoundDataAverage();
			var soundIntensity = this.songPlayer.getSoundDataIntensity() / 163;

			if(soundHighAverage > 150) {
				this.snowman.pumpItUp();
			}
			if(soundHighAverage > 170){
				this.snowman.headBang();
				this.changeBackgroundColor(this.crazyColors[parseInt(Math.random() * this.crazyColors.length, 10)]);
			}

		}

		this.camera.rotation.y += ((-this.mouse.x * Math.PI * 0.25) - this.camera.rotation.y) * 0.1;
		this.camera.rotation.x += ((-this.mouse.y * Math.PI * 0.125) - this.camera.rotation.x) * 0.1;

		this.renderer.render(this.scene, this.camera);
	};

	return Application;

})();
