class KeysList
	times = []
	keys = []
	currentKey = null
	
	constructor: () ->

		@score = 0

		for i in [6 ... 107]
			if i <= 40 || i >= 74
				times.push i
			else if i >= 44.5 && i <= 74
				times.push i 
				times.push i + 0.5

		for i in [0 ... times.length]
			key = new Key( times[i], i )
			keys.push key

	update: ( time ) ->

		if time >= 40 && time <= 44
			currentKey.disappear()

		for i in [0 ... keys.length - 1]
			key = keys[i]
			if time >= key.time
				
				if currentKey != null
					currentKey.disappear()
					currentKey = key
				else
					currentKey = key

				key.render()
				keys.splice(i, 1)


	onKeyDown: ( keyCode ) ->
		if currentKey != null
			if keyCode == 38 && currentKey.type == 'up' then @success()
			if keyCode == 40 && currentKey.type == 'down' then @success() 
			if keyCode == 37 && currentKey.type == 'left' then @success() 
			if keyCode == 39 && currentKey.type == 'right' then @success() 

	success: () ->
		@score++
		$('.score span').text @score * 100
		currentKey.success()
		$(document).trigger 'success', true

	fail: () ->
		currentKey.fail()