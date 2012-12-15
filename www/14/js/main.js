var canvas, context,
	screenWidth, screenHeight;

window.onload = function()
{
    var resize = function()
    {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        canvas.width = screenWidth;
        canvas.height = screenHeight;
    };

	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

    window.addEventListener('resize', resize, false);

    resize();

	var playground = new Playground(canvas);
};