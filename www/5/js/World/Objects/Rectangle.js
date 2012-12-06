/*
Denis Hovart, 2012

Available under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

var Rectangle = function (width, height, position, orientation) {
    BaseObject.call(this, position, orientation);
    this.width = width;
    this.height = height;
    this.segments = [];

    var pointA = new Vec2d(this.position.x ,this.position.y);
    var pointB = new Vec2d(this.position.x + width ,this.position.y);
    var pointC = new Vec2d(this.position.x + width,this.position.y + height);
    var pointD = new Vec2d(this.position.x, this.position.y + height);
    
    this.segments = [
        new Segment(pointA, pointB),
        new Segment(pointB, pointC),
        new Segment(pointC, pointD),
        new Segment(pointD, pointA)
    ];
};
Rectangle.prototype.getSegments = function() {
    return this.segments;
};
