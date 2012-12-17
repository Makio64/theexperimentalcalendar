// bind

Function.prototype.bind = function( scope )
{
	var _function = this;
	return function()
	{
		return _function.apply( scope, arguments );
	}
}

// dom ready

$( document ).ready( function()	{

	if( Detector.webgl === false )
	{
		Detector.addGetWebGLMessage();
		return;
	}
	var app = new Application(app);
	app.load();
});

// Main Application

var Application = ( function()
{
	function Application()
	{
		this.domContainer = $( "#container" );

		this.MARGIN = 120;
		$( "#loaderScreen" ).css( "margin-top", window.innerHeight * .5 - this.MARGIN - 100 + "px")

		this.skyColor = 0x131422;
		this.deactivateMouse = false;

	}
	Application.prototype.constructor = Application;

	Application.prototype.load = function load()
	{
		this.projectLoader = new ProjectLoader();
		this.projectLoader.signalLoaded.addOnce( this.onProjectLoaded, this );
	}

	Application.prototype.onProjectLoaded = function onProjectLoaded()
	{
		this.init();
		this.initSound();
	}

	Application.prototype.initSound = function initSound()
	{
		this.audio = new Audio();
		this.audio.addEventListener('canplay', this.onCanPlay.bind( this ), false);

		this.audio.src = 'mp3/m83_night.mp3';
		this.audio.controls = false;
		this.audio.autoplay = false;
		document.body.appendChild(this.audio);
		//this.audio = document.getElementById( "musicplayer" );
		//this.audio.addEventListener('canplay', this.onCanPlay.bind( this ) );
		//this.songPlayer = new SongPlayer();
		//var song = this.songPlayer.addSong("Night", "m83","mp3/m83_night.mp3");
		//song.load();
		//this.songPlayer.events.songStarted.add(this.onSongStart.bind(this));
		//this.songPlayer.events.songCompleted.add(this.onSongComplete.bind(this));
		//this.songPlayer.playSong(0);
	}

	Application.prototype.onCanPlay = function onCanPlay()
	{
		$( "#loaderScreen" ).html( "CLICK TO PLAY" );
		$( "#loaderScreen" ).click( this.start.bind( this ) );
	}

	Application.prototype.init = function init()
	{
		window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
		this.onWindowResize();

		this.timeOnPath = 0;
		this.speed = 0.0325;
		this.acc = 0.00005;
		this.speedMax = 0.06;//0.06;
		this.part = 1;

		this.currentFogStart = 160;
		this.currentFogEnd = 350;

		// Scene
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog( this.skyColor, this.currentFogStart, this.currentFogEnd );//new THREE.FogExp2( 0xffffff, .003 );//( 0xffffff, 300, 800 );

		// Camera
		this.camera = new THREE.PerspectiveCamera( 60, this.WIDTH / this.HEIGHT, 1, 400 );
		this.camera.position.z = -60;
		this.camera.position.y = 40;
		//this.camera.rotation.x = -Math.PI * .1;
		//this.scene.add( this.camera );

		// Renderer
		this.renderer = new THREE.WebGLRenderer({
			  antialias: true
			, preserveDrawingBuffer: true
			, clearColor: this.skyColor
			, clearAlpha: 1
		});
		//this.renderer.setFaceCulling( 0 );
		this.renderer.setSize( this.WIDTH, this.HEIGHT );
		this.renderer.autoClear = false;
		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.clear();
		this.domContainer.append( this.renderer.domElement );

		// Composer
		var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
		var renderTarget = new THREE.WebGLRenderTarget( this.WIDTH, this.HEIGHT, renderTargetParameters );
		this.composer = new THREE.EffectComposer( this.renderer, renderTarget );

		var renderPass = new THREE.RenderPass( this.scene, this.camera );
		var bloomPass = new THREE.BloomPass( .6, 20, 4, 128 );
		var filmPass = new THREE.ShaderPass( THREE.VignetteShader );
		var effectBleach = new THREE.ShaderPass( THREE.BleachBypassShader );
		effectBleach.uniforms[ "opacity" ].value = .2;
		effectBleach.renderToScreen = true;


		this.composer.addPass( renderPass );
		this.composer.addPass( bloomPass );
		this.composer.addPass( filmPass );
		this.composer.addPass( effectBleach );

		// XP
		this.createLights();
		this.createExperiment();

		// Stats
		/*this.stats = new Stats();
		this.stats.domElement.style.position = "absolute";
		this.stats.domElement.style.top = "0px";
		container.appendChild( this.stats.domElement );*/

		this.part = 0;
		this.animate();
	}

	Application.prototype.start = function start()
	{
		this.audio.play();
		this.audio.addEventListener( "ended", this.onMusicEnded.bind( this ), false );
		$( "#loaderScreen" ).css( "display", "none" );
		this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
		this.part = 1;

		document.addEventListener( "mousemove", this.onDocumentMouseMove.bind( this ), false );
	}

	Application.prototype.onMusicEnded = function onMusicEnded()
	{
		console.log( "qweqeqw" ); 
		$( "#loaderScreen" ).html( "REPLAY" );
		$( "#loaderScreen" ).css( "display", "block" );
		$( "#loaderScreen" ).click( function() { window.location.reload(); } );
	}

	Application.prototype.createLights = function createLights()
	{
		var map = $( "#heightmap" );
		
		this.mainLight = new THREE.PointLight( 0xffffff, .9, 2000 );
		this.mainLight.position.set( map.width() * 5, 950, -map.height() * 5 );
		this.scene.add( this.mainLight );

		this.saumonLight = new THREE.PointLight( 0xd8aed6, .4 );
		this.saumonLight.position.set( map.width() * .75 * 10, 200, 0 );
		this.scene.add( this.saumonLight );

		this.blueLight = new THREE.PointLight( 0x9698ea, .4 );
		this.blueLight.position.set( map.width() * .25 * 10, 200, -map.height() * 10 );
		this.scene.add( this.blueLight );

		var whiteLightStar = new THREE.PointLight( 0xffffff, .17, 1000 );
		whiteLightStar.position.x = -100;
		whiteLightStar.position.y = 100;
		whiteLightStar.position.z = -map.height() * 5;
		this.scene.add( whiteLightStar );

		this.scene.add( new THREE.AmbientLight( 0x10111f ) );
	}

	Application.prototype.createExperiment = function createExperiment()
	{
		this.svgReader = new SVGReader();
		this.svgReader.parse();

		this.createFloor();
		this.createObjects();
		this.createPaths();
	}

	Application.prototype.createFloor = function createFloor()
	{
		this.floor = new Floor( this.svgReader.data[ "zone" ] );
		this.scene.add( this.floor );
	}

	Application.prototype.createObjects = function createObjects()
	{
		this.decors = new Decors( this.svgReader.data[ "decors" ] );
		this.scene.add( this.decors );

		this.star = new Star();
		this.scene.add( this.star );

		this.cameraTarget = new CameraTarget( this.star );
		this.cameraTarget.add( this.camera );
		this.scene.add( this.cameraTarget );
		this.camera.lookAt( this.saumonLight.position );

		this.ribbons = new Ribbons( this.star );
		this.scene.add( this.ribbons );

		this.messageEnd = new MessageEnd( this.svgReader.data[ "message" ] );
		this.messageEnd.create();
	}

	Application.prototype.createPaths = function createPaths()
	{
		this.path = new THREE.Path();
		U3D.createPath( this.path, this.svgReader.data[ "path" ], this.star );
		this.cameraTarget.position.x = this.path.getPointAt( 0 ).x;
		this.cameraTarget.position.z = this.path.getPointAt( 0 ).y;

		this.pathEnd = new THREE.Path();
		U3D.createPath( this.pathEnd, this.svgReader.data[ "pathend" ], null, Globals.sapinBig.position.x - 23.5 );

//		this.part = 3;
	}

	Application.prototype.animate = function animate()
	{
		this.render();
		requestAnimationFrame( this.animate.bind( this ) );
	}

	Application.prototype.render = function render()
	{
		//this.renderer.setClearColor( this.skyColor, 1 );
		//this.renderer.clear();
		//this.renderer.render( this.scene, this.camera );

		/*this.star.position.x = Globals.sapinBig.position.x - 23.5;
		this.star.position.y = Globals.sapinBig.position.y + 420;
		this.star.position.z = Globals.sapinBig.position.z;
		this.star.rotation.x = -Math.PI * .2;*/

		/*this.star.position.x = Globals.sapinBig.position.x - 23.5 + 210;
		this.star.position.y = Globals.sapinBig.position.y + 120;
		this.star.position.z = Globals.sapinBig.position.z;
		this.star.rotation.y = -Math.PI * .05;*/
		//return;
		if( this.part == 1 || this.part == 2 )
		{
			if( this.speed < this.speedMax )
			{
				this.speed += this.acc;
			}

			this.timeOnPath += this.speed * Globals.clock.getDelta();

			var p, percent
			  , yStar;
			if( this.part == 1 )
			{
				if( this.timeOnPath > 1 )
				{
					this.part = 2;
					this.timeOnPath = 0;
					this.speed *= 3;
					this.speedMax *= 3;
					this.currentStarY = this.star.position.y;
					this.deactivateMouse = true;
					return;
				}


				p = this.path.getPointAt( this.timeOnPath );
				//p2 = this.path.getPointAt( Math.min( 1, this.timeOnPath + .015 ) );
			}
			else if ( this.part == 2 )
			{
				if( this.timeOnPath > 1 )
				{
					this.part = 3;
					this.timeOnPath = 0;

					//this.scene.fog = new THREE.Fog( this.skyColor, 400, 700 );//new THREE.FogExp2( 0xffffff, .003 );//( 0xffffff, 300, 800 );
					this.camera.far = 750;
					this.camera.updateProjectionMatrix();

					this.scene.add( this.messageEnd );
					this.messageEnd.position.y = 40;
					this.messageEnd.play();
					return;
				}
				
				p = this.pathEnd.getPointAt( this.timeOnPath );
				percent = this.timeOnPath;
				yStar = this.currentStarY + ( this.timeOnPath * this.timeOnPath ) * ( Globals.sapinBig.position.y + 410 );
			}
			//this.cameraTarget.render( p2, yStar );
			this.cameraTarget.render( yStar, percent );
			this.star.render( p, yStar );
			this.ribbons.render( p );
		}
		else if ( this.part == 3 )
		{
			p = this.pathEnd.getPointAt( 1 )
			//this.cameraTarget.render( ( Globals.sapinBig.position.y + 410 ), 1 );

			//this.cameraTarget.rotation.y += .01;
			var drx = -.45 - this.cameraTarget.rotation.x;
			this.cameraTarget.rotation.x += drx * .02;
			var dry = Math.PI - this.cameraTarget.rotation.y;
			this.cameraTarget.rotation.y += dry * .02;
			var dz = p.y - 70 - this.cameraTarget.position.z;
			this.cameraTarget.position.z += dz * .02;

			if( this.currentFogStart < 399 || this.currentFogEnd < 699 )
			{
				this.currentFogStart += ( 400 - this.currentFogStart ) * .02;
				this.currentFogEnd += ( 700 - this.currentFogEnd ) * .02;
				this.scene.fog = new THREE.Fog( this.skyColor, this.currentFogStart, this.currentFogEnd );
			}
			//return;
			/*var dx = p.x - this.cameraTarget.position.x;
			var dy = ( Globals.sapinBig.position.y + 410 ) - this.cameraTarget.position.y;
			this.cameraTarget.position.x += dx * .2;
			this.cameraTarget.position.y += dy * .2;

			

			// debug message end
			//this.ribbons.render( p );
			//this.cameraTarget.rotation.x -= .01;
			//this.star.rotation.x = -0.7;
			//this.star.rotation.y = Math.PI;

			/*
			this.cameraTarget.rotation.y = Math.PI;
			this.cameraTarget.position.x = p.x;
			this.cameraTarget.position.z = p.y - 30;
			this.cameraTarget.position.y = ( Globals.sapinBig.position.y + 410 );
			this.cameraTarget.rotation.x = -.25;
			console.log( this.cameraTarget.position, this.cameraTarget.rotation );
			*/
		}

		//this.star.rotation.y += .01;

		/*var offset = this.star.matrixWorld.multiplyVector3( new THREE.Vector3(0,50,100) );
		console.log( offset );
		
		this.camera.position.x = offset.x;
		this.camera.position.y = offset.y;
		this.camera.position.z = offset.y;

		this.camera.position.x = this.star.position.x;
		this.camera.position.y = this.star.position.y + 30;
		this.camera.position.z = this.star.position.z - 100;
		this.camera.lookAt( this.star.position );*/

		this.composer.render( 0.1 );

		//this.stats.update();
	}

	Application.prototype.renderCamera = function renderCamera( p )
	{
		var rad = 50;
		var px = p.x + rad * Math.cos( Math.PI * .5 );
		var py = p.y + rad * Math.sin( Math.PI * .5 );


		var dx = px - this.camera.position.x;
		var dy = py - this.camera.position.z ;
		var rad = Math.atan2( dy, dx );

		this.camera.position.x += dx * .9;
		this.camera.position.z += dy * .9;
		//var nry = -rad + Math.PI * .5;
		//this.camera.rotation.y += ( nry - this.camera.rotation.y ) * .08;

		//this.camera.lookAt( this.star.position );
	}

	Application.prototype.onWindowResize = function onWindowResize()
	{
		this.WIDTH = window.innerWidth;
		this.HEIGHT = window.innerHeight - this.MARGIN * 2;

		if( this.renderer == null )
			return;

		this.renderer.setSize( this.WIDTH, this.HEIGHT );

		this.camera.aspect = this.WIDTH / this.HEIGHT;
		this.camera.updateProjectionMatrix();
	}

	Application.prototype.onDocumentMouseMove = function onDocumentMouseMove( event )
	{
		if( this.deactivateMouse == true )
			return;

		var percentX = event.clientX / this.WIDTH
		  , percentY = event.clientY / this.HEIGHT;
		if( this.part < 3 )
		{
			this.camera.position.y = 30 - percentY * 18;
			this.camera.rotation.x = -2.6 - percentY * .3;

			this.camera.position.z = -40 + percentX * 20;
		}
		else
		{
			this.camera.rotation.y = Math.PI;// + percentX * .02;
		}
	}

	return Application;

} )();