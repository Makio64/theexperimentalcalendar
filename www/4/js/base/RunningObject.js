/*
**	Author: Guillaume Gouessan - guillaumegouessan.com
*/

var RunningObject = (function() {

	/*---------------------------------------------------
	Constructor
	---------------------------------------------------*/
	function RunningObject() {
		THREE.Object3D.call(this);
		this.spawnZone = new THREE.Rectangle();
		this.spawnZone.set(-10,-15,10, 0);
		this.noSpawnZone = new THREE.Vector2( -0.25, 0.25 );
		this.respawnValue = this.respawnValue || this.spawnZone.getBottom();
		this.resetPosition(true);
	}

	RunningObject.prototype = new THREE.Object3D();
	RunningObject.prototype.constructor = RunningObject;

	/*---------------------------------------------------
	Positioning
	---------------------------------------------------*/
	RunningObject.prototype.resetXPosition = function() {
		this.position.x = 0;
		while(this.position.x < this.noSpawnZone.y && this.position.x > this.noSpawnZone.x){
			this.position.x = Math.random() * (this.spawnZone.getRight() - this.spawnZone.getLeft()) + this.spawnZone.getLeft();
		}
	};

	RunningObject.prototype.resetZPosition = function(spawn) {
		if(spawn) {
			this.position.z = Math.random() * (this.spawnZone.getBottom() - this.spawnZone.getTop()) + this.spawnZone.getTop();
		}
		else{
			this.position.z = this.respawnValue;
		}
	};

	RunningObject.prototype.resetPosition = function(spawn) {
		this.resetZPosition(spawn);
		this.resetXPosition();
	}

	/*---------------------------------------------------
	Animation
	---------------------------------------------------*/
	RunningObject.prototype.update = function(speed) {
		this.position.z = this.position.z + speed;
		if(this.position.z < this.spawnZone.getTop()){
			this.resetPosition(false);
		}
	}


	return RunningObject;

})();
