CameraTarget = ( function CameraTarget() {

	function CameraTarget( target )
	{
		THREE.Object3D.call( this );

		this.target = target;
		this.position.copy( this.target.position );
		console.log( this.position, this.target.position );
		this.rotation.copy( this.target.rotation );

		this.baseRX = 0;
		this.baseRY = 0;

		this.basePos = new THREE.Vector3();
		this.baseRot = new THREE.Vector3();
		this.finalPos;
		this.finalRot;

		this.vdry = 0;
	}
	CameraTarget.prototype = new THREE.Object3D();
	CameraTarget.prototype.constructor = CameraTarget;

	CameraTarget.prototype.render = function render( py, percent )
	{
		if( percent == null )
		{
			var dx = this.target.position.x - this.position.x;
			var dz = this.target.position.z - this.position.z;

			this.position.x += dx * .1;
			this.position.z += dz * .1;

			this.vdry = ( this.vdry + ( this.rotation.y - this.target.rotation.y ) * .9 ) * .1;
			this.rotation.y -= this.vdry;

			this.baseRot.x = this.rotation.x;
			this.baseRot.y = this.rotation.y;
			this.baseRot.z = this.rotation.z;
			this.basePos.x = this.position.x;
			this.basePos.y = this.position.y;
			this.basePos.z = this.position.z;
		}
		else
		{
			// yes it's ugly, but c'mon, it's 6am
			if( this.finalPos == null )
			{
				this.finalPos = new THREE.Vector3( 620.5 - this.position.x, 0, -292 - this.position.z );
				this.finalRot = new THREE.Vector3( -0.25 - this.baseRX, Math.PI - this.baseRY );
			}
			this.position.x = this.basePos.x + this.finalPos.x * percent;
			this.position.z = this.basePos.z + this.finalPos.z * percent;
			this.rotation.x = this.baseRot.x + this.finalRot.x * percent;
			this.rotation.y = this.baseRot.y + this.finalRot.y * percent;
			/*
			this.position.x = 620.5 * percent;
			//this.position.y = 421.2 * percent;
			this.position.z = -292 * percent;
			this.rotation.x = this.baseRX + percent * ( -0.25 - this.baseRX );
			this.rotation.y = this.baseRY + percent * ( Math.PI - this.baseRY );
			*/
		}


		if( py != null )
		{
			var dy = py - this.position.y;
			this.position.y += dy * .1;
		}
	}

	return CameraTarget;

})();