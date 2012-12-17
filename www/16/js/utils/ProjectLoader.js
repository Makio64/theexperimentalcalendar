ProjectLoader = ( function ProjectLoader() {
	
	function ProjectLoader()
	{
		this.loadedCount = 0;
		this.loaders = [];

		this.signalLoaded = new signals.Signal();

		var loader;
		var files = Globals.filesToLoad;
		var n = files.length;
		for( var i = 0; i < n; i++ )
		{
			loader = new ObjLoader( files[ i ] );
			loader.signalLoaded.addOnce( this.onLoad, this );
			this.loaders[ i ] = loader;
		}

		this.execute();
	}
	ProjectLoader.prototype.constructor = ProjectLoader;

	ProjectLoader.prototype.execute = function execute()
	{
		if( this.loaders.length > 0 )
		{
			this.currentLoader = this.loaders.shift();
			this.currentLoader.load();
		}
		else
		{
			this.signalLoaded.dispatch();
		}
	}

	ProjectLoader.prototype.onLoad = function onLoad( obj )
	{
		var mesh = obj.children[ 0 ]
		  , geometry = mesh.geometry
		  , i, n;
		if( this.currentLoader.id == "saps1" || this.currentLoader.id == "saps2" )
		{
			U3D.scale( .08, geometry );
		}
		else if ( this.currentLoader.id == "sapb" )
		{
			var o3d = new THREE.Object3D();
			var geo = geometry.clone();
			U3D.scale( 0.1, geo );
			o3d.add( new THREE.Mesh( geo, mesh.material ) );
			Globals.objs[ "sapbig" ] = o3d;

			U3D.scale( .01, geometry );
		}
		else if ( this.currentLoader.id == "saps3" )
		{
			var v = new THREE.Vector3( 0, mesh.boundRadius, 0 );

			n = geometry.vertices.length;
			for( var i = 0; i < n; i++ ) 
				geometry.vertices[ i ].addSelf( v );
		}
		Globals.objs[ this.currentLoader.id ] = obj;

		this.execute();
	}

	return ProjectLoader;

})();