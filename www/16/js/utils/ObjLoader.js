ObjLoader = ( function() {

	function ObjLoader( data )
	{
		this.data = data;
		this.id = data.id;
		this.url = data.url;
		
		this.signalLoaded = new signals.Signal();

		this.loader = new THREE.OBJLoader();
		this.loader.addEventListener( "load", this.onLoad.bind( this ) );
	}
	ObjLoader.prototype.constructor = ObjLoader;

	ObjLoader.prototype.load = function load()
	{
		this.loader.load( this.url );
	}

	ObjLoader.prototype.onLoad = function onLoad( event )
	{
		console.log( "loading terminé !" );
		this.signalLoaded.dispatch( event.content );
	}

	return ObjLoader;

} )();