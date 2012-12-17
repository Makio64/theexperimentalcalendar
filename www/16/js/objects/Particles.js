Particles = ( function Particles() {
	
	function Particles()
	{
		geometry = new THREE.Geometry();
		for ( i = 0; i < 2000; i ++ ) {

			var vertex = new THREE.Vector3();
			vertex.x = Math.random() * 1300 - 650;
			vertex.y = Math.random() * 1000;
			vertex.z = Math.random() * 900 - 450;

			geometry.vertices.push( vertex );

			var particles = new THREE.ParticleSystem( geometry, new THREE.ParticleBasicMaterial( { color: 0xffffff, size: 10 } ) );
			this.add( particles );
		}
	}
	Particles.prototype = new THREE.Object3D();
	Particles.prototype.constructor = Particles;

	Particles.prototype.render = function render()
	{
		var n = this.children.length;
		for( var i = 0; i < n; i++ )
		{
			this.children[ i ].position.y -= 5;
		}
	}

	return Particles;

})();