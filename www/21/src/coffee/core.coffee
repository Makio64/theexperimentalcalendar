
# requestAnimationFrame shim

do ->
    w = window
    for vendor in ['ms', 'moz', 'webkit', 'o']
        break if w.requestAnimationFrame
        w.requestAnimationFrame = w["#{vendor}RequestAnimationFrame"]
        w.cancelAnimationFrame = (w["#{vendor}CancelAnimationFrame"] or
                                  w["#{vendor}CancelRequestAnimationFrame"])

    # deal with the case where rAF is built in but cAF is not.
    if w.requestAnimationFrame
        return if w.cancelAnimationFrame
        browserRaf = w.requestAnimationFrame
        canceled = {}
        w.requestAnimationFrame = (callback) ->
            id = browserRaf (time) ->
                if id of canceled then delete canceled[id]
                else callback time
        w.cancelAnimationFrame = (id) -> canceled[id] = true

    # handle legacy browsers which don’t implement rAF
    else
        targetTime = 0
        w.requestAnimationFrame = (callback) ->
            targetTime = Math.max targetTime + 16, currentTime = +new Date
            w.setTimeout (-> callback +new Date), targetTime - currentTime

        w.cancelAnimationFrame = (id) -> clearTimeout id

# --------------------------------------------------
# Shortcuts
# --------------------------------------------------

PI = Math.PI
TWO_PI = PI * 2
HALF_PI = PI / 2

min = Math.min
max = Math.max
sin = Math.sin
cos = Math.cos
tan = Math.tan
atan2 = Math.atan2
round = Math.round
floor = Math.floor
ceil = Math.ceil
sqrt = Math.sqrt

# Returns a random boolean based on a given probability

chance = ( probability ) -> Math.random() < probability

# Random number / range / array item generator

random = ( min, max ) ->

    if min and typeof min.length is 'number' and min.length?
        return min[ floor Math.random() * min.length ]

    if typeof max isnt 'number'
        max = min or 1
        min = 0

    min + Math.random() * (max - min)