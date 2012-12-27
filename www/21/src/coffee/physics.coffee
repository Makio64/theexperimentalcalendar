
# --------------------------------------------------
# Particle
# --------------------------------------------------

THREE.Vector3::makeParticle = ->
    
    @mass = 1.0
    @massInv = 1.0 / @mass
    @fixed = no
    @old = @clone()
    @acc = new THREE.Vector3()
    @vel = new THREE.Vector3()
    @tmp = new THREE.Vector3()

THREE.Vector3::integrate = ( dtSq ) ->

    return if @fixed

    #@acc.y = -0.001
    @acc.multiplyScalar @massInv

    @vel.sub @, @old
    @vel.multiplyScalar 0.8

    @acc.multiplyScalar dtSq
    @vel.addSelf @acc

    @tmp.add @, @vel
    @old.copy @
    @copy @tmp

    @acc.set 0,0,0

# --------------------------------------------------
# Spring
# --------------------------------------------------

class Spring

    constructor: ( @p1 = new THREE.Vector3, @p2 = new THREE.Vector3, @restlength = 10, @stiffness = 1.0 ) ->
        
        @delta = new THREE.Vector3();

    update: ->

        @delta.sub @p2, @p1
        dist = do @delta.length + 0.000001
        force = (dist - @restlength) / (dist * (@p1.massInv + @p2.massInv)) * @stiffness

        if !@p1.fixed

            copy = do @delta.clone
            copy.multiplyScalar force * @p1.massInv
            @p1.addSelf copy

        if !@p2.fixed

            @delta.multiplyScalar -force * @p2.massInv
            @p2.addSelf @delta
