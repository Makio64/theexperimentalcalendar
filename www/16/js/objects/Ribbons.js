Ribbons = ( function Ribbons() {

	function Ribbons( target )
	{
		THREE.Object3D.call( this );

		this.target = target;

		this.ribbons = [];
		var data = [ { x: 0, y: 0, z: 0, color: 0xe31214, opacity: .4, radius: 1 }
				   , { x: 0, y: 0, z: -2, color: 0xe31214, opacity: .8, radius: .8 }
				   , { x: .2, y: -.2, z: 0, color: 0xe31214, opacity: .8, radius: 1.1 }
				   , { x: -.5, y: -.2, z: 0, color: 0xe4206c, opacity: .7, radius: .6 }
				   , { x: .5, y: -.1, z: 2, color: 0xe31214, opacity: .5, radius: 1 }
				   , { x: .2, y: -.5, z: -1, color: 0xe4206c, opacity: .6, radius: .9 } ];
		var ribbon;
		var n = data.length;
		for( var i = 0; i < n; i++ )
		{
			ribbon = new Ribbon( data[ i ] );
			this.ribbons[ i ] = ribbon;
			this.add( ribbon );
		}
	}

	Ribbons.prototype = new THREE.Object3D();
	Ribbons.prototype.constructor = Ribbons;

	Ribbons.prototype.render = function render( p )
	{
		this.position.y = this.target.position.y;

		var v = Math.sin( this.vFlow ) * 0.1;
		var n = this.ribbons.length;
		for( var i = 0; i < n; i++ )
		{
			this.ribbons[ i ].render( p );
		}
	}

	return Ribbons;

})();

Ribbon = ( function Ribbon() {

	function Ribbon( data )
	{
		THREE.Object3D.call( this );

		this.data = data;
		this.radius = data.radius || 1;
		this.length = 20;
		this.frictionBase = .5 + Math.random() * .4;

		this.refs = [];
		this.geometry = new THREE.Geometry();
		var n = this.length >> 1;
		for( var i = 0; i < n; i++ )
		{
			this.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			this.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );

			this.refs.push( new THREE.Vector3( 0, 0, 0 ) );
		}

		var matData = { color: this.data.color, side: THREE.DoubleSide };
		if( this.data.opacity != 1 && this.data.opacity != 0 )
		{
			matData[ "transparent" ] = true;
			matData[ "opacity" ] = this.data.opacity;
		}
		var material = new THREE.MeshBasicMaterial( matData );
		this.ribbon = new THREE.Ribbon( this.geometry, material );
		this.add( this.ribbon );
	}
	Ribbon.prototype = new THREE.Object3D();
	Ribbon.prototype.constructor = Ribbon;

	Ribbon.prototype.render = function render( p )
	{
		var vertices = this.geometry.vertices
		  , friction = this.frictionBase
		  , n = this.refs.length
		  , idx = -1
		  , radiusPercent = 0;
		var dx, dy, rad, dist, curr, vert;
		for( var i = 0; i < n; i++ )
		{
			curr = this.refs[ i ];
			dx = p.x - curr.x;
			dy = p.y - curr.z;
			rad = Math.atan2( dy, dx );
			dist = Math.sqrt( dx * dx + dy * dy );
			curr.x += dist * Math.cos( rad ) * friction;
			curr.z += dist * Math.sin( rad ) * friction;
			
			vert = vertices[ ++idx ];
			vert.x = curr.x + Math.cos( rad + Math.PI * .5 ) * this.radius * radiusPercent + this.data.x * radiusPercent;
			vert.y = this.data.y * radiusPercent;
			vert.z = curr.z + Math.sin( rad + Math.PI * .5 ) * this.radius * radiusPercent + this.data.z * radiusPercent;
			vert = vertices[ ++idx ];
			vert.x = curr.x + Math.cos( rad - Math.PI * .5 ) * this.radius * radiusPercent + this.data.x * radiusPercent;
			vert.y = this.data.y * radiusPercent;
			vert.z = curr.z + Math.sin( rad - Math.PI * .5 ) * this.radius * radiusPercent + this.data.z * radiusPercent;

			friction *= .6;
			if( i > n * .5 )
			{
				radiusPercent -= 0.1;

				if( radiusPercent < 0 )
					radiusPercent = 0;
			}
			else
			{
				radiusPercent += 0.15;
			}
		}
		this.geometry.verticesNeedUpdate = true;
	}

	return Ribbon;

})();