
Pattern = do ->

    # --------------------------------------------------
    # Helpers
    # --------------------------------------------------

    # Adds functionality to a CanvasRenderingContext2D instance

    augment = ( ctx ) ->

        ctx.fbo = (document.createElement 'canvas').getContext '2d'

        ctx.randomFillStyle = ( colors ) ->

            [ h, s, l ] = random colors
            @fillStyle = "hsl(#{h},#{s}%,#{l}%)"

        ctx.randomStrokeStyle = ( colors ) ->

            [ h, s, l ] = random colors
            @strokeStyle = "hsl(#{h},#{s}%,#{l}%)"

        ctx.randomFillStrokeStyle = ( colors ) ->

            [ h, s, l ] = random colors
            @strokeStyle = @fillStyle = "hsl(#{h},#{s}%,#{l}%)"

        ctx.drawPath = ( path, jitter = 0 ) ->

            @beginPath()
            @lineTo (p.x + random -jitter, jitter), (p.y + random -jitter, jitter) for p in path
            @closePath()

        ctx.drawShape = ( shape, jitter = 0 ) ->

            o = jitter / 2

            @beginPath()

            for step in shape

                cmd = step[0]
                pts = step.slice 1
                @[ cmd ].apply ctx, (p + random -o, o for p in pts)

            @closePath()

        ctx.curveThroughPoints = ( points ) ->

            for i in [1..points.length-3]

                a = points[i]
                b = points[i + 1]
                
                x = ( a.x + b.x ) * 0.5
                y = ( a.y + b.y ) * 0.5

                @quadraticCurveTo a.x, a.y, x, y

            a = points[i]
            b = points[i + 1]
            console.log i, a, b
            @quadraticCurveTo a.x, a.y, b.x, b.y

        ctx.drawTintedImage = ( img, tint, args... ) ->

            ctx.fbo.canvas.width = img.width
            ctx.fbo.canvas.height = img.height

            ctx.fbo.fillStyle = tint
            ctx.fbo.fillRect 0, 0, img.width, img.height
            ctx.fbo.globalCompositeOperation = 'destination-in'
            ctx.fbo.drawImage img, 0, 0

            @drawImage.apply @, [ ctx.fbo.canvas ].concat args

        ctx.dot = ( x, y, radius ) ->

            @beginPath()
            @arc x, y, radius, 0, TWO_PI
            @closePath()

        ctx.tri = ( x1, y1, x2, y2, x3, y3 ) ->

            @beginPath()
            @moveTo x1, y1
            @lineTo x2, y2
            @lineTo x3, y3
            @closePath()

        ctx.rect = ( x, y, width, height ) ->

            @beginPath()
            @moveTo x, y
            @lineTo x + width, y
            @lineTo x + width, y + height
            @lineTo x, y + height
            @closePath()

        ctx

    # Generates variations on a color

    makeVariants = ( hsl, count, jitter = 0.1 ) ->

        ho = jitter * 180
        so = lo = jitter * 50

        variants = []

        for i in [0..count]

            h = hsl[0] + random -ho, ho
            s = hsl[1] + random -so, so
            l = hsl[2] + random -lo, lo

            variants.push [ h, s, l ]

        variants

    # Repeats a draw method accross a grid

    repeat = ( sx, sy, fn ) ->

        ox = if sx is width then 0 else -sx
        oy = if sy is height then 0 else -sy

        for y in [height..oy] by -sy
            
            for x in [width..ox] by -sx
                
                ctx.save()
                ctx.translate x, y
                fn ctx, x, y
                ctx.restore()

    # Creates a tile image from a draw method and repeats it accross a grid
    # @param sx horizontal tile spacing
    # @param sy vertical tile spacing
    # @param sw source tile width
    # @param sh source tile height

    tile = ( sx, sy, sw, sh, fn ) ->

        fbo.canvas.width = sw
        fbo.canvas.height = sh

        # Use createPattern instead?
        fn fbo
        repeat sx, sy, ( ctx ) -> ctx.drawImage fbo.canvas, 0, 0

    # Distributes draw method at a given density

    distribute = ( density, w, h, fn ) ->

        count = (sqrt w * h) * density
        
        for i in [0..count]
            ctx.save()
            ctx.translate (random w), (random h)
            fn ctx
            ctx.restore()


    # --------------------------------------------------
    # Pattern elements
    # --------------------------------------------------

    class Branch
        
        constructor: ( @tree = [], @x = 0, @y = 0, @theta = 0, @thickness = 5, @decay = 1, @generation = 0 ) ->
            
            @growing = yes
            @path = [ x:@x, y:@y, t:@thickness ]
        
        grow: ->
            
            @x += @thickness * cos @theta
            @y += @thickness * sin @theta
            @path.push x:@x, y:@y, t:@thickness
            
            @decay *= 0.8
            @growing = no if @decay < 0.1
            
            if @growing and @generation < 2 and chance 0.2

                angle = @theta + (PI / 4) * if @generation isnt 0 and chance 0.5 then 1 else -1
                @tree.push new Branch @tree, @x, @y, angle, @thickness - 3, @decay, @generation + 1


    # --------------------------------------------------
    # Properties
    # --------------------------------------------------

    ctx = augment (document.createElement 'canvas').getContext '2d'
    fbo = augment (document.createElement 'canvas').getContext '2d'
    
    background = '#ffffff'
    pallette = []

    height = ctx.canvas.height
    width = ctx.canvas.width

    ready = no
    callbacks = []
    sprite = new Image()
    #sprite.src = 'img/sprites.png'
    sprite.onload = -> ready = yes; do fn for fn in callbacks


    # --------------------------------------------------
    # API
    # --------------------------------------------------

    pattern: 'tri'

    canvas: ctx.canvas
    generation: 0

    ready: ( fn ) ->

        if ready then do fn else callbacks.push fn

    setSize: ( w, h ) ->

        width = w
        height = h

    draw: ( label = no ) ->

        ctx.canvas.width = width
        ctx.canvas.height = height

        # Select a random theme
        theme = if @generation is 0 then themes[0] else random themes
        pallette = (utils.hex2hsl color for color in theme)
        background = (pallette.splice (random pallette.length | 0), 1)[0]
        
        ctx.fillStyle = "hsl(#{background[0]},#{background[1]}%,#{background[2]}%)"
        ctx.fillRect 0, 0, width, height

        if @generation is 0

            do @patterns.star

            message = 'UNWRAP ME!'

            ctx.restore()
            ctx.translate width * 0.5, height * 0.5
            ctx.scale 8, 8
            ctx.rotate (if chance 0.5 then 1 else -1) * (random 0.2, 0.3)
            
            ctx.font = '20px; Arial+Bold'
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'
            
            metrics = ctx.measureText message
            size = metrics.width + 4
            ctx.fillStyle = '#000'
            ctx.fillRect size * -0.5, -7, size, 15

            ctx.fillStyle = '#fff'
            ctx.fillText message, 0, 0

        else

            if @generation > 10 and chance 0.5 then do @special.doom
            else do @patterns[ random (pattern for pattern of @patterns) ]

        @generation++

    cloneCanvas: ->

        copyCanvas = document.createElement 'canvas'
        copyCanvas.height = ctx.canvas.height
        copyCanvas.width = ctx.canvas.width
        
        copyCtx = copyCanvas.getContext '2d'
        copyCtx.drawImage ctx.canvas, 0, 0

        copyCanvas

    # --------------------------------------------------
    # Patterns
    # --------------------------------------------------

    special:

        doom: ->

            sprite = do Sprites.random
            size = random 200, 280

            repeat size, size, ( ctx ) ->

                [ h, s, l ] = random pallette
                ctx.drawTintedImage sprite, "hsl(#{h},#{s}%,#{l}%)", 0, 0

    patterns:

        snowman: ->

            size = random 180, 400
            randomCol = chance 0.5
            variants = makeVariants (random pallette), 100, 0.1

            if chance 0.7

                distribute (random 0.02, 0.05), width, height, ( ctx ) ->

                    sides = round random 3, 5
                    theta = PI / sides
                    length = random 4, 20

                    ctx.lineWidth = random 1, 5
                    ctx.rotate random TWO_PI
                    ctx.randomStrokeStyle variants

                    for i in [1..sides]

                        ctx.beginPath()
                        ctx.moveTo -(length * random 0.8, 1.2), 0
                        ctx.lineTo (length * random 0.8, 1.2), 0
                        ctx.stroke()
                        ctx.rotate theta + random -0.05, 0.05

            repeat size, size, ( ctx ) ->

                ctx.shadowColor = 'rgba(0,0,0,0.2)'
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 1

                if randomCol and chance 0.8 then ctx.randomFillStyle variants
                else ctx.fillStyle = '#fff'

                headRadius = random 20, 40
                bodyRadius = headRadius * random 1.2, 2.0
                eyeRadius = headRadius * random 0.1, 0.2

                # body

                ctx.dot 0, (bodyRadius * random 0.9, 1.2), bodyRadius
                ctx.fill()

                # head

                ctx.dot 0, 0, headRadius
                ctx.fill()

                # face

                ep1 = x: (headRadius * random -0.2, -0.5), y: (headRadius * random -0.4, 0.1)
                ep2 = x: (headRadius * random 0.2, 0.5), y: (headRadius * random -0.4, 0.1)

                ctx.fillStyle = '#000'
                ctx.dot ep1.x, ep1.y, eyeRadius * random 0.8, 1.2
                ctx.fill()
                ctx.dot ep2.x, ep2.y, eyeRadius * random 0.8, 1.2
                ctx.fill()

                sx = random 10, 25
                sy = random 3, 6

                dx = ep2.x - ep1.x
                dy = ep2.y - ep1.y

                ctx.save()
                ctx.translate ep1.x + dx / 2, ep1.y + dy / 2
                ctx.rotate HALF_PI + (random -0.2, 0.2) + atan2 dy, dx
                ctx.translate (random 5, 10), 0
                ctx.tri 0, -sy, sx, 0, 0, sy

                h = random 30, 40
                l = random 45, 60

                ctx.fillStyle = "hsl(#{h},100%,#{l}%)"
                ctx.fill()
                ctx.restore()

                # arms

                armLength = bodyRadius * random 0.35, 0.5
                fingerLength = armLength * random 0.4, 0.6
                armAngle = PI * random -0.1, 0.1

                arm = ( dir = 1 ) ->

                    ctx.strokeStyle = '#000'
                    ctx.lineWidth = random 3, 5

                    ctx.save()
                    ctx.scale dir, 1
                    
                    ctx.beginPath()
                    ctx.translate (bodyRadius * random 0.8, 0.9), (bodyRadius * random 0.7, 1.1)
                    ctx.rotate armAngle
                    ctx.moveTo 0, 0
                    ctx.lineTo armLength, 0
                    ctx.stroke()

                    ctx.translate (armLength * (random 0.5, 1.0)), 0
                    ctx.rotate PI * random -0.2, -0.3
                    ctx.beginPath()
                    ctx.moveTo 0, 0
                    ctx.lineTo (fingerLength * random 0.8, 1.2), 0
                    ctx.lineWidth *= 0.8
                    ctx.stroke()

                    ctx.translate (random -2, 2), 0
                    ctx.rotate HALF_PI
                    ctx.beginPath()
                    ctx.moveTo 0, 0
                    ctx.lineTo (fingerLength * random 0.8, 1.2), 0
                    ctx.stroke()

                    ctx.restore()

                arm -1
                arm 1


        box: ->

            # Boxes and plaid patterns
            size = floor random 50, 200

            hc = random pallette
            vc = random pallette

            composite = [
                'source-over'
                'destination-out'
                'source-atop'
            ]
            
            repeat size, size, ( ctx, x, y ) ->

                ctx.randomFillStyle pallette
                ctx.globalCompositeOperation = random composite

                sx = size * floor random 4
                sy = size * floor random 4

                ctx.rotate HALF_PI * floor random 4
                ctx.globalAlpha = random 0.5, 1.0
                ctx.fillRect 0, 0, sx, sy

        # check: ->

        #     size = round random 100, 200
        #     types = [0..3].sort -> chance 0.5
        #     count = random types.length
        #     variants = makeVariants (random pallette), 100, 0.1

        #     repeat size, size, ( ctx ) ->

        #         type = -1 + round random count
        #         side = size * round random 2

        #         ctx.randomFillStyle variants
        #         ctx.fillRect 0, 0, side, side
                
        #         ctx.beginPath()
        #         ctx.rect 0, 0, side, side
        #         ctx.clip()

        #         switch type

        #             when types[0] # stripes

        #                 thickness = side * random 0.1, 0.2
        #                 vertical = chance 0.5

        #                 position = random thickness

        #                 while position < side

        #                     ctx.randomFillStyle pallette
        #                     ctx.globalAlpha = random 0.5
                            
        #                     if vertical then ctx.fillRect position, 0, thickness, height
        #                     else ctx.fillRect 0, position, width, thickness

        #                     thickness *= random 0.8, 1.2
        #                     position += thickness * random 1.0, 2.0

        #             when types[1] # dots

        #                 scale = random 0.25, 1.8
                        
        #                 distribute (random 0.05), side, side, ( ctx ) ->

        #                     ctx.randomFillStrokeStyle pallette

        #                     ctx.dot 0, 0, scale * random 10, 60
        #                     ctx.globalAlpha = random 0.5
                            
        #                     if chance 0.5 then ctx.stroke() else ctx.fill()

        #             when types[2], types[23] # shape

        #                 scale = random 0.25, 1.8

        #                 distribute (random 0.05), side, side, ( ctx ) ->

        #                     ctx.randomFillStrokeStyle pallette

        #                     radius = (scale * random 40, 200) / 100
                            
        #                     ctx.rotate random TWO_PI
        #                     ctx.scale radius, radius
        #                     ctx.drawShape Shapes.random()
        #                     ctx.globalAlpha = random 0.5
                            
        #                     if chance 0.75 then ctx.fill() else ctx.stroke()

        star: ->

            scatter = chance 0.5
            scale = random 0.2, 1.2
            size = random 80, 200
            jitter = random 0.2

            make = ( ctx ) ->

                points = round random 5, 8
                outerRad = random 5, 60
                innerRad = outerRad * random 0.1, 0.6

                theta = 0
                step = TWO_PI / (points * 2)

                shape = []
                offset = random jitter

                while theta < TWO_PI

                    radius = outerRad * random 1 - offset, 1 + offset
                    shape.push x:(radius * cos theta), y:(radius * sin theta)
                    theta += step

                    radius = innerRad * random 1 - offset, 1 + offset
                    shape.push x:(radius * cos theta), y:(radius * sin theta)
                    theta += step

                ctx.rotate random TWO_PI
                ctx.scale scale, scale
                ctx.drawPath shape
                ctx.globalAlpha = random 0.25, 0.8
                ctx.randomFillStyle pallette
                ctx.fill()

            if scatter then distribute (random 0.05, 0.15), width, height, make
            else repeat size, size, make

        # tetris: ->
        tree: ->

            variants = makeVariants (random pallette), 100, 0.2

            distribute (random 0.02, 0.05), width, height, ( ctx ) ->

                sides = round random 3, 5
                theta = PI / sides
                size = random 4, 20

                ctx.lineWidth = random 1, 5
                ctx.rotate random TWO_PI
                ctx.randomStrokeStyle variants

                for i in [1..sides]

                    ctx.beginPath()
                    ctx.moveTo -(size * random 0.8, 1.2), 0
                    ctx.lineTo (size * random 0.8, 1.2), 0
                    ctx.stroke()
                    ctx.rotate theta + random -0.05, 0.05

            size = random 120, 360
            scatter = size * random 0.2, 0.8

            repeat size, size, ( ctx ) ->

                ctx.translate (random scatter), (random scatter)

                # Make a tree
                parts = floor random 2, 6
                size = random 10, 60
                pos = 0

                variants = makeVariants (random pallette), 10, 0.1

                for i in [0..parts]

                    size *= random 0.8, 0.95
                    scale = size / 100
                    pos -= size * random 0.6, 0.9
                    
                    ctx.save()
                    ctx.translate size * -0.5, size * -0.5
                    ctx.translate 0, pos

                    ctx.scale (scale * random 0.8, 1.2), (scale * random 0.8, 1.2)
                    ctx.rotate PI * random -0.025, 0.025
                    ctx.drawShape Shapes.triangle, 2
                    ctx.randomFillStyle variants
                    ctx.globalAlpha = random 0.7, 0.95
                    ctx.fill()

                    ctx.restore()
        
        snow: ->

            snowflake = ->

                tree = []
                paths = []

                thickness = random 10, 20
                tree.push new Branch tree, 0, 0, -HALF_PI, thickness

                # Grow tree
                while tree.length

                    i = tree.length

                    while i--

                        if not tree[i].growing

                            branch = (tree.splice i, 1)[0]
                            paths.push branch.path

                    do branch.grow for branch in tree

                ctx.lineJoin = 'miter'

                steps = floor random 3, 8
                theta = TWO_PI / steps

                for i in [0..steps-1]

                    ctx.rotate theta

                    for path in paths

                        ctx.beginPath()
                        ctx.moveTo path[0].x, path[0].y
                        ctx.lineTo part.x, part.y for part in path
                        ctx.lineWidth = part.t                   
                        ctx.stroke()

                        ctx.save()
                        ctx.scale -1, 1
                        ctx.beginPath()
                        ctx.moveTo path[0].x, path[0].y
                        ctx.lineTo part.x, part.y for part in path when part.t isnt thickness
                        ctx.lineWidth = part.t                   
                        ctx.stroke()
                        ctx.restore()

            ctx.shadowColor = 'rgba(0,0,0,0.1)'
            ctx.shadowOffsetX = 2
            ctx.shadowOffsetY = 2

            make = ( ctx ) ->

                variants = makeVariants (random pallette), 10, 0.1

                scale = random 0.05, 0.4
                ctx.scale scale, scale
                ctx.rotate random TWO_PI
                ctx.randomStrokeStyle variants

                do snowflake

            scatter = chance 0.5
            size = random 80, 240

            if scatter then distribute (random 0.05, 0.1), width, height, make
            else repeat size, size, make

        # bird: ->

        scales: ->

            size = random 80, 120
            radius = size * random 0.5, 1.0
            variants = makeVariants (random pallette), 100, (random 0.1, 0.2)
            stroke = chance 0.5
            type = random [ 'dot', 'rect' ]

            ctx.globalAlpha = random 0.5, 0.9
            ctx.lineWidth = radius * random 0.1, 0.8
            ctx.shadowColor = "rgba(0,0,0,#{random 0.25})"
            ctx.shadowOffsetX = random -4, 4
            ctx.shadowOffsetY = random -4, 4

            repeat size, size, ( ctx ) ->

                switch type

                    when 'dot'
                        
                        ctx.dot 0, 0, radius

                    when 'rect'

                        ctx.rotate HALF_PI * -0.5
                        ctx.rect -radius, -radius, radius * 2, radius * 2

                ctx.randomFillStrokeStyle variants
                if stroke then ctx.stroke() else ctx.fill()

        polka: ->

            variants = makeVariants (random pallette), 100, 0.1
            scatter = chance 0.5
            cc = random 0.2, 1.0

            if scatter

                size = random 50, 120

                distribute (random 0.05, 0.2), width, height, ( ctx ) ->

                    ctx.randomFillStyle if chance cc then variants else pallette
                    ctx.fillStyle = '#ccc'
                    ctx.globalAlpha = do random
                    ctx.dot 0, 0, random size
                    ctx.fill()

            else

                size = random 50, 200
                scale = random 0.5, 1.2

                repeat size, size, ( ctx ) ->

                    ctx.randomFillStyle if chance cc then variants else pallette
                    ctx.globalAlpha = do random
                    ctx.dot 0, 0, random size * scale
                    ctx.fill()

        dot: ->

            size = random 20, 200
            minSize = size * random 0.1, 0.2
            maxSize = size * random 0.5, 1.0
            scatter = random 0.5
            origin = chance 0.3
            squares = chance 0.5
            dark = background[2] < 40

            repeat size, size, ( ctx ) ->

                if squares

                    ctx.randomFillStyle pallette
                    ctx.globalAlpha = random 0.1, 0.8
                    ctx.fillRect size * -0.5, size * -0.5, size, size

                ctx.randomFillStyle pallette

                radius = random minSize, maxSize
                if squares then radius = min radius, size * 0.5
                scale = radius / 50

                if origin

                    ctx.dot 0, 0, radius * random 0.05, 0.1
                    ctx.globalAlpha = random 0.1, 0.4
                    ctx.fill()

                ctx.rotate random TWO_PI
                ctx.scale scale, scale
                ctx.translate -50, -50
                ctx.drawShape Shapes.circle, 3
                ctx.globalAlpha = random 0.4, 0.9
                
                #if dark and chance 0.5 then ctx.globalCompositeOperation = 'lighter'
                
                ctx.fill()

        leaf: ->

            hsl = random pallette
            variants = makeVariants hsl, 100, 0.1
            scatter = chance 0.35

            shape = ( ctx, length ) ->

                t = length * random 0.2, 0.4
                x1a = length * random 0.2, 0.4
                x2a = length * random 0.5, 0.7
                x1b = x1a * random 0.8, 1.2
                x2b = x2a * random 0.8, 1.2

                ctx.beginPath()
                ctx.moveTo 0, 0
                ctx.bezierCurveTo t, x1a, t, x2a, 0, length
                ctx.bezierCurveTo -t, x2b, -t, x1b, 0, 0
                ctx.closePath()

            if scatter

                distribute 0.25, width, height, ( ctx ) ->

                    ctx.randomFillStyle if chance 0.75 then variants else pallette

                    ctx.rotate random TWO_PI
                    shape ctx, if chance 0.15 then random 80, 220 else random 40, 80
                    ctx.globalAlpha = random 0.6, 0.95
                    ctx.fill()

            else

                size = random 100, 400
                rings = random 3, 8

                startRadius = random 20
                endRadius = size * random 0.2, 0.5
                stepRadius = (endRadius - startRadius) / rings
                maxSteps = random 10, 30
                fillChance = random 0.5, 1.0

                repeat size, size, ( ctx ) ->

                    hsl = random pallette
                    variants = makeVariants hsl, 20, 0.1
                    thickness = random 1, 4
                    fill = chance fillChance

                    for radius in [startRadius..endRadius] by stepRadius

                        progress = radius / endRadius
                        numSteps = 2 + progress * maxSteps
                        thetaStep = TWO_PI / numSteps
                        size = random 10, 40 + 20 * (1 - progress)

                        for theta in [0..TWO_PI] by thetaStep

                            [ h, s, l ] = random variants

                            ctx.save()
                            ctx.rotate theta
                            ctx.translate radius, 0
                            ctx.rotate -HALF_PI
                            shape ctx, size
                            ctx.globalAlpha = random 0.6, 0.9

                            if fill

                                ctx.fillStyle = "hsl(#{h},#{s}%,#{l}%)"
                                ctx.fill()

                            else

                                ctx.strokeStyle = "hsl(#{h},#{s}%,#{l}%)"
                                ctx.lineWidth = thickness
                                ctx.stroke()

                            ctx.restore()

        tri: ->

            hsl = random pallette
            size = random 40, 100
            alpha = random 0.6, 0.8
            margin = 4 * floor random 3
            variants = makeVariants hsl, 100, 0.1
            overlays = random [ variants, pallette ]
            upper = chance 0.5
            lower = if not upper then yes else chance 0.5

            size2 = size * 2
            sizeM = size - margin

            repeat size, size, ( ctx ) ->

                if upper

                    ctx.tri margin, margin, sizeM, margin, sizeM, sizeM
                    ctx.globalAlpha = 1.0
                    ctx.randomFillStyle variants
                    ctx.fill()

                    ctx.tri 0, 0, size2, size2, 0, size2
                    ctx.globalAlpha = alpha
                    ctx.randomFillStyle overlays
                    ctx.fill()

                if lower

                    ctx.tri margin, margin, sizeM, sizeM, margin, sizeM
                    ctx.globalAlpha = 1.0
                    ctx.randomFillStyle variants
                    ctx.fill()

                    ctx.tri 0, 0, size2, 0, size2, size2
                    ctx.globalAlpha = alpha
                    ctx.randomFillStyle overlays
                    ctx.fill()

        bead: ->

            bg = background
            backgroundLight = "hsla(#{bg[0]},#{bg[1]}%,#{bg[2]*1.5}%,0.5)"
            ctx.strokeStyle = backgroundLight
            ctx.lineWidth = 1
            ctx.lineCap = 'round'

            shape = Shapes[ if chance 0.5 then 'teardrop' else 'teardrop2' ]
            sizeX = if shape is Shapes.teardrop then 40 else 45
            offsetR = random 0.1, 1.0
            density = random 0.1, 1.0
            shadow = chance 0.5
            snow = chance 0.5

            if snow
                
                distribute 0.1, width, height, ( ctx ) ->
                    ctx.dot 0, 0, random 2, 6
                    ctx.globalAlpha = random 0.5, 0.8
                    ctx.fillStyle = backgroundLight
                    ctx.fill()

            if shadow
                
                ctx.shadowColor = 'rgba(0,0,0,0.1)'
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = random 2, 8

            repeat (random 80, 100), height, ( ctx ) ->

                ctx.translate (random 80 * offsetR), 0

                y = 0

                while y < height

                    size = if chance 0.2 then random 160, 220 else random 5, 120
                    scale = size / 100

                    ctx.save()
                    ctx.translate scale * -sizeX, y
                    ctx.scale scale, scale
                    ctx.drawShape shape
                    ctx.globalAlpha = random 0.5, 0.9
                    ctx.randomFillStyle pallette
                    ctx.fill()
                    ctx.restore()

                    y += size

                    ctx.beginPath()
                    ctx.moveTo 0, y
                    ctx.lineTo 0, y += random 5, 50 * density
                    ctx.stroke()

        ###
        img: ->

            tile 50, 50, ( ctx ) ->

                [ h, s, l ] = random pallette
                ctx.drawTintedImage sprite, "hsl(#{h},#{s}%,#{l}%)", 0, 0
        ###

