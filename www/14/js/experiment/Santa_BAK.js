var Santa = function(x, y, context)
{
    this.x = x;
    this.y = y;
    this.size = 50;
    this.context = context;
    this.context.fillStyle ='red';

    this.images = [
        "s1.png",
        "s2.png",
        "c1.png",
        "c2.png"
    ];

    this.current = 0;
    this.image = new Image();
    this.image.src = this.images[this.current];


    this.theta = Math.PI * Math.random();
    this.thetaDirection = 1;
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
        this.theta += 0.53;// * this.thetaDirection;
        /*if(this.theta > Math.PI || this.theta < 0)
        {
            this.thetaDirection *= -1;
        }*/

        y += Math.sin(this.theta) * 30 - 50;
        this.x += (x - this.x) * 0.1 - 20;
        this.y += (y - this.y) * 0.1;

        this.draw();
    },

    draw: function()
    {
        this.context.save();
        this.context.translate(this.x, this.y);
        //this.context.fillStyle = 'white';
        //this.context.fillRect(0, 0, this.size, this.size);
        this.context.drawImage(this.image, 0, 0);
        this.context.restore();
    }
};