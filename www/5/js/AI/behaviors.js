/*
Denis Hovart, 2012

Available under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

var Behavior = function (agent, target) {
    this.agent = agent;
    this.target = target;
    this.force = new Vec2d();
    this.rotation = 0;
    this.weight = 1;
    this.isActive = true;
};

var Seek = function (agent, target) {
    Behavior.prototype.constructor.apply(this, arguments);
};
Seek.getSteering = function (agent, target) {
    var distanceToTarget = Vec2d.subtract(target.position, agent.position);
    var force = distanceToTarget;
    force.normalize().multiply(agent.maxSpeed);
    return force;
};
Seek.prototype.computeSteering = function() {
    this.force = Seek.getSteering(this.agent, this.target);
};
Seek.prototype.acceptDebugDraw = function (dd) {
    if(this.force) this.force.acceptDebugDraw(dd, this.agent.position);
};

var MoveForward = function (agent) {
    Behavior.prototype.constructor.call(this, arguments[0], null);
};
MoveForward.prototype.computeSteering = function() {
    this.force.x = Math.cos(this.agent.orientation);
    this.force.y = Math.sin(this.agent.orientation);
    this.force.multiply(this.agent.maxSpeed);
};
MoveForward.prototype.acceptDebugDraw = function (dd) {
    if(this.force) this.force.acceptDebugDraw(dd, this.agent.position);
};

var Flee = function (agent, target) {
    Behavior.prototype.constructor.apply(this, arguments);
};
Flee.prototype.computeSteering = function() {
    Seek.prototype.computeSteering.call(this);
    this.force.multiply(-1);
    console.log(this.force);
};
Flee.prototype.acceptDebugDraw = function (dd) {
    if(this.force) this.force.acceptDebugDraw(dd, this.agent.position);
};

var LookAhead = function (agent) {
    Behavior.prototype.constructor.apply(this, arguments);
};
LookAhead.prototype.computeSteering = function() {
    this.agent.orientation = Math.atan2(this.agent.velocity.y, this.agent.velocity.x);
};

var Align = function (agent, target, slowRadius) {
    Behavior.prototype.constructor.call(this, arguments[0], arguments[1]);
    this.slowRadius = (slowRadius !== undefined) ? slowRadius : (15 * Math.PI) / 180;
};
Align.getAngularSteering = function(agent, target, slowRadius) {
    var rotation = agent.maxRotation,
        agentOrientationAsVector = new Vec2d(Math.cos(agent.orientation), Math.sin(agent.orientation)),
        targetOrientationAsVector = new Vec2d(Math.cos(target.orientation), Math.sin(target.orientation));
    var angle = Vec2d.angleBetween(agentOrientationAsVector, targetOrientationAsVector);
    var distance = target.orientation - agent.orientation;
    if (distance >  Math.PI) distance -= Math.PI * 2;
    if (distance < -Math.PI) distance += Math.PI * 2;
    if (angle < slowRadius) rotation *= angle / slowRadius;
    var direction =  distance / Math.abs(distance);
    return rotation * direction;
};
Align.prototype.computeSteering = function() {
    this.rotation = this.getAngularSteering(this.agent, this.target, this.slowRadius);
};

var Face = function (agent, target, slowRadius) {
    Align.prototype.constructor.apply(this, arguments);
};
Face.getAngularSteering = function (agent, target, slowRadius) {
    var newTarget = {
        orientation : Math.atan2(target.position.y - agent.position.y, target.position.x - agent.position.x)
    }
    return Align.getAngularSteering(agent, newTarget, slowRadius)
}
Face.prototype.computeSteering = function() {
    this.rotation = Face.getAngularSteering(this.agent, this.target, this.slowRadius);
};

var GravitateAround = function (agent, target, radius) {
    Behavior.prototype.constructor.call(this, arguments[0], arguments[1]);
    this.radius = (radius !== undefined) ? radius : 10;
};
GravitateAround.prototype.computeSteering = function() {
    Seek.prototype.computeSteering.call(this);
    if(this.force.length() < this.radius) {
        this.force.normalize().multiply( this.distanceToTarget.length() / this.radius);
    }
};
GravitateAround.prototype.acceptDebugDraw = function(dd) {
    if(this.force) this.force.acceptDebugDraw(dd, this.agent.position);
}

var Wander = function (agent, radius, distance) {
    Behavior.prototype.constructor.call(this, arguments[0], { position : new Vec2d() });
    this.radius = radius;
    this.distance = distance;
    this.wanderOffset = 30;
    this.wanderRadius = 10;
    this.wanderRate = (20 * Math.PI) / 180;
    this.wanderOrientation = 2 * Math.PI;
    this.wanderPosition = new Vec2d();
    this.slowRadius = 50 * Math.PI / 180;
};
Wander.prototype.computeSteering = function() {
    this.wanderOrientation += (Math.random() - Math.random()) * this.wanderRate;
    var agentOrientationAsVector = new Vec2d(Math.cos(this.agent.orientation), Math.sin(this.agent.orientation));
    this.wanderPosition = Vec2d.add(this.agent.position, agentOrientationAsVector.multiply(this.wanderOffset));
    this.target.position.x = Math.cos(this.wanderOrientation);
    this.target.position.y = Math.sin(this.wanderOrientation);
    this.target.position.multiply(this.wanderRadius).add(this.wanderPosition);
    Face.prototype.computeSteering.call(this);
    Seek.prototype.computeSteering.call(this);
    //MoveForward.prototype.computeSteering.call(this);
};
Wander.prototype.acceptDebugDraw = function(dd) {
    if(this.force) this.force.acceptDebugDraw(dd, this.agent.position);
    dd.visitWanderBehavior(this);
}
