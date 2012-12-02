(function(jQuery) {
	jQuery.fn.konami = function(opts) {
		var enteredKeys = [];

		var textualKeyMap = {
			'left': 37,
			'up': 38,
			'right': 39,
			'down': 40,
			'a': 65,
			'b': 66
		};

		var options = jQuery.extend({
			code: ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'],
			callback: function() {}
		}, opts);

		var codes = options.code;

		var solutionCodes = [];
		$.each(codes, function(i, item) {
			if(codes[i] !== undefined && textualKeyMap[codes[i]] !== undefined) {
				solutionCodes.push(textualKeyMap[codes[i]]);
			} else if(codes[i] !== undefined && typeof(codes[i]) == 'number') {
				// This is in case one wants to pass direct keycodes instead of textual keycodes.
				solutionCodes.push(codes[i]);
			}
		});

		$(document).keyup(function(e) {
			var keyCode = e.keyCode ? e.keyCode : e.charCode;
			enteredKeys.push(keyCode);

			if(enteredKeys.toString().indexOf(solutionCodes) >= 0) {
				enteredKeys = [];
				options.callback($(this));
			}
		});
	}
})(jQuery);



jQuery(document).ready(function($) {
	initUI();
	initChristmasGift();
});


function initUI() {
	//share option
	$("#facebook a").click(function(e) {
		e.preventDefault();
		window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(location.href) + '&t=' + encodeURIComponent(document.title), 'Share us on facebook', 'toolbar=0,status=0,width=548,height=325');
		return false;
	});
	$("#twitter a").click(function(e) {
		e.preventDefault();
		window.open('http://twitter.com/home?status=' + encodeURIComponent('The experimental calendar ! ') + encodeURIComponent(location.href), 'Share us on facebook', 'toolbar=0,status=0,width=548,height=325');

		return false;
	});
	$("#google a").click(function(e) {
		e.preventDefault();
		window.open('https://plus.google.com/share?url=' + encodeURIComponent(location.href) + '&title=' + encodeURIComponent(document.title), 'Share us on facebook', 'toolbar=0,status=0,width=548,height=325');
		return false;
	});
};


function christmasIsBeautiful() {
	/******************************************
	 * Snow Effect Script- By Altan d.o.o. (http://www.altan.hr/snow/index.html)
	 * Visit Dynamic Drive DHTML code library (http://www.dynamicdrive.com/) for full source code
	 * Last updated Nov 9th, 05' by DD. This notice must stay intact for use
	 ******************************************/

	//Configure below to change URL path to the snow image
	var snowsrc = "snow.gif"
	// Configure below to change number of snow to render
	var no = 10;
	// Configure whether snow should disappear after x seconds (0=never):
	var hidesnowtime = 0;
	// Configure how much snow should drop down before fading ("windowheight" or "pageheight")
	var snowdistance = "pageheight";

	///////////Stop Config//////////////////////////////////
	var ie4up = (document.all) ? 1 : 0;
	var ns6up = (document.getElementById && !document.all) ? 1 : 0;

	function iecompattest() {
		return(document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body
	}

	var dx, xp, yp; // coordinate and position variables
	var am, stx, sty; // amplitude and step variables
	var i, doc_width = 800,
		doc_height = 600;

	if(ns6up) {
		doc_width = self.innerWidth;
		doc_height = self.innerHeight;
	} else if(ie4up) {
		doc_width = iecompattest().clientWidth;
		doc_height = iecompattest().clientHeight;
	}

	dx = new Array();
	xp = new Array();
	yp = new Array();
	am = new Array();
	stx = new Array();
	sty = new Array();
	snowsrc = (snowsrc.indexOf("dynamicdrive.com") != -1) ? "snow.gif" : snowsrc
	for(i = 0; i < no; ++i) {
		dx[i] = 0; // set coordinate variables
		xp[i] = Math.random() * (doc_width - 50); // set position variables
		yp[i] = Math.random() * doc_height;
		am[i] = Math.random() * 20; // set amplitude variables
		stx[i] = 0.02 + Math.random() / 10; // set step variables
		sty[i] = 0.7 + Math.random(); // set step variables
		if(ie4up || ns6up) {
			if(i == 0) {
				document.write("<div id=\"dot" + i + "\" style=\"POSITION: absolute; Z-INDEX: " + i + "; VISIBILITY: visible; TOP: 15px; LEFT: 15px;\"><a href=\"http://dynamicdrive.com\"><img src='" + snowsrc + "' border=\"0\"><\/a><\/div>");
			} else {
				document.write("<div id=\"dot" + i + "\" style=\"POSITION: absolute; Z-INDEX: " + i + "; VISIBILITY: visible; TOP: 15px; LEFT: 15px;\"><img src='" + snowsrc + "' border=\"0\"><\/div>");
			}
		}
	}

	function snowIE_NS6() { // IE and NS6 main animation function
		doc_width = ns6up ? window.innerWidth - 10 : iecompattest().clientWidth - 10;
		doc_height = (window.innerHeight && snowdistance == "windowheight") ? window.innerHeight : (ie4up && snowdistance == "windowheight") ? iecompattest().clientHeight : (ie4up && !window.opera && snowdistance == "pageheight") ? iecompattest().scrollHeight : iecompattest().offsetHeight;
		for(i = 0; i < no; ++i) { // iterate for every dot
			yp[i] += sty[i];
			if(yp[i] > doc_height - 50) {
				xp[i] = Math.random() * (doc_width - am[i] - 30);
				yp[i] = 0;
				stx[i] = 0.02 + Math.random() / 10;
				sty[i] = 0.7 + Math.random();
			}
			dx[i] += stx[i];
			document.getElementById("dot" + i).style.top = yp[i] + "px";
			document.getElementById("dot" + i).style.left = xp[i] + am[i] * Math.sin(dx[i]) + "px";
		}
		snowtimer = setTimeout("snowIE_NS6()", 10);
	}

	function hidesnow() {
		if(window.snowtimer) clearTimeout(snowtimer)
		for(i = 0; i < no; i++) document.getElementById("dot" + i).style.visibility = "hidden"
	}


	if(ie4up || ns6up) {
		snowIE_NS6();
		if(hidesnowtime > 0) setTimeout("hidesnow()", hidesnowtime * 1000)
	}
};

function initChristmasGift() {
	$(document).konami({
		callback: function() {
			christmasIsBeautiful();
		}
	});
};