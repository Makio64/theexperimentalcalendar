/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'bold';
		element.style.textAlign = 'center';
		element.style.background = '#f00';
		element.style.color = '#0f0';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		// if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'This experiment uses sound and WebGL only available on Chrome for now.<br />',
				'You can get it <a href="http://google.com/chrome" style="color:#00f">here</a>.'
			].join( '\n' ) : [
				'This experiment uses sound and WebGL only available on Chrome for now.<br />',
				'You can get it <a href="http://google.com/chrome" style="color:#00f">here</a>.'
			].join( '\n' );

		// }

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};
