/*
Denis Hovart, 2012

Available under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

var SteeringController = function (agent, fallback) {
    this.agent = agent;
    this.fallback = fallback;
    this.hasTarget = false;
    this.steeringGroup = new SteeringGroup();
    this.target = null;
    this.constraints = [];
};
SteeringController.prototype.addConstraint = function (constraint) {
    this.constraints.push(constraint);
};
SteeringController.prototype.getSteering = function () {
    var totalConstraints = this.constraints.length;
    var hasNewTarget = false;
    for(var i = 0; i < totalConstraints; i++) {
        if (this.constraints[i].mustBeSatisfied()) {
            this.target = this.constraints[i].getSuggestedTarget();
            hasNewTarget = true;
        }
    }
    if(hasNewTarget) {
        this.steeringGroup.reset();
        this.steeringGroup.add(new Seek(this.agent, this.target));
        this.steeringGroup.add(new Face(this.agent, this.target));
        this.hasTarget = true;
    }
    if(this.hasTarget) {
        if(Vec2d.subtract(this.target.position, this.agent.position).length() <= 3) {
            this.hasTarget = false;
            this.fallback.wanderOrientation = Math.random()*2 * Math.PI;
        } else {
            this.steeringGroup.compute();
            return this.steeringGroup;
        }
    }
    if(!this.hasTarget) {
        this.fallback.computeSteering();
        return this.fallback;
    }
};

var AvoidWallsConstraint = function (agent, walls) {
    this.agent = agent;
    this.walls = walls;
    this.avoidDistance = 60;
    this.lookahead = 100;
    this.alternateGoal = new Vec2d;
};
AvoidWallsConstraint.prototype.mustBeSatisfied = function() {
    this.rayVector = this.agent.velocity.clone();
    this.rayVector.normalize();
    this.rayVector.multiply(this.lookahead);
    
    var raySegment = this.rayVector.toSegment(this.agent.position);
    for (var i = 0; i < this.walls.length; i++) {
        var intersection;
        if(intersection = this.walls[i].intersect(raySegment)) {
            
            // var reflection =  Vec2d.multiply(intersection.normal, Vec2d.dot(this.agent.velocity, intersection.normal) * -2);
            // reflection.normalize();
            // reflection.multiply(this.lookahead);
            
            intersection.normal.normalize();
            intersection.normal.multiply(this.avoidDistance);
            // app.debugDraw.visitVec2(intersection.normal, new Vec2d(app.width/2, app.height/2));
            this.suggestedTarget = { position : Vec2d.add(intersection.point, intersection.normal) };
            return true;
        }
    }
    return false;
};
AvoidWallsConstraint.prototype.getSuggestedTarget = function() {
    return this.suggestedTarget;
};
AvoidWallsConstraint.prototype.debugDraw = function(dd) {
//   dd.visitAvoidWallsConstraint(this);
};
