// DAT RANDOM TREE GENERATOR !!1
var Tree = function(x, y, width, height, color, context)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.context = context;
    //this.context.globalCompositeOperation = fw.randValueFromArray(["lighter", "darker"]);
    this.context.globalCompositeOperation = "darker";
    this.color = color;
    this.context.strokeWidth = 10;
    this.floors = ~~(fw.rand(9, 25));
    this.init();
};

Tree.prototype = {
    init: function()
    {
        this.step = this.floors;
        this.grow(this.x, this.y, this.width, this.height/this.floors);
    },

    //slowly draw all the tree floors
    grow: function(x, y, width, height)
    {
        var self = this, w = width;
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.draw(x, y, width, height);
        this.context.fill();
        y -= height * 0.5;
        height *= 0.9;
        width *= 0.8;
        x += (w - width)/2;
        w = width;

        if(this.step > 0)
        {
            this.step--;
            setTimeout(function()
            {
                self.grow(x, y, width, height);
            }, 50);
        }
        else
        {
            this.update(x, y, width, height);
        }
    },

    //draw all the tree floors in a row
    update: function(x, y, width, height)
    {
        x = this.x, y = this.y, w = width = this.width, height = this.height/this.floors;
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.strokeStyle = "rgba(0, 0, 0, 0)";//color;
        for(var i = 0; i < this.floors; i++)
        {
            this.draw(x, y, width, height);
            y -= height * 0.5;
            height *= 0.9;
            width *= 0.8;
            x += (w - width)/2;
            w = width;
        }
        this.context.fill();
        //this.context.stroke();
    },

    draw: function(x, y, width, height)
    {
        this.context.save();
        this.context.moveTo(x, y);
        this.context.lineTo(x + width, y);
        this.context.lineTo(x + (width>>1), y - height);
        this.context.restore();
    }
};