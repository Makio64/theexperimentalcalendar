
class Paper extends THREE.Object3D

    cols: 10
    rows: 10
    bump: Bump.texture
    environment: THREE.ImageUtils.loadTextureCube [
        'build/img/skybox/px.jpg',
        'build/img/skybox/nx.jpg',
        'build/img/skybox/py.jpg',
        'build/img/skybox/ny.jpg',
        'build/img/skybox/pz.jpg',
        'build/img/skybox/nz.jpg'
    ]

    constructor: ->

        super

        @gravity = 0
        @stiffness = 0.6
        @anchors = []
        @targetPosition = @position.clone()
        
        @material = new THREE.MeshPhongMaterial
            shininess: 500
            ambient: 0x333333
            color: 0xCCCCCC
            specular: 0x666666
            bumpMap: @bump
            perPixel: no
            wrapAround: true
            bumpScale: 0.5
            metal: yes
            #wireframe: true
            envMap: @environment
            reflectivity: 1
            #refractionRatio: 1

        @material.side = THREE.DoubleSide

        #do @changePattern
        do @build

    build: ->

        @position.y = 0

        if @mesh?

            @remove @mesh
            renderer.deallocateObject @mesh

        radians = camera.fov * HALF_PI / 180
        height = (tan radians) * (camera.position.z - @position.z) * 2
        width = height * camera.aspect

        @geometry = new THREE.PlaneGeometry width, height, @cols, @rows
        @mesh = new THREE.Mesh @geometry, @material
        
        @mesh.receiveShadow  = yes
        @mesh.castShadow = yes
        @mesh.receiveShadow  = yes
        @mesh.castShadow = yes

        @add @mesh

        #do @changePattern
        do @initPhysics

    initPhysics: ->

        @springs = []

        vertices = @geometry.vertices
        faces = @geometry.faces

        # Init particles
        for vertex in vertices
            vertex.z = random 40
            do vertex.makeParticle 

        # Init springs
        for face in faces

            a = vertices[ face.a ]
            b = vertices[ face.b ]
            c = vertices[ face.c ]
            d = vertices[ face.d ]

            @springs.push new Spring a, d, (a.distanceTo d), @stiffness
            @springs.push new Spring b, c, (b.distanceTo c), @stiffness

            @springs.push new Spring a, b, (a.distanceTo b), @stiffness
            @springs.push new Spring d, c, (d.distanceTo c), @stiffness

            @springs.push new Spring a, c, (a.distanceTo c), @stiffness
            @springs.push new Spring b, d, (b.distanceTo d), @stiffness

    changePattern: ->

        Pattern.setSize width, height
        Bump.setSize width, height

        do Pattern.draw

        @material.bumpScale = random 0.5, 1.5
        @material.reflectivity = random 0.2, 0.9
        
        @material.bump = new THREE.Texture Bump.canvas
        @material.bump.needsUpdate = yes

        if Pattern.generation < 2 then artwork = Pattern.cloneCanvas()
        else artwork = Pattern.canvas

        @material.map = new THREE.Texture artwork
        @material.map.needsUpdate = yes

    moveTo: ( vec ) ->

        @targetPosition.copy vec
        @position.copy vec

    easeTo: ( vec ) ->

        @targetPosition.copy vec

    drop: ->

        anchor = new THREE.Vector3 (random -2000, 2000), 0, (random 2000)
        anchor.makeParticle()
        anchor.springs = []

        for vertex in @geometry.vertices

            distance = (anchor.distanceTo vertex) * random 0.8, 1.0
            spring = new Spring anchor, vertex, distance, 0.05
            anchor.springs.push spring
            @springs.push spring

        @anchors.push anchor

    update: ( dtSq ) ->

        anchor.y -= 500 for anchor in @anchors
        @position.z += (@targetPosition.z - @position.z) * 0.2

        vertex.integrate dtSq for vertex in @geometry.vertices
            
        do spring.update for spring in @springs
        @geometry.verticesNeedUpdate = true;

        vertex.z = max -20, vertex.z for vertex in @geometry.vertices

    resize: ->

        #do @build

    destroy: ->

        @springs = []
