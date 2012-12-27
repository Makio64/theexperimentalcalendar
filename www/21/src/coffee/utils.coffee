
utils = do ->

    hex2rgb: ( hex ) ->

        rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec hex
        [(parseInt rgb[1], 16), (parseInt rgb[2], 16), (parseInt rgb[3], 16)]

    rgb2hex: ( r, g, b) ->
        
        '#' + ( ( 1 << 24 ) + ( r << 16 ) + ( g << 8 ) + b ).toString( 16 ).slice 1

    hex2hsl: ( hex ) ->

        [ r, g, b ] = utils.hex2rgb hex
        utils.rgb2hsl r, g, b

    rgb2hsl: ( r, g, b ) ->
        
        r /= 255
        g /= 255
        b /= 255

        mn = min r, g, b
        mx = max r, g, b

        l = 0.5 * (mn + mx)

        if mx is mn then h = s = 0
        else

            d = mx - mn
            s = if l > 0.5 then d / (2 - mx - mn) else d / (mx + mn)

            switch mx

                when r then h = (g - b) / d + ( if g < b then 6 else 0)
                when g then h = (b - r) / d + 2
                when b then h = (r - g) / d + 4

            h /= 6

        h = round h * 360
        s = round s * 100
        l = round l * 100

        [ h, s, l ]