Sapin = ( function Sapin() {

	function Sapin( objData, data )
	{	
		THREE.Object3D.call( this );

		var s = data.r * .1;
		//this.mesh = objData.clone();
		var materials = [ new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } )
						, new THREE.MeshLambertMaterial( { color: 0x071846, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, wireframe: true, transparent: true, opacity: .25 } ) ];
		this.mesh = THREE.SceneUtils.createMultiMaterialObject( objData.clone().geometry, materials );
		this.mesh.material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
		this.position.x = data.x;
		this.position.z = data.y;
		if( data.c != "#FF00FF")
		{
			this.scale.x = s;
			this.scale.y = s;
			this.scale.z = s;
		}
		else
		{
			Globals.sapinBig = this;
		}
		this.add( this.mesh );

		//var idx = ( this.position.x + this.position.z ) * .1 >> 0;
		//console.log( idx );
		this.position.y = U3D.getY( this.position );
	}
	Sapin.prototype = new THREE.Object3D();
	Sapin.prototype.construtor = Sapin;

	return Sapin;

})();