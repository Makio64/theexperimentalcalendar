#---------------------------------------------- GLOBAL VAR
sw = 0
sh = 0

#---------------------------------------------- UI VAR
background = null
words = 'fun nodejs sass compass lex css3 3D movement think dream poetic awesome amazing jquery google html5 audioAPI webgl design processing procedural digital artist project experiment makesense beautyfull contributors art gift web inspiration flash talent originality imagination viewers love passion THREEJS coffeescript christmas happyness nodejs movement interactivity interaction creativity js canvas tweenlite chrome @superguigui @denis_h_ @makio64 @ayamflow @catlrh @Victor @Castemelijn @mrgnou @hellopath @elodiefabbri Mitamo @williamapan @akican @florianzumbrunn @filsdegraphiste @czidler @MarieSpenale @littlesuckers @kokopako @nicoptere @AurelienG @dmmn_ @RayFranco @grgrdvrt @soulwire'.toUpperCase().split(' ')
queue = null
possibility = [1,2,3,4]
x = 0
y = 0
canvas = null
ctx = null
buffer = null
bufferctx = null
body = null
img = null
imgIdx = 0
imgs = null
k = 0
paused = true

# technologies = ''


#---------------------------------------------- ENTRY POINT
$(document).ready ->
	init()

init = ->
	body = $ 'body'
	
	$25 = $(".waiter")
	$25.click onStart
	$("#wrapperbackground").click onEnd
	$("#wrapper").click onEnd
	$(window).scroll onEnd

	$(window).resize onResize
	

	canvas  = $ "#thxcanvas"
	ctx = canvas[0].getContext "2d"
	
	buffer = document.createElement('canvas')
	buffer.width = 745
	buffer.height = 265
	bufferctx = buffer.getContext "2d"
	
	imgs = []
	for i in [1...25] by 1
		imgs.push './25/img/'+i+'.jpg'
	
	# $(imgs).preloadImages onImgLoaded


	queue = [new Rectangle(0, 0, canvas.width(), canvas.height())];
	onResize()
	
	return

onStart = ->
	requestAnimationFrame mainloop
	paused = false
	$("#wrapper").css "display", "block"
	$("#wrapperbackground").css "display", "block"
	TweenLite.killTweensOf($("#wrapper"))
	TweenLite.killTweensOf($("#wrapperbackground"))
	TweenLite.to($("#wrapper"),.9,{css:{autoAlpha:1, scaleX:1, scaleY:1},delay:.5, ease:Back.easeOut})
	TweenLite.to($("#wrapper canvas"),.35,{css:{autoAlpha:1, scaleY:1},ease:Quad.easeOut,delay:.5})
	TweenLite.to($("#wrapperbackground"),1,{css:{autoAlpha:.8}})

onEnd = ->
	paused = true
	TweenLite.killTweensOf($("#wrapper"))
	TweenLite.killTweensOf($("#wrapperbackground"))
	TweenLite.to($("#wrapper canvas"),.5,{css:{autoAlpha:0, scaleY:0}})
	TweenLite.to($("#wrapper"),.5,{css:{autoAlpha:0, scaleX:.8, scaleY:.8}})
	TweenLite.to($("#wrapperbackground"),.5,{css:{autoAlpha:0},delay:.5})

onImgLoaded = ->
	img = $('<img />')
	img.attr('src', choice(imgs))
	img = img[0]
	# ctx.drawImage(img,0,0,745,265)#, canvas.width, canvas.height);
	# requestAnimationFrame mainloop


#---------------------------------------------- MAIN LOOP
mainloop = ->
	k++
	if !paused
		requestAnimationFrame mainloop
	
	ctx.save()

	if k%2 or k%3==0
		# ctx.globalAlpha = 0.05
		# ctx.drawImage(img,0,0)		
		# ctx.restore()
		return

	# if(k%350 == 0)
	# 	$(img).attr('src', choice(imgs))

	# if k%3 == 0
	bufferctx.clearRect(0, 0, 745,265)
	bufferctx.fillStyle = "#FFFFFF"
	textFill(ctx)
	ctx.drawImage(buffer,0,0)

	ctx.globalAlpha = 0.15
	# ctx.drawImage(img,0,0)
	ctx.fillStyle = "#BF3532"
	ctx.fillRect 0,0,745,265		
	ctx.restore()
	
	return


textFill = ->
	i = 0;
	while queue.length > 0 and i < 1
		rect = queue.pop();
		if rect.width > 6 and rect.height > 6
			fillRegion(rect);
			i++;
	if (queue.length == 0) then queue = [new Rectangle(0, 0, canvas.width(), canvas.height())];
	return

fillRegion = (region)->
	bufferctx.font= "36px Arial"
	bufferctx.textBaseline = 'top';
	bufferctx.textAlign = 'left';
	word = choice(words);

	bound = new Rectangle(0,0,bufferctx.measureText(word).width+3,36+3)

	s = region.width / bound.width * (Math.random() * 0.4 + 0.1)
	if (bound.height * s > region.height)
		s = region.height / bound.height;
	if s > 1
		s = 1;
	bufferctx.font= (36*s)+"px Arial"
	
	bound.x *= s
	bound.y *= s
	bound.width  *= s
	bound.height *= s
	
	switch choice(possibility)
		when 1
			x = region.x - bound.x;
			y = region.y - bound.y;
			queue.push(
				new Rectangle(region.x + bound.width, Math.floor(region.y), region.width - bound.width, bound.height),
				new Rectangle(region.x, Math.floor(region.y + bound.height), region.width, region.height - bound.height)
			)
			break
		
		when 2
			x = region.x - bound.x;
			y = region.bottom - bound.bottom;
			queue.push(
				new Rectangle(region.x + bound.width, region.bottom - bound.height, region.width - bound.width, bound.height),
				new Rectangle(region.x, region.y, region.width, region.height - bound.height)
			)
			break
		
		when 3
			x = region.right - bound.right;
			y = region.y - bound.y;
			queue.push(
				new Rectangle(region.x, region.y, region.width - bound.width, bound.height),
				new Rectangle(region.x, region.y + bound.height, region.width, region.height - bound.height)
			)
			break
		
		when 4
			x = region.right - bound.right;
			y = region.bottom - bound.bottom;
			queue.push(
				new Rectangle(region.x, region.bottom - bound.height, region.width - bound.width, bound.height),
				new Rectangle(region.x, region.y, region.width, region.height - bound.height)
			)
			break
	bufferctx.fillText(word, x, y)
	return

choice = (array) ->
	return array[Math.floor(array.length * Math.random())]
	
#---------------------------------------------- RESIZE
onResize = -> 
	sw = (if window.innerWidth then window.innerWidth else $(window).width())
	sh = (if window.innerHeight then window.innerHeight else $(window).height())
	return

#---------------------------------------------- UTILS
LOG = (msg) ->
	console.log(msg)
	$("#console").prepend msg+"<br />"