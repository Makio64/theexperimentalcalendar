/*
**	Author: Guillaume Gouessan - guillaumegouessan.com
*/

var Rock = (function() {

	/*---------------------------------------------------
	Constructor
	---------------------------------------------------*/
	function Rock(color, respawnValue) {
		this.respawnValue = respawnValue;
		RunningObject.call(this);

		this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1, Math.random() * 6, Math.random() * 6), new THREE.MeshBasicMaterial({color: color}));
		this.add(this.mesh);

		this.rotation.x = Math.random() * Math.PI * 2;
		this.rotation.y = Math.random() * Math.PI * 2;
		this.rotation.z = Math.random() * Math.PI * 2;
		this.scale.x = this.scale.y = this.scale.z = Math.random();
	}

	Rock.prototype = new RunningObject();
	Rock.prototype.constructor = Rock;

	return Rock;

})();
