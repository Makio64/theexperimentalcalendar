class Key
	
	$container = null
	types = ['up', 'down', 'left', 'right']

	constructor: ( time, id ) ->
		@time = time
		@id = id
		@played = false
		@$el = $('<div/>')
		@type = types[ Math.floor Math.random() * types.length ]

	render: () ->
		$container = $('.scene')
		
		if @time <= 40  
			clazz = 'appear' 
			delay = 1000
		else 
			clazz = 'appear2'
			delay = 500

		@$img = $('<img/>')
		@$imgSuccess = $('<img/>')

		@$img.attr {
			src: "./img/#{@type}.png"
		}

		@$imgSuccess.attr {
			'src': "./img/#{@type}_success.png"
		}

		@$el.attr 'class', "key #{@id} #{clazz}"

		@$el.append @$img
		@$el.append @$imgSuccess
		
		$container.append @$el

	transitionFinished: () ->
		console.log 'placed'

	disappear: () =>		
		@$el
			.removeClass('appear')
			.addClass 'disappear'
		setTimeout( () =>
			@remove()
		, 500 )

	remove: () ->
		@$el.remove()

	success: () ->
		@$imgSuccess.show()
		@$imgSuccess.addClass('success')
		setTimeout( () =>
			@remove()
		, 500 )
		

	fail: () ->
