Floor = ( function() {

	function Floor( data )
	{
		THREE.Object3D.call( this );

		this.data = data;

		var heightMap = $( "#heightmap" );
		this.heightMapW = heightMap.width();
		this.heightMapH = heightMap.height();
		var dataHeightMap = this.getHeightMapData( heightMap );
		var geometry = this.createGeometryHeightMap( dataHeightMap, this.heightMapW, this.heightMapH );
		geometry.computeFaceNormals() ;
		var materials = [ new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } )
						, new THREE.MeshLambertMaterial( { color: 0x071846, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, wireframe: true, transparent: true, opacity: .25 } ) ];
		this.mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );//new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } ) );//new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } ) );
		this.mesh.receiveShadows = true;
		this.add( this.mesh );

		this.position.x = this.data.w * .5 + this.data.x;
		this.position.z = this.data.h * .5 + this.data.y;
		this.rotation.x = -Math.PI * 0.5;

		U3D.vHeighMapSize = new THREE.Vector2( this.heightMapW, this.heightMapH );
		U3D.vZoneTranslate = new THREE.Vector2( -this.data.x * .1 >> 0, -this.data.y * .1 >> 0 )
		Globals.dataHeightMap = dataHeightMap;
	}
	Floor.prototype = new THREE.Object3D();
	Floor.prototype.constructor = Floor;

	Floor.prototype.getHeightMapData = function getHeightMapData( heightMap )
	{
		var canvas = document.createElement( "canvas" );
		canvas.width = this.heightMapW;
		canvas.height = this.heightMapH;
		var context = canvas.getContext( "2d" );
		context.drawImage( heightMap[ 0 ], 0, 0 );

		var data = [];
		var dataImg = context.getImageData( 0, 0, this.heightMapW, this.heightMapH );
		dataImg = dataImg.data;

		var i = 0, j = 0, n = dataImg.length;
		for( ; i < n; i+=4 )
			data[ j++ ] = dataImg[ i ] * .1;

		return data;
	}

	Floor.prototype.createGeometryHeightMap = function createGeometryHeightMap( data )
	{
		var geometry = new THREE.PlaneGeometry( this.data.w, this.data.h, this.heightMapW - 1, this.heightMapH - 1 );
		var vertices = geometry.vertices;
		for( var i = 0; i < vertices.length; i++ )
			vertices[ i ].z = data[ i ] + Math.random() * 3 - 1.5;
		
		return geometry;
	}

	return Floor;

})();