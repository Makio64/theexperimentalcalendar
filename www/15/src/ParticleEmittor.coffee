class ParticleEmittor

	particles = [];

	constructor: ( x, y, buffer ) ->
		@x = x
		@y = y
		@buffer = buffer
		@buffer_ctx = buffer.getContext( '2d' )
		@amount = 0
		@lastSendTime = 0

		#time in ms
		@delayMax = 300;

	send: ( amount ) ->
		for i in [0 ... amount]
			p = new Particle(@x, @y, Math.random() * @delayMax, @buffer)
			particles.push( p )

	update:()->
		from = particles.length - 1
		for i in [from ... 0] by -1
			p = particles[i]
			if p.end 
				particles.splice(i,1)
				continue
			
			p.update()


	render:() ->
		for p in particles
			p.render()

	getParticles:()->
		return particles;

	reset:()->
		particles = []