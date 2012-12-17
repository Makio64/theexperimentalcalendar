Star = ( function Star() {

	function Star()
	{
		THREE.Object3D.call( this );

		var materials = [ new THREE.MeshLambertMaterial( { color: 0xffbebf, shading: THREE.FlatShading, vertexColors: THREE.VertexColors  } )
						, new THREE.MeshLambertMaterial( { color: 0x071846, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, wireframe: true, transparent: true, opacity: .4 } ) ];
		this.mesh = THREE.SceneUtils.createMultiMaterialObject( Globals.objs.star.children[ 0 ].geometry, materials );//new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } ) );
		this.mesh.rotation.x = -1.3;
		this.mesh.scale.x =
		this.mesh.scale.y =
		this.mesh.scale.z = .7;
		this.add( this.mesh );

		this.vRot = 0;

		this.rotation.y = Math.PI;

		this.light = new THREE.PointLight( 0xe31214, .5, 40 );
		this.add( this.light );
	}
	Star.prototype = new THREE.Object3D();
	Star.prototype.constructor = new THREE.Object3D();

	Star.prototype.render = function render( p, py )
	{
		if( this.mesh == null )
			return;

		//this.vRot += 0.05;

		var dx = p.x - this.position.x;
		var dy = p.y - this.position.z ;
		var rad = Math.atan2( dy, dx );

		var nry = -rad + Math.PI * .5;
		this.rotation.y += ( nry - this.rotation.y ) * .08;
		this.mesh.rotation.z = this.rotation.z * .2;
		this.mesh.rotation.y = this.rotation.y;// Math.sin( this.vRot ) * .1;
		//this.mesh.rotation.z += ( nry - this.mesh.rotation.z ) * .1;		
		//console.log( this.rotation.y );
		
		this.position.x = p.x;
		this.position.z = p.y;
		py = py || this.position.y + ( ( U3D.getY( this.position ) + 7 ) - this.position.y ) * .1;
		this.position.y = py;
	}

	return Star;

} )();