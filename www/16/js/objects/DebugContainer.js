DebugContainer = ( function DebugContainer() {

	function DebugContainer( color )
	{
		THREE.Object3D.call( this );

		this.add( new THREE.Mesh( new THREE.SphereGeometry( 3 ), new THREE.MeshBasicMaterial( { color: color, wireframe: true, transparent: true } ) ) );
	}
	DebugContainer.prototype = new THREE.Object3D();
	DebugContainer.prototype.constructor = DebugContainer;

	return DebugContainer;

})();