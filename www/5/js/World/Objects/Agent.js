/*
Denis Hovart, 2012

Available under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

var Agent = function (position, orientation, maxSpeed, maxRotation) {
    // I should implement functionnal inheritance
    BaseObject.call(this, position, orientation);
    this.velocity = new Vec2d();
    this.rotation = 0;
    this.maxSpeed = maxSpeed;
    this.maxRotation = maxRotation;
//    this.steeringBehavior = new SteeringBehavior(this);
    this.isAlwaysVisible = false;
    this.maxPositionX = 0;
    this.maxPositionY = 0;
};

Agent.prototype = Object.create(BaseObject.prototype);

Agent.prototype.update = function (steering) {
    this.velocity.add(steering.force);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.rotation = steering.rotation;
    this.rotation = Math.min(this.maxRotation, this.rotation);
    this.orientation += this.rotation;
    this.orientation %= Math.PI * 2;
    
    if (this.isAlwaysVisible) {
        this.position.x %= this.maxPositionX;
        this.position.y %= this.maxPositionY;
    
        if (this.position.x < 0) this.position.x = this.maxPositionX;
        if (this.position.y < 0) this.position.y = this.maxPositionY;
    }
    
};
Agent.prototype.keepVisible = function (maxX, maxY) {
    this.isAlwaysVisible = true;
    this.maxPositionX = maxX;
    this.maxPositionY = maxY;
};
Agent.prototype.draw = function (context) {
};
Agent.prototype.acceptDebugDraw = function (dd) {
    dd.visitObject(this);
};
