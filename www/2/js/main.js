var mouseX = 0, mouseY = 0,
screenWidth = $(window).width(),
screenHeight = $(window).width(),
windowHalfX = $(window).width()/2,
windowHalfY = $(window).height()/2,
isWebGL = Detector.webgl,
tanFOV, windowHeight,
stats, container, camera, scene, renderer, composer, analyser, renderTargetParameters,
effectFilm,
state = 0,
treeCount = 0, 
heartTree,
cameraOffset = {x:0,y:0,z:0};
cameraPower = {x:80,y:60,z:70};


$(document).ready(function() 
{
	initScene();
	init();
	animate();	
});

function initScene(){
	container = document.createElement('div');
	document.body.appendChild(container);

	//same camera for all
	camera = new THREE.PerspectiveCamera( 25, $(window).width() / $(window).height(), 1, 500 );
	windowHeight =  $(window).height();

	camera.aspect = $(window).width() / Math.floor($(window).height());
	cameraOffset.x = 0;
	cameraOffset.y = 45;
	cameraOffset.z = 105;
	camera.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z);
    camera.lookAt(new THREE.Vector3(0,6.8,0));
	camera.updateProjectionMatrix();
	
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000104, 0.0000675 );

	scene.add(camera);
	
	renderer = new THREE.WebGLRenderer({clearColor: 0xFFFFFF, clearAlpha: 0, antialias: false});
	renderer.setSize( $(window).width(), $(window).height());
	renderer.setClearColor( 0xFFFFFF, 1 );
	renderer.autoClear = false;
	renderer.sort = false;
	container.appendChild( renderer.domElement );
	
	// postprocessing
	var renderModel = new THREE.RenderPass( scene, camera );
	var effectBloom = new THREE.BloomPass( 0.95, 25, 4, 1024 );
	effectFilm = new THREE.FilmPass( 1, 1, screenHeight*2, true );
	effectFocus = new THREE.ShaderPass( THREE.FocusShader );
	effectFocus.uniforms[ "screenWidth" ].value = screenWidth;
	effectFocus.uniforms[ "screenHeight" ].value = screenHeight;
	effectFocus.renderToScreen = true;

	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: true };

	composer = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters) );

	composer.addPass( renderModel );
	composer.addPass( effectBloom );
	composer.addPass( effectFilm );
	composer.addPass( effectFocus );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
	
	$(window).resize(function() {
		renderer.setSize( $(window).width(), $(window).height());
		$(container).height( Math.floor($(window).height()) );
		camera.aspect = $(window).width() / Math.floor($(window).height());
		camera.lookAt(new THREE.Vector3(0,6.8,0));
		
		camera.updateProjectionMatrix();
		composer.reset( new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters));
	});
}

var sapin, star;

function init() {

	var h,  cube, angle, radius;
	
	cube = new THREE.Mesh(
   		new THREE.CubeGeometry( 40, 1, 40, 1, 1, 1 ),
    	new THREE.MeshBasicMaterial( {wireframe:true} )
	);
	cube.position.y = -1;
	// scene.add(cube);
	cameraYOffset = 45;
	cameraZOffset = 105;
	cameraXOffset = 0;
	for (var i = 0; i < 10; i++) {
		h = Math.random()*1.8+.5;
		cube = new THREE.Mesh(
	   		new THREE.CubeGeometry( Math.random()*2.9+.9, h, Math.random()*2.9+.9, 1, 1, 1 ),
	    	new THREE.MeshBasicMaterial( {wireframe:true, color :Math.random()*0xFFFFFF} )
		);
		cube.position.y = h/2;
		cube.rotation.y = Math.PI*Math.random();
		radius = Math.random()*12+7;
		angle = (i/10*Math.PI*2)+Math.PI/8*Math.random();
		cube.position.x = Math.cos(angle)*radius;
		cube.position.z = Math.sin(angle)*radius;
		scene.add(cube);
	}

	sapin = new Sapin(scene);
	star = new Star(scene);	

	

	var audio = new Audio();
	audio.addEventListener('canplay', function() {
  		setTimeout(function() {  
  			star.start();
  			setTimeout(function() { 
  				$('body').css('cursor','pointer'); 
  				$(window).click(function(e){
	  				if(state>=1){
	  					return;
	  				}
	  				state=1;
	  				$('body').css('cursor','auto');
	  				effectFilm.uniforms.grayscale.value = false;
					TweenLite.to(cameraOffset, 2.5, {y : 25, z : 75, x : 0});
	  				setTimeout(function() { state = 2; },4000);
	  				star.randomize(139,93);
	    			audio.play();
	  			})
  			},1000);
  		}, 1200);
    }, false);

	audio.src = 'sfx/music.mp3';
	audio.controls = false;
	audio.autoplay = false;
	document.body.appendChild(audio);

	stats.update();
	var context = new webkitAudioContext();
	analyser = context.createAnalyser();

	window.addEventListener('load', function(e) {
		  var source = context.createMediaElementSource(audio);
		  source.connect(analyser);
		  analyser.connect(context.destination);
	}, false);
}

function animate() {
	var coeff = 0.05;
	camera.position.y += ((mouseY/screenHeight)*cameraPower.y+cameraOffset.y-camera.position.y)*coeff;
	camera.position.z += ((mouseY/screenHeight)*cameraPower.z+cameraOffset.z-camera.position.z)*coeff;//45
	camera.position.x += ((mouseX/screenWidth)*cameraPower.x+cameraOffset.x-camera.position.x)*coeff;
	camera.lookAt(new THREE.Vector3(0,6.8,0));

	if(state>=1){
		
		sapin.update((mouseX>screenWidth/2));
	}
	
	stats.update();
	if(state==2){
		var freqByteData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(freqByteData); //analyser.getByteTimeDomainData(freqByteData);

		var OFFSET = 100;
		
		var magnitude = freqByteData[OFFSET];
		if(magnitude>145){
			new SapinPop(scene,Math.PI*2*Math.random(),30+Math.random()*35, Math.random()*.05+.1)
			treeCount++;
			if(treeCount>=300){
				setTimeout(function(){
					star.merryChristmas();
					state = 4;
				},3000)
				state = 3;
				TweenLite.to(cameraOffset, 3, {y : 70, z : 135, x : 0});
				TweenLite.to(cameraPower, 3, {y : 240, z : 175, x : 280});
			}
		}
	}

	if(state == 4){
		var freqByteData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(freqByteData); //analyser.getByteTimeDomainData(freqByteData);

		var OFFSET = 100;
		
		var magnitude = freqByteData[OFFSET];
		if(magnitude==0) {
	  		effectFilm.uniforms.grayscale.value = true;
	  		// state = 0;
		}
	}

	star.update();
	composer.render( 0.00001 );

	requestAnimationFrame( animate );
}

function onDocumentMouseMove(event) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {
	if ( event.touches.length > 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}