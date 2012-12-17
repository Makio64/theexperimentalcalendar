class Particle

	maxSpeedX = 2;
	PI_2 = Math.PI * 2
	
	colors = [ '33, 33, 33', '255, 0, 0', '255, 255, 255', '86, 92, 36', '4, 82, 0', '255, 255, 255' ]
	glow = true

	constructor: ( x, y, delay, buffer ) ->
		@x = @endX = x
		@y = @endY = y
		@buffer = buffer
		@buffer_ctx = buffer.getContext( '2d' )
		@radius = Math.floor(Math.random() * 2) + 1
		@alpha = 0
		@rvb = colors[Math.floor Math.random() * colors.length]
		@startX = null
		@startY = null
		@scaleX = 1
		@scaleY = 1
		@delay = delay
		

		@ratio = .2*Math.random()-.1
		#intial speed
		@vy = 0.005
		@vx = @vy * @ratio

		#acceleration every frame
		@ay = 0.00003;
		@ax = @ay*@ratio;

		@end = false;

	turnOn: () ->
		rvb = colors[ Math.floor( Math.random() * colors.length ) ]
		@color = "rgba(#{rvb}, #{@alpha})"
		@radius = 2
		glow = true

	update:()->
		if @end then return;

		if @delay > 0 
			@delay -= 1 #normaly -=delta time, 16ms is the delta time if 60 FPS
			return

		if @vx < maxSpeedX
			@vx+=@ax
			@vy+=@ay

		@x += @vx
		@y -= @vy

		if @y < 0
			@animationEnd()

		return

	animationEnd: () ->
		@x = $(document).innerWidth * Math.random()
		@y = $(document).innerHeight * Math.random()
		@alpha = 0
		@end = true

	dispose:() ->


	render: () ->
		if !@end
			if @alpha <= 1
				@alpha += 0.005 
				@color = "rgba(#{@rvb}, #{@alpha})"
			@buffer_ctx.beginPath()
			@buffer_ctx.arc(@x, @y, @radius, 0, PI_2, true)
			@buffer_ctx.fillStyle = '#fff'
			
			@buffer_ctx.fill()


		

		return

