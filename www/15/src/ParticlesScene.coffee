class ParticlesScene

	constructor: ( controller ) ->
		@particles = []
		@sentence = 'MERRY CHRISTMAS !'
		@textRefCanvas = null
		@textRefContext = null
		@density = 60
		@controller = controller

		#Canvas settings
		@canvas = document.getElementById( 'canvas' )
		@ctx = @canvas.getContext( '2d' )
		@canvas.width = @canvasW = window.innerWidth
		@canvas.height = @canvasH = window.innerHeight

		#textRefCanvas setting
		@textRefCanvas = $( '<canvas/>' )[0]
		@textRefContext = @textRefCanvas.getContext( '2d' )
		@textRefCanvas.width = @canvasW
		@textRefCanvas.height = 270
		@textRefContext.font = '120px xmas'
		@textRefContext.fillText(@sentence, ( @canvasW / 2 ) - ( Math.round( @textRefContext.measureText(@sentence).width/2 ) ) , 260 )

		# imageObj = new Image();

		# imageObj.onload = () =>
		# 	@textRefContext.drawImage(imageObj, (@canvasW-1000)* 0.5, 70)
		# 	# $('body').append @textRefCanvas
		# 	@initParticles()
		
		# imageObj.src = './img/imageRef.jpg'

		@initParticles()

	initParticles: () ->
		i = 0
		data = @textRefContext.getImageData( 0, 0, @canvasW, @canvasH).data
		#vertical iteration
		for posY in [0 ... @textRefCanvas.height ] by 1
			#horizontal iteration
			for posX in [0 ... @textRefCanvas.width] by 1
				#Get the pixel located at our current iteration
				pixel = data[ ( ( posX + ( posY * @canvasW )) * 4 ) - 1 ]
				#if white pixel, save his position
				if pixel == 255
					@particles.push( new Particle( posX, posY, @ctx ) )

		@propage()

		@renderParticles()
		# @loopingYouhouuuu()

	propage: () ->
		setTimeout( @alertController, 2500)

	alertController: () =>
		@controller.onParticleSceneInit()


	renderParticles: () ->
		for particle in @particles by 25
			particle.moveAround()
			particle.render()

	loopingYouhouuuu: () ->
		ctx.clearRect( 0, 0, @canvasW, @canvasH )
		@renderParticles()






