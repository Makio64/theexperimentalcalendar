class SSCharacter 

	loaded = false
	step = null
	currentMoveIndex = null
	currentSSFrom = null
	currentSSTo = null
	frameRateInterval = null
	currentImageIndex = null
	currentImageUrl = null
	frameRate = 40
	realFPS = null
	opacity = 0
	walkFramesDatas = null
	sitFramesDatas = null
	standFramesDatas = null
	posX = null
	posY = null
	width = null
	height = null
	standUp = false
	gameEnded = false

	movesLimits = {
		'walk': [
					{
						'from': 1,
						'to' : 97
					}
				],
		'sit': [
					{
						'from': 1,
						'to' : 32
					},
					{
						'from': 33,
						'to' : 57
					},
					{
						'from': 58,
						'to' : 85
					},
					{
						'from': 86,
						'to' : 112
					}
				],
		'stand': [
					{
						'from': 1,
						'to' : 55
					}
				]
	}

	constructor: () ->
		@$el = $('.sscharacter.walk')
		currentImageIndex = 1
		realFPS = 1000 / frameRate
		@load()


	load: () ->
		index = 0
		imageLoaded = 0
		jsonLoaded = 0
		imageUrls = [ './img/character/walk/character_walk_1.png', './img/character/walk/character_walk_1.png', './img/character/sit/character_notes.png', './img/character/stand/character_stand.png' ]
		jsonUrls = [ './img/character/walk/character_walk.json', './img/character/sit/character_notes.json', './img/character/stand/character_stand.json' ]
		
		#load spritesheets
		for url in imageUrls
			image = new Image()
			image.onload = () ->
				imageLoaded++
				if imageLoaded == 4 && jsonLoaded == 3
					$(document).trigger 'characterLoaded', true

			image.src = url

		for url in jsonUrls 
			$.get url, (datas) =>
				if index == 0 then walkFramesDatas = datas
				else if index == 1 then sitFramesDatas = datas
				else if index == 2 then standFramesDatas = datas
				jsonLoaded++
				index++
				if jsonLoaded <= 3 && imageLoaded == 4
					$(document).trigger 'characterLoaded', true

	#Start looping from a random mouvement
	#Define the first and last frame of this movemement
	play: () ->
		@$el.fadeIn(2000)
		step = 'walk'
		framesDatas = walkFramesDatas
		currentSSFrom = currentImageIndex = movesLimits[step][0].from
		currentSSTo = movesLimits[step][0].to
		frameRateInterval = setInterval( @update, realFPS )
		background = framesDatas.images[ framesDatas.frames[ framesDatas.animations[currentImageIndex].frames[0] ][ 4 ] ]
		@$el.css 'background', "url(#{background})"
		@$el.addClass 'walk'
		@$el.fadeIn 500


	#Here's the magic
	update: () =>
		if !gameEnded
			#What is the spritesheet ?
			if step == 'walk' then framesDatas = walkFramesDatas
			else if step == 'sit' then framesDatas = sitFramesDatas
			else framesDatas = standFramesDatas

			background = framesDatas.images[ framesDatas.frames[ framesDatas.animations[currentImageIndex].frames[0] ][ 4 ] ]

			@$el.css 'background', "url(#{background})"

			#Animate only if all spritesheet are loaded
			if !loaded
		
				#If end of the spritesheet or piece of spritesheet, next step

				if currentImageIndex >= currentSSTo && step == 'walk'
						
						$('.sscharacter.walk').hide()
						@$el = $('.sscharacter.sit').css 'opacity', 1
						step = 'sit'
						framesDatas = sitFramesDatas 
						currentSSFrom = currentImageIndex = movesLimits[step][0].from
						currentSSTo = movesLimits[step][0].to
				if currentImageIndex >= currentSSTo 
					if step == 'stand'
						console.log 'fin'
						gameEnded = true
						clearInterval( frameRateInterval )
					else if standUp
						$('.sscharacter.sit').hide()
						@$el = $('.sscharacter.stand').css 'opacity', 1
						step = 'stand'
						framesDatas = standFramesDatas
						currentSSFrom = currentImageIndex = movesLimits[step][0].from
						currentSSTo = movesLimits[step][0].to
						@$el.removeClass 'sit'
						@$el.addClass 'stand'
					else if step == 'walk' 
						step = 'sit'
						console.log 'step changement : now sit'
						$('.sscharacter.walk').hide()
						@$el = $('.sscharacter.sit').show()
						framesDatas = sitFramesDatas
						currentSSFrom = currentImageIndex = movesLimits[step][0].from
						currentSSTo = movesLimits[step][0].to
						@$el.removeClass 'walk'
						@$el.addClass 'sit'
					else if step == 'sit'
						currentMoveIndex = Math.floor Math.random() * movesLimits[step].length
						currentSSFrom = currentImageIndex = movesLimits[step][currentMoveIndex].from
						currentSSTo = movesLimits[step][currentMoveIndex].to
				

				posX = framesDatas.frames[ framesDatas.animations["#{currentImageIndex}"].frames[0] ][ 0 ]
				posY = framesDatas.frames[ framesDatas.animations["#{currentImageIndex}"].frames[0] ][ 1 ]
				width = framesDatas.frames[ framesDatas.animations["#{currentImageIndex}"].frames[0] ][ 2 ]
				height = framesDatas.frames[ framesDatas.animations["#{currentImageIndex}"].frames[0] ][ 3 ]
				marginLeft = -Math.floor width/2
				marginTop = -Math.floor height/2

				@$el.css {
					"background-image": "framesDatas.images[ sitFramesDatas.frames[ sitFramesDatas.animations[#{currentImageIndex}].frames[0] ][ 4 ] ]"
					"background-position": "-#{posX}px -#{posY}px"
					"width": "#{width}px",
					"height": "#{height}px"
				}

				currentImageIndex++

	slowMo: () -> 
		frameRate = 1
		realFPS = 1000 / frameRate
		clearInterval( frameRateInterval )
		frameRateInterval = setInterval( @update, realFPS )

	#To speed up the boy
	#Frenetic !
	onFire: () -> 
		frameRate = 80
		realFPS = 1000 / frameRate
		clearInterval( frameRateInterval )
		frameRateInterval = setInterval( @update, realFPS )

	#wow, wow. WOW. Calm down boy...
	slowDown: () ->
		frameRate = 40
		realFPS = 1000 / frameRate
		clearInterval( frameRateInterval )
		frameRateInterval = setInterval( @update, realFPS )

	standUp: () -> 
		standUp = true
		frameRate = 30
		realFPS = 1000 / frameRate
		clearInterval( frameRateInterval )
		frameRateInterval = setInterval( @update, realFPS )
		






