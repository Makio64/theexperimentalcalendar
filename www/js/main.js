jQuery(document).ready(function($) {
	initUI();
});


function initUI(){
	//share option
	$("#facebook a").click(function(e){
		e.preventDefault();
		window.open('http://www.facebook.com/sharer.php?u=theexperimentalcalendar.com&t=TheExperimentalCalendar',
					'Share us on facebook',
					'toolbar=0,status=0,width=548,height=325');
		return false;
	});
	$("#twitter a").click(function(e){
		e.preventDefault();
		window.open('https://twitter.com/share?url=theexperimentalcalendar.com',
					'Share us on facebook',
					'toolbar=0,status=0,width=548,height=325');
		
		return false;
	});
	$("#google a").click(function(e){
		e.preventDefault();
		//fuck that shit api >.<
		return false;
	});
}