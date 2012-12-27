
Sprites = do ->

    canvas = {}
    slices =
        a: x:0, y:0, w:140, h:170
        b: x:150, y:0, w:165, h:161
        c: x:323, y:0, w:91, h:157
        d: x:10, y:178, w:114, h:97
        e: x:9, y:283, w:115, h:82
        f: x:138, y:189, w:78, h:93
        g: x:130, y:300, w:96, h:65
        h: x:238, y:199, w:176, h:167

    canvas[ name ] = new Image() for name, slice of slices

    image = new Image()
    image.onload = =>    

        for name, slice of slices
            
            img = document.createElement 'canvas'
            img.height = slice.h
            img.width = slice.w

            ctx = img.getContext '2d'
            ctx.drawImage image, slice.x, slice.y, slice.w, slice.h, 0, 0, slice.w, slice.h

            canvas[ name ] = img

    image.src = 'build/img/sprites.png'

    # API

    canvas: canvas
    random: ->

        canvas[ random ( name for name of canvas ) ]