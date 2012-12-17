class Controller 

	ssCharacter = null
	christmasSound = null
	particlesLoaded = null
	particlesScene = null
	keysList = null
	particleManager = null
	ssCharacterLoaded = false
	christmasSoundLoaded = false
	slowMoModeActived = false
	onFireModeActived = false
	standUpModeActive = false
	regularTempoModeActived = false


	constructor: () ->
		keysList = new KeysList
		ssCharacter = new SSCharacter
		particleManager = new ParticleManager(  )

		$('.ready').live 'click', @lauchGame
		$('.end a').bind 'click', @reloadPage
		$(document).bind 'soundLoaded', @onSoundLoaded
		$(document).bind 'characterLoaded', @onCharacterLoaded
		$(document).bind 'audioUpdate', @onAudioUpdate
		$(document).bind 'slowMo', @slowMo
		$(document).bind 'onFireTempo', @onFire
		$(document).bind 'regularTempo', @onRegularTempo
		$(document).bind 'endGame', @standUp
		$(document).bind 'keyup', @onKeyUp
		$(document).bind 'endMusic', @onSoundEnded		
		$(document).bind 'success', @onKeySucess
		$(window).resize @onResize	

	lauchGame: ( e ) =>
		$('.overlay').fadeOut()
		christmasSound.play()
		ssCharacter.play()
		setTimeout( () ->
			$('.instructions').addClass 'show'
		, 2000)
		setTimeout( () ->
			$('.instructions').removeClass 'show'
		, 5000)
		
		$('.score').delay(1000).fadeIn(2000)

	onSoundLoaded: ( e ) =>
		$('.start span')
			.addClass('ready')
			.text 'START'
		console.log 'Have a nice moment ;)'
		@looploop()
		

	onCharacterLoaded: ( e ) =>
		christmasSound = new ChristmasSound

	onParticleSceneInit: () ->
		console.log 'yop'
		
	onAudioUpdate: ( e, audio ) =>
		keysList.update( audio.currentTime )

	onKeyUp: ( e ) =>
		keysList.onKeyDown( e.keyCode )

	onSoundEnded: ( e ) =>
		christmasSound.shutVolume()
	
	looploop: () =>
		window.requestAnimationFrame(@looploop)
		particleManager.update()
		particleManager.render()

	stop: () =>
		window.cancelAnimationFrame(@looploop)

	triggerLoop: (e) =>
		@looploop()

	slowMo: ( e ) =>
		if !slowMoModeActived
			slowMoModeActived = true
			$('.beready').addClass 'show'
			setTimeout( () ->
				$('.beready').removeClass 'show'
			, 3000)
			ssCharacter.slowMo()

	onFire: ( e ) =>
		if !onFireModeActived
			onFireModeActived = true
			ssCharacter.onFire()

	onRegularTempo: ( e ) =>
		if !regularTempoModeActived 
			regularTempoModeActived = true
			ssCharacter.slowDown()
			
	standUp: ( e ) =>
		if !standUpModeActive
			standUpModeActive = true
			christmasSound.lowVolume()
			ssCharacter.standUp()

		score = $('.score span').text()
		if score <= 1000 then msg = 'u_u'
		else if score > 1000 && score <= 3000 then msg = 'Bitch please !'
		else if score > 3000 && score <= 5000 then msg = 'Not yet !'
		else if score > 5000 && score <= 7000 then msg = 'Not bad man !'
		else if score > 7000 && score <= 10000 then msg = 'Nice !'
		else if score > 10000 then msg = 'ON FIRE !'

		$('.endScore').text "Score : #{score}"
		$('.endMessage').text msg

		$('.overlay .start').hide()
		$('.overlay .end').show()
		$('.overlay').delay(4000).fadeIn 1000, () =>
			window.cancelAnimationFrame(@looploop)

	onKeySucess: ( e ) =>
		particleManager.sendParticle( 1 )

	reloadPage: ( e ) =>
		location.reload()

	onResize: ( e ) =>
		particleManager.resize()
		
		

