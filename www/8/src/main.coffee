###
Head Tracking for Christmas Experiments http://christmasexperiments.com
by RayFranco http://twitter.com/RayFranco http://github.com/RayFranco

Credits :
	Music sampled for this project by Irsih Steph
	Skybox graphics by XXX
Libraries :
	Headtrackr
	Three.js
	Buzz

Thanks to BigYouth, grgdvrt, David Ronai and mr.doob for advices and help
Happy Birthday Caro <3

This is coded in CoffeeScript, you should have a look at the non-minified file 
here for more details
###



throw "jQuery is not installed" if not $?
throw "Buzz is not installed" if not buzz?

$ ->

	# Test if browser is supported
	if false
		console.log 'no supported'
		$('#browserNotSupported').show()
		return

	# Configuration
	FLAKES_COUNT 	= 500
	CAMERA_DISTANCE = 200
	NEAR			= 1
	FAR 			= 120000
	PERSPECTIVE     = 75
	CAM_Z 			= 200
	CAM_Y 			= 0
	MIN_EXPLORE		= .5 		# Minimum to explore to avoid tutorial
	EXPLORE_TIME	= 5000 		# Countdown before the tutorial

	# Variables
	started 		= false
	nerve 			= .1 # Environment tension
	explored_r 		= 0
	explored_l		= 0
	detected		= false
	#
	# Initialisation
	#

	# Set up the scene
	scene 	= new THREE.Scene()

	# Set up the camera
	camera 				= new THREE.PerspectiveCamera PERSPECTIVE, window.innerWidth/window.innerHeight ,NEAR, FAR
	camera.position.z 	= CAM_Z
	camera.position.y 	= CAM_Y

	scene.add camera

	# Set up the renderer
	sceneCanvas = document.getElementById 'scene'
	rParameters =
		canvas: 	sceneCanvas
		antialias: 	false
	renderer = new THREE.WebGLRenderer rParameters
	renderer.setSize window.innerWidth, window.innerHeight
	renderer.setClearColorHex 0x000000, 0
	renderer.autoClear = false
	renderer.gammaInput = true
	renderer.gammaOutput = true
	renderer.setSize window.innerWidth, window.innerHeight

	# Post Processing
	renderModel 	= new THREE.RenderPass scene, camera
	effectFilm 		= new THREE.FilmPass 3, 0.1, 0, true
	effectVignette 	= new THREE.ShaderPass THREE.VignetteShader

	effectVignette.uniforms["offset"].value 	= 0.8;
	effectVignette.uniforms["darkness"].value 	= 2;
	effectVignette.renderToScreen = true

	rtParameters = 
		minFilter: THREE.LinearFilter
		magFilter: THREE.LinearFilter
		stencilBuffer: true

	composer = new THREE.EffectComposer renderer, new THREE.WebGLRenderTarget window.innerWidth, window.innerHeight, rtParameters

	composer.addPass renderModel
	composer.addPass effectFilm
	composer.addPass effectVignette

	# Set up the head tracker
	trackerCanvas 	= document.getElementById 'trackerCanvas'
	trackerVideo 	= document.getElementById 'trackerVideo'
	htracker 		= new headtrackr.Tracker({ui: false, headPosition: true, calcAngles: false})

	htracker.init trackerVideo, trackerCanvas
	# htracker.start() 	# We will listen to events later, get ready !

	# Load the skybox textures
	urlPrefix 	= "assets/textures/skybox/"
	urls 		= [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
    				urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
    				urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ]
	textureCube = THREE.ImageUtils.loadTextureCube(urls)

	# Load the main subject, a ball (yeah a ball, so what?)
	geometry 		= new THREE.SphereGeometry( 100, 32, 16 );
	material 		= new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
	ball 			= new THREE.Mesh geometry, material
	ball.position.x = 0 
	ball.position.y = 0
	ball.position.z = 0
	ball.scale.x 	= ball.scale.y = ball.scale.z = 1;

	scene.add ball

	# Let's animate the ball
	ballDown 	= new TWEEN.Tween(ball.position).to({y:-20},5000).easing(TWEEN.Easing.Cubic.InOut)
	ballUp 	 	= new TWEEN.Tween(ball.position).to({y:20},5000).easing(TWEEN.Easing.Cubic.InOut)
	start 		= new TWEEN.Tween(ball.position).to({y:20},2500).start().chain(ballDown).easing(TWEEN.Easing.Cubic.Out)
	ballDown.chain ballUp # Get up
	ballUp.chain ballDown # Get down
	
	# Make the skybox, it's getting nice now !
	shader 	 		= THREE.ShaderUtils.lib["cube"]
	smParameters 	=
		fragmentShader: shader.fragmentShader
		vertexShader: shader.vertexShader
		uniforms: shader.uniforms
		depthWrite: false
		side: THREE.BackSide

	shader.uniforms['tCube'].value = textureCube

	material = new THREE.ShaderMaterial smParameters
	mesh  	 = new THREE.Mesh( new THREE.CubeGeometry( 10000, 10000, 10000 ), material )

	scene.add mesh

	# Lights up
	pointLight 				= new THREE.PointLight 0x0000FF
	pointLight.position.x 	= 10
	pointLight.position.y 	= 50
	pointLight.position.z 	= 130

	scene.add pointLight

	directionalLight 		= new THREE.DirectionalLight 0xffffff, 1
	directionalLight.position.x = 1
	directionalLight.position.y = 1
	directionalLight.position.z = 0

	scene.add directionalLight

	light = new THREE.AmbientLight 0x666666
	
	scene.add light

	# This will be our particle manager, experimental !
	class FlakeStorm
		constructor: (@scene, @subject, @count) ->
			@flakes = new THREE.Geometry()
			@material = new THREE.ParticleBasicMaterial({
				size: 5,
				map: THREE.ImageUtils.loadTexture("assets/textures/particle.png"),
				blending: THREE.AdditiveBlending,
				transparent: true
			})
			@points = new THREE.GeometryUtils.randomPointsInGeometry @subject, @count
			for i in [0...@count]
				@points[i] = new THREE.Vector3 Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 2000 - 1000
				particle = new Flake @points[i], 50
				#particle.explode()
				@flakes.vertices.push(particle)
			@system = new THREE.ParticleSystem @flakes, @material
			@system.sortParticles = true;
			@scene.add @system
			return @
		update: ->
			for flake in @flakes.vertices
				if flake.y < -200
					flake.y = 200
				if flake.x < -200
					flake.x = 200
				if flake.x > 200
					flake.x = -200
				else
					flake.y -= 50 * Math.random() * nerve
					flake.x -= 20 * Math.random() * nerve
			@flakes.vertices.verticesNeedUpdate = true

	# This is our flake (particle) - experimental !
	class Flake extends THREE.Vector3
		constructor: (vector, r=2) ->
			@velocity 	= new THREE.Vector3 0, -Math.random() + 1, 0
			@animation 	= null
			@x = vector.x
			@y = vector.y
			@z = vector.z
			return @

	storm = new FlakeStorm scene, geometry, FLAKES_COUNT

	# Add sounds to the game
	soundOptions =
		preload: true
		autoplay: false
		loop: true

	intro  = new buzz.sound 'assets/sounds/christmasisland.mp3', soundOptions
	track3 = new buzz.sound 'assets/sounds/loop1.wav', soundOptions
	track2 = new buzz.sound 'assets/sounds/loop2.wav', soundOptions
	track1 = new buzz.sound 'assets/sounds/loop3.wav', soundOptions
	tracks = new buzz.group [track1, track2, track3]

	intro.bindOnce 'canplay', ->
		intro.play()

	# Set initial volumes

	volume1 = 0
	volume2 = 20
	volume3 = 100

	# Initial head position set up
	trackX = .5
	trackY = .5

	# Render all that stuff
	render = ->
		requestAnimationFrame render
		TWEEN.update()
		storm.update()
		camera.lookAt({x:0,y:0,z:0})
		camX = trackX * 400 - 200
		camZ = Math.sqrt( Math.pow(201,2) - Math.pow(camX,2) )
		new TWEEN.Tween(camera.position).to({x: camX, z: camZ}, 980).easing(TWEEN.Easing.Cubic.Out).start();
		if nerve > .5 then ball.material.color.setRGB 1,1-(2*nerve-1),1-(2*nerve-1) else ball.material.color.setRGB 1, 1, 1
		track1.setVolume volume1
		track2.setVolume volume2
		track3.setVolume volume3
		renderer.render scene, camera
		composer.render 0.005
	render()

	# Event Listeners
	onHeadTrackrStatus = (e) ->
		if e.status is 'found'
			detected = true
			lightenScreen()
			setTimeout helpExplore, EXPLORE_TIME
		else if e.status is 'lost' or e.status is 'redetecting'
			detected = false
			darkenScreen()
		else if e.status is 'camera found'
			onCameraFound()

	onFaceTrackingEvent = (e) ->
		trackX = nerve = 1 - e.x / 318
		trackY = 1 - e.y / 240

		# Update explored area
		if trackX > .5
			nexplored_r = trackX * 2 - .5
			explored_r = nexplored_r if explored_r < nexplored_r
		else
			nexplored_l = trackX * 2
			explored_l = nexplored_l if explored_l < nexplored_l

		# Update sound tracks volume
		volume1 = trackX * 100
		volume2 = -100 * Math.cos(trackX*Math.PI)
		volume3 = 100 - trackX * 150

	onWindowResize = (e) ->
		renderer.setSize window.innerWidth, window.innerHeight
		sceneCanvas.style.height = window.innerHeight+'px'
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		composer.reset new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rtParameters)

	# Tracking tutorial
	helpExplore = () ->
		if explored_l < MIN_EXPLORE or explored_r < MIN_EXPLORE
			$('#int-tutorial').fadeIn(300)
			if explored_l < MIN_EXPLORE
				$('#int-tutorial .left').delay(300).fadeIn(300)
			if explored_r < MIN_EXPLORE
				$('#int-tutorial .right').delay(300).fadeIn(300)
				console.log 'Step on your right !'
			setTimeout hideHelp, 2000

	hideHelp = () ->
		$('#int-tutorial').fadeOut()

	# Will make the animation nice
	darkenScreen = () ->
		anim = new TWEEN.Tween({grayscale: 0, nIntensity: 0.3}).to({grayscale: 1, nIntensity: 3},500).easing(TWEEN.Easing.Cubic.Out)
		anim.onUpdate ->
			effectFilm.uniforms["grayscale"].value = this.grayscale
			effectFilm.uniforms["nIntensity"].value = this.nIntensity
		anim.start()

	# Will put the animation in background mode
	lightenScreen = () ->
		anim = new TWEEN.Tween({grayscale: 1, nIntensity: 3}).to({grayscale: 0, nIntensity: 0.3},500).easing(TWEEN.Easing.Cubic.Out)
		anim.onUpdate ->
			effectFilm.uniforms["grayscale"].value = this.grayscale
			effectFilm.uniforms["nIntensity"].value = this.nIntensity
		anim.start()

	onCameraFound = () ->
		# Switch to sound advice
		$('#tutorial .container.allowCamera:first').fadeOut ->
			$('#tutorial .container.louder').fadeIn()

	onStart = () ->
		$('#tutorial').fadeOut()
		htracker.start()
		intro.fadeOut 300, ->
			tracks.play()


	document.addEventListener 'headtrackrStatus', onHeadTrackrStatus
	document.addEventListener 'facetrackingEvent', onFaceTrackingEvent
	window.addEventListener 'resize', onWindowResize

	$('#tutorial a').click (e) ->
		e.preventDefault()
		onStart()