class ChristmasSound 

	loaded = false
	loadingInterval = null
	audio = null
	context = null
	source = null
	sourceNode = null
	analyser = null
	filter = null
	low_pass_index_filter = 0
	highpass_index_filter = 1
	bandpass_index_filter = 2
	lowshelf_index_filter = 3
	hightshelf_index_filter = 4
	peaking_index_filter = 5
	notch_index_filter = 6
	allpass_index_filter = 7
	frequency = 440
	
	constructor: () ->
		@isPlaying = false
		context = new webkitAudioContext()
		analyser = context.createAnalyser()

		analyser.connect(context.destination)
		@setupFilter()
		@setupNode()
		@loadSound()


	analyse: () =>
		freqByteData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(new Uint8Array(analyser.frequencyBinCount))

		OFFSET = 100
		 
		magnitude = freqByteData[OFFSET]

		console.log analyser.getByteFrequencyData(new Uint8Array(analyser.frequencyBinCount))

	setupFilter: () ->
		filter = context.createBiquadFilter()
		filter.type = lowshelf_index_filter
		filter.frequency.value = frequency
		filter.Q.value = 0
		filter.gain.value = 0

	setupNode: () ->
		sourceNode = context.createBufferSource()
		sourceNode.connect( context.destination )

	loadSound: ( url ) ->
		url = './media/christmix.mp3'
		audio = new Audio();
		audio.src = url
		audio.controls = false
		audio.autoplay = false
		audio.addEventListener 'timeupdate', @onAudioUpdate
		audio.addEventListener 'ended', @onAudioEnd

		source = context.createMediaElementSource(audio);
		source.connect(analyser);
		analyser.connect(context.destination);

		document.body.appendChild(audio)

		$(window).on 'canplay', @onAudioLoad

		loadingInterval = setInterval( @checkVideoLoading, 100 )

		# loaded = true
		# $(document).trigger('soundLoaded', true)

	onAudioEnd: ( e ) =>
		console.log 'sound ended'
	
	onAudioUpdate: ( e ) =>
		$(document).trigger('audioUpdate', [audio])
		$(document).trigger('slowMo', true) if audio.currentTime >= 40 && audio.currentTime <= 44
		$(document).trigger('onFireTempo', true) if audio.currentTime >= 44.5
		$(document).trigger('regularTempo', true) if audio.currentTime >= 74
		$(document).trigger('endGame', true) if audio.currentTime >= 107
		$(document).trigger('endMusic', true) if audio.currentTime >= 185

	checkVideoLoading: () ->
		if audio.readyState == 4
  			$(document).trigger('soundLoaded', true) 
  			clearInterval( loadingInterval )
	
	play: () ->
    	audio.play()
    	@isPlaying = true

    stop: () ->
    	audio.stop()
    	@isPlaying = false

    onRequestError: ( e ) ->
    	console.log e

    setLoaded: ( bool ) =>
    	loaded = bool

    lowVolume: () ->
    	$('audio').animate({volume: 0.1}, 5000);

    shutVolume: () ->
    	console.log "shut"
    	$('audio').animate({volume: 0}, 2000);





