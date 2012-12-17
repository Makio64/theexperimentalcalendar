U3D = 
{
	scale: function scale( s, geo )
	{

		var vert = geo.vertices
		  , i = 0
		  , n = vert.length;
		for( ; i < n; i++ )
		{
			vert[ i ].multiplyScalar( s );
		}
	},

	vHeighMapSize: null,
	vZoneTranslate: null,

	getY: function getY( v )
	{
		var newV = new THREE.Vector2( Math.round( v.x * .1 ), Math.round( v.z * .1 ) );
		newV.addSelf( U3D.vZoneTranslate );
		var y = Globals.dataHeightMap[ newV.x + newV.y * U3D.vHeighMapSize.x >> 0 ];
		return y || 0;
	},

	createPath: function createPath( path, dataPath, objectToInit, specialEnd )
	{
		var n = dataPath.length;
		for( var i = 0; i < n; i++ )
		{
			if( dataPath[ i ].cmd == "M" )
			{
				path.moveTo( dataPath[ i ].p.x, dataPath[ i ].p.y );
				if( objectToInit != null )
				{
					objectToInit.position.x = dataPath[ i ].p.x;
					objectToInit.position.z = dataPath[ i ].p.y;
					objectToInit.position.y = U3D.getY( objectToInit.position );
				}
			}
			else
			{
				// petit tweak parce que trop chiant le callage de fin pour le gros sapin sinon
				if( i == n - 1 )
					dataPath[ i ].p.x = specialEnd || dataPath[ i ].p.x;

				path.bezierCurveTo( dataPath[ i ].cp0.x, dataPath[ i ].cp0.y, dataPath[ i ].cp1.x, dataPath[ i ].cp1.y, dataPath[ i ].p.x, dataPath[ i ].p.y );
			}
		}
	}
}