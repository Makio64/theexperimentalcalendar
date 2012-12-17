SVGReader = ( function() {

	function SVGReader()
	{
		this.data = {};
	}
	SVGReader.prototype.constructor = SVGReader;

	SVGReader.prototype.parse = function parse()
	{
		var nodeSVG = $( "#svg" );
		var childNodes = nodeSVG[ 0 ].childNodes[ 1 ].childNodes;
		this._parseNodes( childNodes );
	}

	SVGReader.prototype._parseNodes = function _parseNodes( nodes )
	{
		var node;
		var i = 0, n = nodes.length;
		for( ; i < n; i++ )
		{
			node = nodes[ i ];
			if ( node.nodeName != "#text" && node.nodeName != "#comment" )
			{
				switch( node.nodeName )
				{
					case "g": 
						if( node.attributes[ 0 ].nodeValue == "path" )
							this.data[ "path" ] = this._parseGPathNode( node ); 
						else if( node.attributes[ 0 ].nodeValue == "pathend" )
							this.data[ "pathend" ] = this._parseGPathNode( node ); 
						else if( node.attributes[ 0 ].nodeValue == "decors" )
							this.data[ "decors" ] = this._parseDecorsNode( node );
						else if( node.attributes[ 0 ].nodeValue == "zone" )
							this.data[ "zone" ] = this._parseZoneNode( node );
						else if( node.attributes[ 0 ].nodeValue == "message" )
							this.data[ "message" ] = this._parseMessageNode( node );
						break;
					default: console.log( "No default behavior for " + node.nodeName + " !" ); break;
				}
			}
		}
	}

	SVGReader.prototype._parseGPathNode = function _parseGPathNode( nodeG )
	{
		var node
		  , aPath = []
		  , i = 0
		  , n = nodeG.childNodes.length;
		for( ; i < n; i++ )
		{
			node = nodeG.childNodes[ i ];
			if( node.nodeName == "#text" )
				continue;

			aPath = this._parsePathNode( node );
		}
		return aPath;
	}

	SVGReader.prototype._parsePathNode = function _parsePathNode( node )
	{
		var path = node.attributes[ "d" ].nodeValue;
			path = path.replace(/,/gm,' '); // get rid of all commas
            path = path.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from commands
            path = path.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from commands
            path = path.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm,'$1 $2'); // separate commands from points
            path = path.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from points
            path = path.replace(/([0-9])([+\-])/gm,'$1 $2'); // separate digits when no comma
            path = path.replace(/(\.[0-9]*)(\.)/gm,'$1 $2'); // separate digits when no comma
            path = path.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm,'$1 $3 $4 '); // shorthand elliptical arc path syntax
            
        var cmd, ref, chara, idxEnd
          , aPath = []
          , idxStart = 0
          , j = 1
          , m = path.length;
        for( ; j < m; j++ )
        {
        	if( j < m - 1 )
        	{
        		chara = path[ j ];
        		idxEnd = j - 1;
        	}
        	else
        	{
        		chara = path[ idxStart ];
        		idxEnd = j + 1;
        	}
        	if( chara.match( /([MmZzLlHhVvCcSsQqTtAa])/gm ) )
        	{
        		cmd = path.substr( idxStart, idxEnd - idxStart );
        		cmd = cmd.split( " " );
        		switch( cmd[ 0 ] )
        		{
        			case "M": cmd = { cmd: "M"
        							, p: { x: parseFloat( cmd[ 1 ] ), y: parseFloat( cmd[ 2 ] ) } };
        					break;
        			case "C":
        			case "c": 
        					  cmd = { cmd: "c"
        					  		, cp0: { x: parseFloat( cmd[ 1 ] ), y: parseFloat( cmd[ 2 ] ) }
        					  		, cp1: { x: parseFloat( cmd[ 3 ] ), y: parseFloat( cmd[ 4 ] ) }
        					  		, p: { x: parseFloat( cmd[ 5 ] ), y: parseFloat( cmd[ 6 ] ) } };

        					ref = aPath[ aPath.length - 1 ];
        					cmd.cp0.x = ref.p.x + cmd.cp0.x;
        					cmd.cp0.y = ref.p.y + cmd.cp0.y;
        					cmd.cp1.x = ref.p.x + cmd.cp1.x;
        					cmd.cp1.y = ref.p.y + cmd.cp1.y;
        					cmd.p.x = ref.p.x + cmd.p.x;
        					cmd.p.y = ref.p.y + cmd.p.y;

        					break;
        		}
        		aPath.push( cmd );
        		idxStart = j;
        	} 	
        }
        return aPath;
	}

	SVGReader.prototype._parseDecorsNode = function _parseDecorsNode( nodeG )
	{
		var node
		  , data = []
		  , i = 0
		  , n = nodeG.childNodes.length;
		for( ; i < n; i++ )
		{
			node = nodeG.childNodes[ i ];
			if( node.nodeName == "#text" )
				continue;

			var entry = { x: parseFloat( node.attributes[ "cx" ].nodeValue )
						, y: parseFloat( node.attributes[ "cy" ].nodeValue )
						, r: parseFloat( node.attributes[ "r" ].nodeValue )
						, c: node.attributes[ "fill"].nodeValue };
			data.push( entry );
		}
		return data;
	}

	SVGReader.prototype._parseZoneNode = function _parseZoneNode( nodeG )
	{
		var node = nodeG.childNodes[ 1 ];
		var data = { x: parseFloat( node.attributes[ "x" ].nodeValue )
				   , y: parseFloat( node.attributes[ "y" ].nodeValue )
				   , w: parseFloat( node.attributes[ "width" ].nodeValue )
				   , h: parseFloat( node.attributes[ "height" ].nodeValue )
			};
		return data;
	}

	SVGReader.prototype._parseMessageNode = function _parseMessageNode( nodeG )
	{
		var node
		  , dataG
		  , data = { a: [], o: {} }
		  , n = nodeG.childNodes.length;
		for( var i = 0; i < n; i++ )
		{
			node = nodeG.childNodes[ i ];
			if( node.nodeName == "#text" )
				continue;

			dataG = this._parsePathNode( nodeG.childNodes[ i ] );
			data.a.push( dataG );
			data.o[ node.attributes[ "id" ].nodeValue ] = dataG;
		}
		return data;
	}
	return SVGReader;
	
})();