
width = window.innerWidth
height = window.innerHeight
aspect = width / height
distance = 1200
renderer = new THREE.WebGLRenderer antialias: yes
camera = new THREE.PerspectiveCamera 75, aspect, 1, 10000
scene = new Scene
clock = +new Date
drag = new THREE.Vector3
stats = new Stats?()
composer = null

init = ->

    # Stats
    if stats?

        document.body.appendChild stats.domElement
        stats.domElement.style.position = 'absolute'
        stats.domElement.style.left = '0px'
        stats.domElement.style.top = '0px'
        stats.setMode 0

    # Setup renderer
    renderer.shadowMapEnabled = yes
    renderer.shadowMapCascade = yes
    renderer.shadowMapSoft = yes
    renderer.setClearColor 0x111111
    renderer.autoClear = no

    renderer.gammaInput = yes
    renderer.gammaOutput = yes

    # Setup post processing
    renderModel = new THREE.RenderPass scene.scene, camera
    effectFilm = new THREE.FilmPass 0.12, 0.0, 0, no
    effectCopy = new THREE.ShaderPass THREE.CopyShader
    effectCopy.renderToScreen = yes

    composer = new THREE.EffectComposer renderer
    composer.addPass renderModel
    composer.addPass effectFilm
    composer.addPass effectCopy

    # Setup camera
    camera.position.z = distance

    # Setup domElement
    document.body.appendChild renderer.domElement

    # Bind event handlers
    window.addEventListener 'mousedown', mousedown
    window.addEventListener 'mousemove', mousemove
    window.addEventListener 'mouseup', mouseup
    window.addEventListener 'resize', resize

    # Get going
    do scene.init
    do resize
    do update

update = ->

    do stats?.begin

    now = +new Date
    dt = now - clock
    dtSq = dt * dt
    clock = now

    scene.update dtSq
    
    do renderer.clear
    composer.render dt/1000
    requestAnimationFrame update

    do stats?.end

# --------------------------------------------------
# Event handlers
# --------------------------------------------------

mousedown = ( e ) ->

    renderer.domElement.className = 'grabbing'
    drag = do scene.mouse.clone
    do scene.startDrag

mouseup = ( e ) ->

    renderer.domElement.className = ''
    do scene.stopDrag

mousemove = ( e ) ->

    scene.mouse.x = 1.5 * (( width * -0.5 ) + e.pageX);
    scene.mouse.y = 1.5 * (( height * 0.5 ) - e.pageY);

    if scene.dragging
        
        distance = drag.distanceTo scene.mouse
        diagonal = sqrt width * width + height * height
        scene.mouse.z = 300 * (distance / diagonal)

resize = ->

    width = window.innerWidth
    height = window.innerHeight

    renderer.setSize width, height
    camera.aspect = width / height

    do camera.updateProjectionMatrix
    do scene.resize

# --------------------------------------------------
# G'wan
# --------------------------------------------------

do init