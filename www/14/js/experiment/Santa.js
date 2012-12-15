// Useful comment #345 : Santa class (claus)!
var Santa = function(x, y, context)
{
    this.x = x;
    this.y = y;
    this.width = 170;
    this.height = 154;
    this.context = context;
    this.context.fillStyle ='red';

    this.images = [
        "img/body_alt.png",
        "img/body.png"
    ];

    this.current = 0;
    this.image = new Image();
    this.image.src = this.images[this.current];

    this.armImg = new Image();
    this.armImg.src = "img/arm.png";
    this.legImg = new Image();
    this.legImg.src = "img/leg.png";

    this.thetaX = Math.PI * Math.random();
    this.theta = Math.PI * Math.random();

    this.mouseX = this.mouseY = 0;
    /*this.scarf = [];
    for(var i=0; i<100; i++)
    {
        this.scarf.push(new Kin(this.x, this.y, 3, 25, '#f20049'));
    }*/

    this.l1 = new Kin(this.x, this.y, 100, 20, 'white', this.legImg);
    this.l2 = new Kin(this.x, this.y, 100, 20, 'white', this.legImg);
    this.l1.theta = 3.5;
    this.l2.theta = 2.7;

    this.a1 = new Kin(this.x, this.y, 80, 15, 'white', this.armImg);
    this.a2 = new Kin(this.x, this.y, 80, 15, 'white', this.armImg);
    this.a1.theta = 2;
    this.a2.theta = -0.3;
};

Santa.prototype = {
    changeImage: function()
    {
        if(this.current < this.images.length - 1)
        {
            this.current++;
        }
        else
        {
            this.current = 0;
        }
        this.image.src = this.images[this.current];
    },

    update: function(x, y)
    {
        this.mouseX = x;
        this.mouseY = y;
        this.theta += 0.07;
        this.thetaX += 0.03;

        x += Math.cos(this.thetaX) * 30 - 100;
        y += Math.sin(this.theta) * 30 - 80;
        this.x += (x - this.x) * 0.1;
        this.y += (y - this.y) * 0.1;

        //scarf animation
        /*var dx, dy, w, h;
        dx = this.x - this.scarf[0].x;
        dy = this.y - this.scarf[0].y;
        this.scarf[0].theta = Math.atan2(dy, dx);
        this.scarf[0].x = this.x - (this.scarf[0].getPin().x - this.scarf[0].x) + this.width - 40;
        this.scarf[0].y = this.y - (this.scarf[0].getPin().y - this.scarf[0].y) + (this.height>>1) - 20;
        this.scarf[0].update(this.context);

        for(var i=1, l=this.scarf.length; i<l; i++)
        {
            this.scarf[i].x -= 40;
            this.scarf[i].y += 5;
            dx = this.scarf[i-1].x - this.scarf[i].x;
            dy = this.scarf[i-1].y - this.scarf[i].y;
            this.scarf[i].theta = Math.atan2(dy, dx);
            w = this.scarf[i].getPin().x - this.scarf[i].x;
            h = this.scarf[i].getPin().y - this.scarf[i].y;
            this.scarf[i].x = this.scarf[i-1].x - w;
            this.scarf[i].y = this.scarf[i-1].y - h;
            this.scarf[i].update(this.context);
        }*/

        // leg 1 animation
        this.l1.x = this.x + (this.width>>2) - 15;
        this.l1.y = this.y + (this.height>>1) + (this.height>>1) - 30;
        this.l1.theta += 0.01 * this.l1.thetaDirection;
        if(this.l1.theta < 3.4 || this.l1.theta > 3.7) this.l1.thetaDirection *= -1;
        this.l1.update(this.context);

        //arm2 animation
        this.a2.x = this.x + (this.width>>1) + (this.width>>2) + 10;
        this.a2.y = this.y + (this.height>>1) + (this.height>>1) - 55;
        this.a2.theta += 0.015 * this.a2.thetaDirection;
        if(this.a2.theta < - 0.9 || this.a2.theta > 0) this.a2.thetaDirection *= -1;
        this.a2.update(this.context);

        this.draw();

        //leg2 animation
        this.l2.x = this.x + (this.width>>2) - 5;
        this.l2.y = this.y + (this.height>>1) + (this.height>>1);
        this.l2.theta += 0.01 * this.l2.thetaDirection;
        if(this.l2.theta < 2.7 || this.l2.theta > 2.9) this.l2.thetaDirection *= -1;
        this.l2.update(this.context);

        //arm1 animation
        this.a1.x = this.x + (this.width>>1) + (this.width>>2) - 35;
        this.a1.y = this.y + (this.height>>1) + (this.height>>1) - 40;
        this.a1.theta += 0.015 * this.a1.thetaDirection;
        if(this.a1.theta < 2 || this.a1.theta > 2.5) this.a1.thetaDirection *= -1;
        this.a1.update(this.context);
    },

    draw: function()
    {
        this.context.save();
        this.context.translate(this.x, this.y);
        //this.context.fillStyle = 'yellow';
        //this.context.fillRect(0, 0, this.width, this.height);
        this.context.drawImage(this.image, 0, 0);
        this.context.restore();
    }
};