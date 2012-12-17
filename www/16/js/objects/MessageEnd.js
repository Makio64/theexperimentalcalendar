MessageEnd = ( function MessageEnd() {

	function MessageEnd( data )
	{
		THREE.Object3D.call( this );

		this.position.y = 20;
		//this.position.z = -500;

		this.data = data;
	}
	MessageEnd.prototype = new THREE.Object3D();
	MessageEnd.prototype.constructor = MessageEnd;

	MessageEnd.prototype.create = function create()
	{
		var mat = new THREE.LineBasicMaterial( { color: 0xff0000, lineWidth: 25 } );

		this.letters = [];
		var n = this.data.a.length;
		for( var i = 0; i < n; i++ )
		{
			path = new THREE.Path();
			U3D.createPath( path, this.data.a[ i ] );

			this.letters[ i ] = new Letter( path.getPoints() );
			this.add( this.letters[ i ] );
		}
	}

	MessageEnd.prototype.play = function play()
	{
		//this.render();
		//requestAnimationFrame( this.play.bind( this ) );
	}

	MessageEnd.prototype.render = function animate()
	{
		var n = this.letters.length;
		for( var i = 0; i < n; i++ )
			this.letters[ i ].play();
	}

	return MessageEnd;

})();

Letter = ( function Letter() {

	function Letter( data )
	{
		THREE.Object3D.call( this );

		/*this.v1Old = null;
		this.v2Old = null;

		this.data = data;
		this.currentIdx = 0;

		this.geometry = new THREE.Geometry();
		var n = this.data.length;
		for( var i = 0; i < n; i++ )
		{
			this.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			this.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		}*/

		var m1 = new THREE.LineBasicMaterial( { color: 0xe4206c, linewidth: 25, opacity: .8, transparent: true } )
		  , m2 = new THREE.LineBasicMaterial( { color: 0xe31214, linewidth: 25, opacity: .3, transparent: true } )
		  , m3 = new THREE.LineBasicMaterial( { color: 0xe31214, linewidth: 25, opacity: .6, transparent: true } );

		var cnt1 = new THREE.Object3D()
		  , cnt2 = new THREE.Object3D()
		  , cnt3 = new THREE.Object3D();

		this.add( cnt1 );
		this.add( cnt2 );
		this.add( cnt3 );

		var v2, v3
		  , old = data[ 0 ]
		  , n = data.length;
		for( var i = 1; i < n; i+=6 )
		{
			geo = new THREE.Geometry();
			v3 = new THREE.Vector3( old.x, 0, old.y );
			geo.vertices.push( v3 );
			v2 = data[ i ];
			v3 = new THREE.Vector3( v2.x, 0, v2.y );
			geo.vertices.push( v3 );
			old = v2;

			line = new THREE.Line( geo, m1 );
			cnt1.add( line );

			line = new THREE.Line( geo, m2 );
			line.position.x = -6;
			line.position.y = -8;
			cnt2.add( line );

			line = new THREE.Line( geo, m3 );
			line.position.x = -2;
			line.position.y = 3;
			cnt3.add( line );
		}

		// ugly but it's 4am, c'mon
		geo = new THREE.Geometry();
		v3 = new THREE.Vector3( old.x, 0, old.y );
		geo.vertices.push( v3 );
		v2 = data[ n - 1 ];
		v3 = new THREE.Vector3( v2.x, 0, v2.y );
		geo.vertices.push( v3 );
		old = v2;
		line = new THREE.Line( geo, m1 );
		cnt1.add( line );

		line = new THREE.Line( geo, m2 );
		line.position.x = -6;
		line.position.y = -8;
		cnt2.add( line );

		line = new THREE.Line( geo, m3 );
		line.position.x = 5;
		line.position.y = 3;
		cnt3.add( line );

		/*this.ribbon = new THREE.Ribbon( this.geometry, new THREE.MeshBasicMaterial( { color: 0xe31214, transparent: true, opacity: 0.8 } ) );
		this.add( this.ribbon );*/
	}
	Letter.prototype = new THREE.Object3D();
	Letter.prototype.constructor = Letter;

	/*Letter.prototype.play = function play()
	{
		var vertices = this.geometry.vertices;
		if( this.currentIdx >= vertices.length * .5 - 2 )
			return;

		var radius = 3;

		var p1 = this.data[ this.currentIdx ]
		  , p2 = this.data[ this.currentIdx + 1 ]
		
		  , v1New = this.geometry.vertices[ this.currentIdx * 2 ]
		  , v2New = this.geometry.vertices[ this.currentIdx * 2 + 1 ]

		  , dx = p2.x - p1.x
		  , dy = p2.y - p1.y
		  , rad = Math.atan2( dy, dx )
		  , dist = Math.sqrt( dx * dx + dy * dy )
		  , curr = { x: dist * Math.cos( rad )
				   , y: dist * Math.sin( rad ) };

		var pi = Math.PI * .5;
		if( this.currentIdx > 0 )
		{
			v1New.x = curr.x + Math.cos( rad + pi ) * radius + this.data[ 0 ].x;
			v1New.z = curr.y + Math.sin( rad + pi ) * radius + this.data[ 0 ].y;
			v2New.x = curr.x + Math.cos( rad - pi ) * radius + this.data[ 0 ].x;
			v2New.z = curr.y + Math.sin( rad - pi ) * radius + this.data[ 0 ].y;
		}
		else
		{
			v1New.x = p1.x - radius;
			v1New.z = p1.y - radius;
			v2New.x = p2.x - radius;
			v2New.z = p2.y - radius;
		}

		this.geometry.verticesNeedUpdate = true;

		this.currentIdx++;
	}*/

	return Letter;

})();