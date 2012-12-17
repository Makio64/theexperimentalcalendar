Line = ( function Line() {

	function Line( path )
	{
		THREE.Object3D.call( this );

		this.geometry = new THREE.Geometry();
		this.material = new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 1, linewidth: 3, morphTargets: true } );
	}
	Line.prototype = new THREE.Object3D();
	Line.prototype.constructor = Line;

	Line.prototype.render = function render( p )
	{
		this.addVertice( new THREE.Vector3( p.x, 0, p.y ) );
	}

	Line.prototype.addVertice = function addVertice( v )
	{
		if( this.geometry.vertices.length == 0 )
		{
			this.geometry.vertices.push( v );
			return;
		}

		var geometry = new THREE.Geometry();
		geometry.vertices.push( this.geometry.vertices[ this.geometry.vertices.length - 1 ], v );
		var line = new THREE.Line( geometry, this.material );
		//this.add( line );

		this.geometry.vertices.push( v );
	}

	return Line;

})();