var CatTail = function (canvas, subdivisions) {
  var halfCanvasWidth = canvas.width * 0.5;
  var halfCanvasHeight = canvas.height * 0.5;
  this.ctx = canvas.getContext("2d");
  this.state = 0;
  this.canvas = canvas;
  var basePoints = [
    new DynamicPoint(halfCanvasWidth + 5, halfCanvasHeight + 6),
    new DynamicPoint(halfCanvasWidth - 20, halfCanvasHeight + 43),
    new DynamicPoint(halfCanvasWidth + 12, halfCanvasHeight + 60),
    new DynamicPoint(halfCanvasWidth + 65, halfCanvasHeight + 40)
  ];
  var points = [
    new DynamicPoint(halfCanvasWidth + 10, halfCanvasHeight + 6),
    new DynamicPoint(halfCanvasWidth, halfCanvasHeight),
    new DynamicPoint(halfCanvasWidth + 50, halfCanvasHeight),
    new DynamicPoint(halfCanvasWidth + 150, halfCanvasHeight - 100)
  ];

  this.update = function () {
    var localMouseX = mouseX - $(canvas).offset().left;
    var localMouseY = mouseY - $(canvas).offset().top;
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var bp = basePoints[i];
      var x, y;
      if (Math.sqrt((localMouseX - bp.x ) * (localMouseX - bp.x ) + (localMouseY - bp.y ) * ( localMouseY - bp.y )) < 50) {
        x = localMouseX;
        y = localMouseY;
      }
      else {
        pBase = basePoints[i];
        x = pBase.x;
        y = pBase.y;
      }
      var rigidity = 0.1;
      var friction = (i / (points.length - 1)) * 0.95;
      var ax = (x - p.x) * rigidity;
      var ay = (y - p.y) * rigidity;
      p.vx = (p.vx + ax) * friction;
      p.vy = (p.vy + ay) * friction;
      p.x += p.vx;
      p.y += p.vy;
    }

    this.draw();
  };

  this.draw = function () {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.save();
    this.ctx.lineCap="round";
    this.ctx.lineWidth = 9;
    var p0 = points[0];
    var p1 = points[1];
    var p2 = points[2];
    var p3 = points[3];
    var gradient = this.ctx.createLinearGradient(p0.x,p0.y,p3.x,p3.y);
    gradient.addColorStop(0.7,"f25151");
    gradient.addColorStop(1,"ffd091");
    this.ctx.strokeStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(p0.x,p0.y);
    this.ctx.bezierCurveTo(p1.x,p1.y,p2.x,p2.y, p3.x, p3.y);
    this.ctx.stroke();
    this.ctx.restore();
  };

  this.close = function(){
    this.state = 1;
    for (var i = basePoints.length - 1; i >= 0; i--) {
      basePoints[i].x = halfCanvasWidth;
      basePoints[i].y = halfCanvasHeight;
    };
    TweenLite.to(this.canvas,.5,{css:{opacity:0}});
  }

  this.open = function(){
    this.state = 0;
    basePoints = [
      new DynamicPoint(halfCanvasWidth + 5, halfCanvasHeight + 6),
      new DynamicPoint(halfCanvasWidth - 20, halfCanvasHeight + 43),
      new DynamicPoint(halfCanvasWidth + 12, halfCanvasHeight + 60),
      new DynamicPoint(halfCanvasWidth + 65, halfCanvasHeight + 40)
    ];
    TweenLite.to(this.canvas,.3,{css:{opacity:1}});
  }
};


CatTail.prototype.constructor = CatTail;

var DynamicPoint = function (x, y) {
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.clone = function () {
    return new DynamicPoint(this.x, this.y);
  };
};
DynamicPoint.prototype.constructor = DynamicPoint;