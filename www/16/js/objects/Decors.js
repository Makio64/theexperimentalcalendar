Decors = ( function Decors(){

	function Decors( data )
	{
		THREE.Object3D.call( this );

		var map = {};
		map[ "#FF0000" ] = "saps1";
		map[ "#0000FF" ] = "saps2";
		map[ "#FFFF00" ] = "saps3";
		map[ "#00FF00" ] = "sapb";
		map[ "#FF00FF" ] = "sapbig";

		var sapin
		  , n = data.length;
		for( var i = 0; i < n; i++ )
		{
			sapin = new Sapin( Globals.objs[ map[ data[ i ].c ] ].children[ 0 ], data[ i ] );
			this.add( sapin );
		}
	}
	Decors.prototype = new THREE.Object3D();
	Decors.prototype.constructor = Decors;

	return Decors;
	
})();