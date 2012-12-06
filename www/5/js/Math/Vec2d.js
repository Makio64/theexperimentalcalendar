/*
Denis Hovart, 2012

Available under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

/* A very simple 2d vector class */
var Vec2d = function (x, y) {
    this.x = (x !== undefined) ? x : 0;
    this.y = (y !== undefined) ? y : 0;
};
Vec2d.add = function (vec1, vec2) {
    return new Vec2d(vec1.x + vec2.x, vec1.y + vec2.y);
};
Vec2d.subtract = function (vec1, vec2) {
    return new Vec2d(vec1.x - vec2.x, vec1.y - vec2.y);
};
Vec2d.multiply = function (vec, scalar) {
    return new Vec2d(vec.x * scalar, vec.y * scalar);
};
Vec2d.dot = function (vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
}
Vec2d.cross2d = function (vec1, vec2) {
    return vec1.x * vec2.y - vec2.x * vec1.y;
}
Vec2d.angleBetween = function (vec1, vec2) {
    var dot = Vec2d.dot(vec1, vec2);
    var cos = dot / (vec1.length() * vec2.length());
    if (cos <= -1) return Math.PI;
    else if (cos >= 1) return 0;
    return Math.acos(cos);
};
Vec2d.prototype = {
    add : function (vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    },
    subtract : function (vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    },
    multiply : function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    },
    divide : function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    },
    length : function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    },
    normalize : function () {
        var l = this.length();
        this.x /= l;
        this.y /= l;
        return this;
    },
    limit : function (maxLength) {
        var l = this.length();
        if (l > maxLength) {
            this.normalize();
            this.multiply(maxLength);
        }
        return this;
    },
    heading : function() {
        return Math.atan2(this.y, this.x);
    },
    acceptDebugDraw : function (dd, origin) {
        dd.visitVec2(this, origin);
    },
    clone : function() {
        return new Vec2d(this.x, this.y);
    },
    toSegment : function (origin) {
        return new Segment(origin, Vec2d.add(origin, this))
    }
};
