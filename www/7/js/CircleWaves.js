var CircleWaves = function() {
  this.canvasWidth = 180;
  this.canvasHeight = 155;
  this.segments = 200;
  this.points = 5;
  this.width = 130;
  this.height = 110;
  this.activated = false;
  this.wave = false;
  this.t = 0;

  this.canvas = document.createElement('canvas');
  $(this.canvas).addClass('circleWaves');
  this.canvas.width = this.canvasWidth;
  this.canvas.height = this.canvasHeight;

  this.ctx = this.canvas.getContext("2d");

  $("#catSleep").append(this.canvas);

  this.redraw = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    
    var localMouseX, localMouseY;
    if(this.wave == true){
      this.t -= PI2/50;
      localMouseX = Math.cos(this.t)*80+this.canvas.width/2;
      localMouseY = Math.sin(this.t)*80+this.canvas.height/2;
      if(this.t<=-HalfPI){
        this.wave = false;
        this.activated = false;
      }
    } else {
      localMouseX = mouseX - $(this.canvas).offset().left;
      localMouseY = mouseY - $(this.canvas).offset().top;
    }

    var x, y, i, dist,
    angle = 0;
    var angleStep = PI2 / this.segments;
    var maxRatio = 0;
    for(i = 0; i < this.segments; i++) {
      angle += angleStep;
      cos = Math.cos(angle);
      sin = Math.sin(angle);
      x = cos * this.width * 0.5 + this.canvasWidth * 0.5;
      y = sin * this.height * 0.5 + this.canvasHeight * 0.5;
      
      if(!this.activated)
         dist = Math.sqrt((localMouseX - x ) * (localMouseX - x ) + (localMouseY - y ) * ( localMouseY - y ));
      if(this.activated || dist < 40) {
        var ratio = this.activated?1:(1 - dist / 40);
        x += cos * Math.random() * 20 * ratio;
        y += sin * Math.random() * 20 * ratio;
        if(this.activated)maxRatio = 1;
        else if(maxRatio < ratio) maxRatio = ratio;
      }
      this.ctx.lineTo(x, y);
    }
    if(this.activated){
      if(this.wave){
        var grd=this.ctx.createLinearGradient(this.canvasWidth * 0.5,this.canvasHeight * 0.5, localMouseX,localMouseY);
        grd.addColorStop(0,"rgba(242, 81, 81, 0)");
        grd.addColorStop(1,"rgba(242, 81, 81, "+maxRatio+")");
      } else {
        this.ctx.fillStyle="f88d6f";
      }
      
      this.ctx.fillStyle=grd;
    } else {
      var grd=this.ctx.createLinearGradient(this.canvasWidth * 0.5,this.canvasHeight * 0.5, localMouseX,localMouseY);
      grd.addColorStop(0.5,"rgba(242, 81, 81, 0)");
      // grd.addColorStop(0,"green");
      grd.addColorStop(1,"rgba(242, 81, 81, "+maxRatio+")");
      this.ctx.fillStyle=grd;
    }
    this.ctx.fill();
    this.ctx.closePath();
  };

  this.activate = function(){
      this.activated = true;
      $("#catSleep").css("zIndex", 19);
    // fxs[1].activate();
  }

  this.madeWave = function(){
    this.activated = true;
    this.wave = true;
    this.t = PI2*.8;
  }

  this.redraw();
};


CircleWaves.prototype.constructor = CircleWaves;