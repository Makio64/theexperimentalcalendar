if (!window.cancelRequestAnimationFrame)
{
	window.cancelRequestAnimationFrame = (function ()
	{
		return window.cancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout();
	})();
}

if (!window.requestAnimationFrame)
{
	window.requestAnimationFrame = (function ()
	{
		return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback)
			{
				return window.setTimeout(callback, 1000 / 60);
			};
	})();
}

function getVectorProjection(x1, y1, x2, y2, x3, y3)
{
	var px = x2 - x1,
		py = y2 - y1,
		dAB = px * px + py * py;
	var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
	var x = x1 + u * px, y = y1 + u * py;

	return {x: x, y: y};
}

function segmentIntersection(p1, p2, p3, p4)
{
	var nx, ny, dn;
	var x4_x3 = p4.x - p3.x;
	var y4_y3 = p4.y - p3.y;
	var x2_x1 = p2.x - p1.x;
	var y2_y1 = p2.y - p1.y;
	var x1_x3 = p1.x - p3.x;
	var y1_y3 = p1.y - p3.y;

	nx = x4_x3 * y1_y3 - y4_y3 * x1_x3;
	ny = x2_x1 * y1_y3 - y2_y1 * x1_x3;
	dn = y4_y3 * x2_x1 - x4_x3 * y2_y1;
	if(!dn) return null;

	var dninv = 1 / dn;
	nx *= dninv;
	ny *= dninv;

	// has intersection
	if(nx>= 0 && nx <= 1 && ny>= 0 && ny <= 1){
		ny = p1.y + nx * y2_y1;
		nx = p1.x + nx * x2_x1;
		return {x: nx, y: ny};
	} else
	{
		// no intersection
		return null;
	}
}

function randomize ( myArray )
{
	var i = myArray.length;
	if ( i == 0 ) return false;
	while ( --i )
	{
		var j = Math.random() * ( i + 1 ) | 0;
		var tempi = myArray[i];
		var tempj = myArray[j];
		myArray[i] = tempj;
		myArray[j] = tempi;
	}
}