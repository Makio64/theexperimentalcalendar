/*
Denis Hovart, 2012

Available under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

var Segment = function (A, B) { 
    this.pointA = A;
    this.pointB = B;
};

Segment.prototype.getVectorAB = function() {
    return Vec2d.subtract(this.pointB, this.pointA);
};

Segment.intersect = function (seg1, seg2) {
    var r = seg1.getVectorAB();
    var s = seg2.getVectorAB();
    var epsilon = 10e-6;
    var rCrossS = Vec2d.cross2d(r, s);
    var dist = Vec2d.subtract(seg2.pointA, seg1.pointA);
    if(rCrossS <= epsilon && rCrossS >= -1 * epsilon) return false;
    t = Vec2d.cross2d(dist, s) / rCrossS;
    u = Vec2d.cross2d(dist, r) / rCrossS;
    if (0 <= u && u <= 1 && 0 <= t && t <= 1) {
        var vec1 = seg1.getVectorAB();
        var vec2 = seg2.getVectorAB();
        return {
            point : Vec2d.add(seg1.pointA, Vec2d.multiply(r, t)),
            normal : new Vec2d(-(vec1.y - vec2.y), vec1.x - vec2.x)
        }
    }
    else
        return false;
};

Segment.prototype.intersect = function (segment) {
    return Segment.intersect(this, segment);
};

Segment.prototype.acceptDebugDraw = function(dd) {
    dd.visitSegment(this);
};
