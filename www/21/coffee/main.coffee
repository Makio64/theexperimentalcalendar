
width = window.innerWidth
height = window.innerHeight
aspect = width / height
distance = 1200
renderer = new THREE.WebGLRenderer antialias: yes
camera = new THREE.PerspectiveCamera 75, aspect, 1, 10000
scene = new Scene
clock = +new Date
drag = new THREE.Vector3

init = ->

    # Setup renderer
    renderer.shadowMapEnabled = yes
    renderer.shadowMapSoft = yes
    renderer.shadowMapCascade = yes
    renderer.setClearColor 0x111111

    renderer.gammaInput = yes
    renderer.gammaOutput = yes

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

     now = +new Date
     dt = now - clock
     dtSq = dt * dt
     clock = now

     scene.update dtSq
     renderer.render scene.scene, camera
     requestAnimationFrame update

# --------------------------------------------------
# Event handlers
# --------------------------------------------------

mousedown = ( e ) ->

    renderer.domElement.className = 'grabbing'
    drag = do scene.mouse.clone
    do @scene.startDrag

mouseup = ( e ) ->

    renderer.domElement.className = ''
    do @scene.stopDrag

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