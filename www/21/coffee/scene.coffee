
class Scene

    currentPosition: new THREE.Vector3( 0, 0, -100 )
    nextPosition: new THREE.Vector3( 0, 0, -200 )
    oldPosition: new THREE.Vector3( 0, 0, 0 )

    constructor: ->

        @scene = new THREE.Scene
        @mouse = new THREE.Vector3
        @delta = new THREE.Vector3
        @distance = 0
        @dragging = no

        @current = null
        @next = null
        
        @anchor = new THREE.Vector3
        @anchor.makeParticle()
        @anchor.fixed = yes

        @springs = []
        @active = []

        do @lights

    init: ->

        @sheets = ( new Paper for i in [0..5] )
        @pool = do @sheets.concat
        
        @next = @pool.pop()
        @next.moveTo @currentPosition
        @next.build()
        @next.changePattern()

        @active.push @next

        do @nextSheet

    lights: ->

        @ambient = new THREE.AmbientLight 0xffffff

        @spot = new THREE.SpotLight 0xffffff, 2.0, 0, PI, 60
        @spot.position.set 500, 3000, 2000
        @spot.lookAt new THREE.Vector3()

        #@spot.shadowCameraVisible = true;
        @spot.shadowMapHeight = 512 * 2
        @spot.shadowMapWidth = 512 * 2
        @spot.shadowDarkness = 0.25
        @spot.castShadow = yes

        @scene.add @ambient
        @scene.add @spot
    
    nextSheet: ->

        @current?.easeTo @oldPosition

        while @pool.length < 2
            
            sheet = @active.shift()
            @scene.remove sheet
            @pool.unshift sheet

        @current = @next
        @next = @pool.pop()

        @current.easeTo @currentPosition
        @next.moveTo @nextPosition
        @next.build()
        @next.changePattern()

        @scene.add @current
        @scene.add @next

        @active.push @next
        @distance = 0

    startDrag: ->

        return if not @current

        @dragging = yes

        # Make some random springs
        vertices = do @current.geometry.vertices.concat

        vertices.sort ( a, b ) => a.distanceTo( @anchor ) - b.distanceTo( @anchor )

        # Connect springs to the closest points
        connections = floor random 20, 80
        
        for index in [0..connections]

            vertex = vertices[ index ]
            distance = @anchor.distanceTo vertex
            @springs.push new Spring @anchor, vertex, distance * (random 0.8, 0.9), random 0.4, 0.7

    stopDrag: ->

        @dragging = no

        @springs = []

        if @distance > 800
            
            @current.drop()
            do @nextSheet

    update: ( dtSq ) ->

        @distance += @delta.length() if @dragging

        # Ease mouse
        @delta.sub @mouse, @anchor
        @delta.multiplyScalar 0.08
        @anchor.addSelf @delta

        # Update sheets
        paper.update dtSq for paper in @active

        # Update springs
        spring.update dtSq for spring in @springs

    resize: ->

        do sheet.resize for sheet in @sheets
