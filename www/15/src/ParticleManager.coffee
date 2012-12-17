class ParticleManager


	positions = [
		{x:55,y:83},
		{x:70,y:84},
		{x:82,y:121},
		{x:94,y:110},
		{x:116,y:73},
		{x:127,y:97},
		{x:168,y:134},
		{x:183,y:160},
		{x:235,y:169},
		{x:257,y:142},
		{x:315,y:163},
		{x:355,y:98},
		{x:374,y:73},
		{x:399,y:109},
		{x:412,y:130},
		{x:426,y:86},
		{x:444,y:70}
	]
	emittors = [];
			   
	constructor: () ->

		#Canvas settings
		@canvas = document.getElementById( 'canvas' )
		@ctx = @canvas.getContext( '2d' )

		@buffer = document.createElement('canvas')
		@buffer_context = @buffer.getContext( '2d' )

		@canvas.width = @buffer.width = @canvasW = window.innerWidth
		@canvas.height = @buffer.height = @canvasH = window.innerHeight

		@offsetX = @canvasW / 2 - 257
		@offsetY = @canvasH / 2 - 216
		for position in positions
			emittors.push( new ParticleEmittor(position.x+@offsetX, position.y+@offsetY, @buffer) )

	resize:()->
		@canvas.width = @buffer.width = @canvasW = window.innerWidth
		@canvas.height = @buffer.height = @canvasH = window.innerHeight
		@offsetX = @canvasW / 2 - 257
		@offsetY = @canvasH / 2 - 216

		for i in [0..positions.length] by 1
			position = positions[i]
			emittor = emittors[i]
			emittor.x = position.x + offsetX
			emittor.y = position.y + offsetY

	update:()->
		for e in emittors
			e.update()

	render:() ->
		@ctx.clearRect(0, 0, @canvasW, @canvasH)
		@buffer_context.clearRect(0, 0, @canvasW, @canvasH)

		for e in emittors
			e.render()

		@ctx.drawImage(@buffer, 0, 0)

	sendParticle:(amount) ->
		for i in [0 ... 4]
			emittor = @randomEmittor()
			emittor.send(amount)

	randomEmittor:() ->
		return emittors[Math.floor(Math.random()*emittors.length)] 

	getParticles:() ->
		particles = []
		for e in emittors
			particles = particles.concat(e.getParticles())
		return particles

	reset:()->
		for e in emittors
			e.reset();
