// THREEf.js ( rev 84.10 BETA )

/**
 * @author hofk / http://sandbox.threejs.hofk.de/
*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.THREEf = global.THREEf || {})));
}(this, (function (exports) {

'use strict';

var g;	// is a THREE.Geometry

function createMorphGeometry( p ) {
 
/*	parameter overview	--- all parameters are optional ---

p = {

		// simple properties
	
	radius,			// reference radius, multiplier for functions
	height,			// reference height, multiplier for functions
	radiusSegments,	// radius segments (number)
	heightSegments,	// height segments (number)
	circOpen,		// circular connected or disconnected
	withTop,		// with a top
	withBottom,		// with a bottom
	waffled,		// four faces / segment, with center vertex
	style,			// 'map', 'cover', 'complete'
			
		// functions: u,v and result normally 0 .. 1, otherwise specific / interesting results!
			// ( trigonometric functions often with factor n * PI )
		// u radial, v heigt, t time
	
	rCircHeight,  	//	function ( u, v, t )	// radius depending on segment location
	centerX,		//	function ( v, t )	// centerpoint x by height
	centerY,		//	function ( v, t )	// centerpoint y by height
	centerZ,		//	function ( v, t )	// centerpoint z by height
	unrollCover,	//	function ( v, t )	// 0 closed, 1 linear open (to -1*radius)
	waffleDeep,		//	function ( u, v, t )	// radius difference center vertex	
	moveX,			//	function ( u, v, t )	// factor for radius, move in x direction 
	moveY,			//	function ( u, v, t )	// factor for height, move in y direction
	moveZ,			//	function ( v, u, t )	// factor for radius, move in z direction	
	endCircAngle,	//	function ( v, t )	// circular end angle (per height)
	startCircAngle,	//	function ( v, t )	// circular starting angle (per height)
	scaleCircAngle,	//	function ( u, t )	// scaling between start and end of circular angle
	topHeight,		//	function ( u, t )	// top height (per circular angle)
	bottomHeight,	//	function ( u, t )	// bottom height (per circular angle)
	scaleHeight, 	//	function ( v, t )	// scaling between bottom and top height
	materialTop,	//	function ( u, t )	// material top ( per circular sector)
	materialBottom,	//	function ( u, t )	// material bottom ( per circular sector)
	materialCover,	//	function ( u, v, t )	// material cover ( per circular sector and height )
											// material: round( result*10 ) is material index  0 .. 10
	
		// string array (strings of digits) seperated with a ,
		
	fixedMaterial,	//  fixed given material index, overrides materialCover
	
		// array of center points replaces heightSegments, scaleHeight and the center functions centerX, centerY, centerZ
	
	centerPoints	// array of arrays of coordinates [ [ x0, y0, z0 ], ..  [ xi , yi, zi ] ], values normally 0 .. 1
	
  }
  
*/
    if ( p === undefined ) p = {};
	
	g = this;  // this is a THREE.Geometry()  - the base class geometry object from THREE.js
	
	g.noCenterPoints = p.centerPoints === undefined ? true : false;
	
	g.centerXdefault = p.centerX === undefined ? true : false;
	g.centerYdefault = p.centerY === undefined ? true : false;
	g.centerZdefault = p.centerZ === undefined ? true : false;
	
	g.materialTopDefault = p.materialTop === undefined ? true : false;
	g.materialBottomDefault = p.materialBottom === undefined ? true : false;
	g.materialCoverDefault = p.materialCover === undefined ? true : false;
	g.fixedMaterialDefault = p.fixedMaterial === undefined ? true : false;
	g.materialDefault = g.materialTopDefault && g.materialBottomDefault && g.materialCoverDefault && g.fixedMaterialDefault;
	
	//...................................................................... set defaults
	
	g.radius = 			p.radius			!== undefined ? p.radius			: 16;
	g.height =			p.height			!== undefined ? p.height			: 100;
	g.radiusSegments =	p.radiusSegments	!== undefined ? p.radiusSegments	: 10;
	g.heightSegments =	p.heightSegments	!== undefined ? p.heightSegments	: 10; 
	g.circOpen =		p.circOpen			!== undefined ? p.circOpen			: false;
	g.withTop =			p.withTop			!== undefined ? p.withTop			: false;
	g.withBottom =		p.withBottom		!== undefined ? p.withBottom		: false;
	g.waffled =			p.waffled			!== undefined ? p.waffled			: false;
	g.style =			p.style				!== undefined ? p.style				: "complete";
	g.rCircHeight =		p.rCircHeight		!== undefined ? p.rCircHeight		: function ( u, v, t ) { return 1 };
	g.centerX =			p.centerX			!== undefined ? p.centerX			: function ( v, t ) { return 0 };
	g.centerY =			p.centerY			!== undefined ? p.centerY			: function ( v, t ) { return v };
	g.centerZ =			p.centerZ			!== undefined ? p.centerZ			: function ( v, t ) { return 0 };
	g.unrollCover =		p.unrollCover		!== undefined ? p.unrollCover 		: function ( v, t ) { return 0 };
	g.waffleDeep =		p.waffleDeep		!== undefined ? p.waffleDeep		: function ( u, v, t ) { return 0 };
	g.moveX =			p.moveX				!== undefined ? p.moveX				: function ( u, v, t ) { return 0 };
	g.moveY =			p.moveY				!== undefined ? p.moveY				: function ( u, v, t ) { return 0 };
	g.moveZ =			p.moveZ				!== undefined ? p.moveZ				: function ( u, v, t ) { return 0 };
	g.endCircAngle =	p.endCircAngle		!== undefined ? p.endCircAngle		: function ( v, t ) { return 1 };
	g.startCircAngle =	p.startCircAngle	!== undefined ? p.startCircAngle	: function ( v, t ) { return 0 };
	g.scaleCircAngle =	p.scaleCircAngle	!== undefined ? p.scaleCircAngle	: function ( u, t ) { return u };
	g.topHeight =		p.topHeight			!== undefined ? p.topHeight			: function ( u, t ) { return 1 };
	g.bottomHeight =	p.bottomHeight		!== undefined ? p.bottomHeight		: function ( u, t ) { return 0 };
	g.scaleHeight =		p.scaleHeight		!== undefined ? p.scaleHeight		: function ( v, t ) { return v };
	
	// When using multi material:
	// Take index 0 for invisible faces like THREE.MeshBasicMaterial( { visible: false } ),
	// or use transparent faces like THREE.MeshBasicMaterial( {transparent: true, opacity: 0.05 } )
		
	// Please note!	The functions normally should have results from 0 to 1. If the multimaterial array
	// contains fewer materials than the functional result * 10, the script will crash.
	// Even if the result is negative.
	
	g.materialTop =	function(){ return 1 };		// default material index is 0.1 * 10 = 1
	g.materialBottom = function(){ return 1 };
	g.materialCover = function(){ return 1 };
	
	if ( p.materialTop !== undefined ) g.materialTop = function ( u, t ) { return  Math.floor( 10 * p.materialTop( u, t ) ) };
	if ( p.materialBottom !== undefined ) g.materialBottom = function ( u, t ) { return  Math.floor( 10 * p.materialBottom( u, t ) ) };
	if ( p.materialCover !== undefined ) g.materialCover = function ( u, v, t ) { return  Math.floor( 10 * p.materialCover( u, v, t ) ) };
	
	// Please note!
	// If the multimaterial array contains fewer materials than the highest number in fixed material, the script will crash.
	// String array fixedMaterial contains strings of digits 0 to 9, for instance [ .. '0011997741', '222200' .. ].
	// Every string represents a corresponding row of faces from left-top from cover.
	// It's not necessary, that the length of array / strings equals the number of faces, e.g. only ['1'] is sufficient.
	
	g.fixedMaterial = p.fixedMaterial !== undefined ? p.fixedMaterial : []; // default is empty
	
	// array of center points replaces heightSegments, scaleHeight and the center functions centerX, centerY, centerZ
	
	g.centerPoints  = g.noCenterPoints ? [] : p.centerPoints; // default is empty
		
	//..............................................................................................
	
	g.createVertices =	createVertices;
	g.createFaces =		createFaces;
	g.morphVertices	=	morphVertices;
	g.morphFaces =		morphFaces;
	
	g.createVertices();
	g.createFaces();
	g.morphVertices();
	
	if ( !g.materialDefault ) {
	
		g.morphFaces();
	
	}
	
}

function createVertices() {

	g = this;
	
	var rs = g.radiusSegments;
	var hs = g.noCenterPoints ? g.heightSegments : g.centerPoints.length - 1;
	var hss	= hs + 1;
	var hvc	= g.waffled ? hss + hs : hss;   // height vertex count
		
	if ( g.style !== "complete" ) { g.withBottom = false; g.withTop = false; g.circOpen = true; }
	
	for ( var i = 0; i < hvc*rs ; i ++ ) { g.vertices.push( new THREE.Vector3( 0, 0, 0 ) ); }
	
	if ( g.circOpen ) {
	
		for ( var i = 0; i < hss; i ++ ) { g.vertices.push( new THREE.Vector3( 0, 0, 0 ) ); } // extra vertices right to the end
		
	}
	
	if ( g.withBottom ) g.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	
	if ( g.withTop ) g.vertices.push( new THREE.Vector3( 0, 0, 0 ) );

}

function createFaces() {

	g = this;
	
	var rs = g.radiusSegments;
	var hs = g.noCenterPoints ? g.heightSegments : g.centerPoints.length - 1;
	var hss	= hs + 1;
	var hvc	= g.waffled ? hss + hs : hss;   // height vertex count
	var circVertexCount = g.circOpen ? rs : rs - 1;
	var nj;					// relative radius segment (circular)
	var nj1;				// next relative radius segment
	var ni;					// relative height segment
	var ni1;				// next relative height segment
	var x, x1, xC;			// coordinates	
	var y, y1, yC;
	var uX, uX1;	
	var uZ, uZ1;
	var a;					// vertices (index)
	var b1, b2, b3, b4;
	var c1, c2, c3, c4;
	var topOffset;
	
	function uvCoordinatesX() {
	
		nj = j / rs;
		nj1 = ( j + 1 ) / rs;
		x = g.scaleCircAngle( nj );
		x1 = g.scaleCircAngle( nj1 );
	}
	
	function uvCoordinatesY() {
	
		ni = i / hs;
		ni1 = ( i + 1 ) / hs;
		y = g.scaleHeight( ni );
		y1 = g.scaleHeight( ni1 );
		
	}
		
	function uvCoordinatesBottomTop() {
	
		uX =  0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
		uX1 = 0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) );
		uZ =  0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
		uZ1 = 0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) );
		
	}	
	
	function pushTwoFaceVertexUvs() {
	
		g.faceVertexUvs[ 0 ].push( [		// right-bottom
			new THREE.Vector2( x, y ),
			new THREE.Vector2( x1, y ),
			new THREE.Vector2( x1, y1 )
		] );	
		
		g.faceVertexUvs[ 0 ].push( [		// left-top
			new THREE.Vector2( x, y  ),
			new THREE.Vector2( x1, y1 ),
			new THREE.Vector2( x, y1 )
		] );
		
	}
	
	function pushFourFaceVertexUvs() {
		
		g.faceVertexUvs[ 0 ].push( [		// bottom
			new THREE.Vector2( xC, yC ),
			new THREE.Vector2( x, y ),
			new THREE.Vector2( x1, y )
		] );
		
		g.faceVertexUvs[ 0 ].push([			// left
			new THREE.Vector2( xC, yC ),
			new THREE.Vector2( x, y1 ),
			new THREE.Vector2( x, y )
		] );
		
		g.faceVertexUvs[ 0 ].push( [		// right
			new THREE.Vector2( xC, yC ),
			new THREE.Vector2( x1, y ),
			new THREE.Vector2( x1, y1 )
		] );
		
		g.faceVertexUvs[ 0 ].push( [		// top
			new THREE.Vector2( xC, yC ),
			new THREE.Vector2( x1, y1 ),
			new THREE.Vector2( x, y1 )
		] );
	
	}
	
	function pushBottomFaceVertexUvs() {
	
		g.faceVertexUvs[ 0 ].push( [
			new THREE.Vector2( 0.5, 0.5 ),
			new THREE.Vector2( uX1, uZ1 ),
			new THREE.Vector2( uX, uZ )
		] );
		
	}
	
	function pushTopFaceVertexUvs() {
	
		g.faceVertexUvs[ 0 ].push( [
			new THREE.Vector2( 0.5, 0.5 ),
			new THREE.Vector2( uX, uZ ),
			new THREE.Vector2( uX1, uZ1 )
		] );
		
	}
	
	if ( g.style !== "complete" ) { g.withBottom = false; g.withTop = false; g.circOpen = true; }
	
	if ( !g.waffled ) {
	
		for ( var j = 0; j < ( g.circOpen ? rs : rs - 1 )  ; j ++ ) {
			
			uvCoordinatesX();
			
			for ( var i = 0; i < hs; i ++ ) {
			
				// 2 faces / segment,  3 vertex indices
				a =  hvc * j + i;
				b1 = hvc * ( j + 1 ) + i;		// right-bottom
				c1 = hvc * ( j + 1 ) + 1 + i;
				b2 = hvc * ( j + 1 ) + 1 + i;	// left-top
				c2 = hvc * j + 1 + i;
				
				g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) ); // right-bottom
				g.faces.push( new THREE.Face3( a, b2, c2, null, null, 1 ) ); // left-top
				
				uvCoordinatesY();
				
				pushTwoFaceVertexUvs();
			}
			
		}
		
	}
	
	
	if ( g.waffled ) {
	
		for ( var j = 0; j < circVertexCount; j ++ ) {
		
			uvCoordinatesX();
			xC = 0.5 * ( x + x1 );
			
			for ( var i = 0; i < hs; i ++ ) {
			
				// 4 faces / segment, 3 vertex indices
				a =  hvc * j + hss + i;
				
				b1 = hvc * j + i;				// bottom
				c1 = hvc * ( j + 1 ) + i;
				
				b2 = hvc * j + 1 + i;			// left
				c2 = hvc * j + i;
				
				b3 = hvc * ( j + 1 ) + i;		// right
				c3 = hvc * ( j + 1 ) + 1 + i;
				
				b4 = hvc * ( j + 1 ) + 1 + i;	// top
				c4 = hvc * j + 1 + i;
				
				g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) ); // bottom
				g.faces.push( new THREE.Face3( a, b2, c2, null, null, 1 ) ); // left
				g.faces.push( new THREE.Face3( a, b3, c3, null, null, 1 ) ); // right
				g.faces.push( new THREE.Face3( a, b4, c4, null, null, 1 ) ); // top
				
				uvCoordinatesY();
				
				yC = 0.5 * ( y + y1 );
				
				pushFourFaceVertexUvs();
			
			}
			
		}
		
	}	
	
	if ( !g.circOpen && g.style === "complete" ) {
	
		j  = rs - 1;							// connection to first radius segment
		nj = j / rs;
		
		//   UVs
		x  = g.scaleCircAngle( nj );
		x1 = g.scaleCircAngle(  1 );
	
		if ( !g.waffled ) {
		
			for ( var i = 0; i < hs; i ++ ) {
			
				// 2 faces / segment,  3 vertex indices
				a =  hvc * j + i;
				
				b1 = i;					// right-bottom
				c1 = 1 + i;
				
				b2 = 1 + i;				// left-top
				c2 = hvc * j + 1 + i;
				
				g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) ); // right-bottom
				g.faces.push( new THREE.Face3( a, b2, c2, null, null, 1 ) ); // left-top
				
				uvCoordinatesY();
				
				pushTwoFaceVertexUvs();
			
			}
			
		}
		
		if ( g.waffled ) {
			
			xC  = 0.5 * ( x + x1 ); //   UVs
			
			for ( var i=0; i < hs; i ++ ) {
			
				// 4 faces / segment, 3 vertex indices
				a =  hvc * j + hss + i;
				
				b1 = hvc * j + i;			// bottom
				c1 = i;
				
				b2 = hvc * j + 1 + i;		// left
				c2 = hvc * j + i;
				
				b3 = i;						// right
				c3 = 1 + i;
				
				b4 = 1 + i;					// top
				c4 = hvc * j + 1 + i;
				
				g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) ); // bottom
				g.faces.push( new THREE.Face3( a, b2, c2, null, null, 1 ) ); // left
				g.faces.push( new THREE.Face3( a, b3, c3, null, null, 1 ) ); // right
				g.faces.push( new THREE.Face3( a, b4, c4, null, null, 1 ) ); // top
				
				uvCoordinatesY();	
				
				yC = 0.5 * ( y + y1 );
				pushFourFaceVertexUvs();
			
			}
			
		}
	
	}

	if ( g.withBottom || g.withTop ) {
	
		topOffset = 0;
	
		if ( g.withBottom ) {
		
			topOffset = 1;
		
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj  = ( rs - j ) / rs;
				nj1 = ( rs - j - 1 ) / rs;
				
				a  = g.circOpen ? hvc * rs + hss : hvc * rs ;  // from center a
				b1 = hvc * ( j + 1 );
				c1 = hvc * j;

				g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) );
				
				uvCoordinatesBottomTop();
				
				pushBottomFaceVertexUvs();

			}
					
			if ( !g.circOpen ) {
	
				j = rs - 1;					// connect to the first segment
				
				nj  = ( rs - j ) / rs;
				nj1 = ( rs - j - 1 ) / rs;
				
				a  = hvc * rs;
				b1 = 0;
				c1 = hvc * j;
				
				g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) );
				
				uvCoordinatesBottomTop();
				
				pushBottomFaceVertexUvs();
				
			}	
		}
		
		if ( g.withTop ) {
			
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj  = j / rs;
				nj1 = ( j + 1 ) / rs;
				
				a  = g.circOpen ? hvc * rs + hss + topOffset : hvc * rs + topOffset;   // from center a
				b1 = hvc * j + hs;
				c1 = hvc * ( j + 1 ) + hs;
				
				g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) );
				
				uvCoordinatesBottomTop();
				
				pushTopFaceVertexUvs();
			
			}
			
			if ( !g.circOpen ) {
			
				j = rs - 1;					// connect to the first segment
				
				nj  = j / rs;
				nj1 = ( j + 1 ) / rs;
			
				a  = hvc * rs + topOffset;	// from center a
				b1 = hvc * j + hs;
				c1 = hs;
				
				g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) );
				
				uvCoordinatesBottomTop();
				
				pushTopFaceVertexUvs();
			
			}
		
		}
	
	}

}

function morphVertices( time ) {

	var t = time !== undefined ? time : 0;
	
	g = this;
	
	var rs = g.radiusSegments;	
	var hs = g.noCenterPoints ? g.heightSegments : g.centerPoints.length - 1;
	var hss	= hs + 1;
	var hvc	= g.waffled ? hss + hs : hss;   // height vertex count
	var circVertexCount = g.circOpen ? rs + 1 : rs	
	var halfH = 0.5 * g.height; // half height			
	var nj;					// relative radius segment (circular)
	var ni;					// relative height segment
	var ni01;				// relative height segment (0.1 over segment bottom)
	var x, y, z;			// vertex position 
	var cX, cY, cZ;			// center curve (coordinates segment bottom)
	var cX01, cY01, cZ01;	// center curve (coordinates 0.1 over segment bottom)
	var tX, tY, tZ;			// tangent
	var nX, nY, nZ;			// normal
	var bX, bY, bZ;			// binormal	
	var angle;				// calculated angle
	var lenV;				// length of vector
	var xC, yC, zC;			// center of unroll circle
	var r;					// calculated radius
	var scalingAngle;
	var scalingHeight;
	var scalingHeight01;
	var unrC;				// unroll cover
	var rUnrC;				// radius unroll circle:		
	var sigma0;				// start angle unroll
	var sigma;				// unroll angle 
	var f1Vec = {};
	var f2Vec = {};
	var normalVec = {};
	var leftBtm;
	var leftTop;
	var rightBtm;
	var rightTop;
	var lastCircSegmentWidth;
	var idx;
	var waffleVidx; 		// waffle vertex index
	var pi = Math.PI;
	var topOffset = 0;
	
	if ( g.style !== "complete" ) { g.withBottom = false; g.withTop  = false; g.circOpen = true; }
	
	g.verticesNeedUpdate  = true;
	
	if ( !g.noCenterPoints ) {
	
		var p;				// point index, last point different
		var dX;
		var dY;
		var dZ;
		var scHeight = [];	// scaling the height by the given coordinates
		
		scHeight[ 0 ] = 0; 
			
		for ( var i = 0; i < g.centerPoints.length; i ++ ) {
			
			if ( i > 0 ) {
			
				dX = g.centerPoints[ i ][ 0 ] - g.centerPoints[ i - 1 ][ 0 ];
				dY = g.centerPoints[ i ][ 1 ] - g.centerPoints[ i - 1 ][ 1 ];
				dZ = g.centerPoints[ i ][ 2 ] - g.centerPoints[ i - 1 ][ 2 ];
							
				scHeight[ i ]  = scHeight[ i - 1 ] + Math.sqrt( dX * dX + dY * dY + dZ * dZ ) * g.height;
			
			}	
			
		}
										
	}
	
	for ( var j = 0; j < circVertexCount; j ++ ) {
	
		nj = j / rs;
		
		for ( var i = 0; i < hss; i ++ ) {
		
			ni   = i / hs;
			ni01 = ( i + 0.1 ) / hs;
			
			scalingAngle = g.startCircAngle( ni, t ) + ( g.endCircAngle( ni, t ) - g.startCircAngle( ni, t ) ) * g.scaleCircAngle( nj, t );

			// scalingHeight
			if ( g.noCenterPoints ) {
				
				scalingHeight = g.bottomHeight( nj, t ) + ( g.topHeight( nj, t ) - g.bottomHeight( nj, t ) ) * g.scaleHeight( ni, t );
				
			} else {
							
				scalingHeight = g.bottomHeight( nj, t ) + ( g.topHeight( nj, t ) - g.bottomHeight( nj, t ) ) * scHeight[ i ] / g.height;
		
			}
			
			if ( g.style === "map"  || g.style === "cover" ) {
			
				x = g.radius * 2 * pi * scalingAngle;			
				y = g.height * scalingHeight + g.height * g.moveY( nj, ni, t ) - halfH;
				z = g.style === "map"  ?  0  :  g.radius * g.rCircHeight( nj, ni, t ) - g.radius;
				
			}
			
			if ( g.style === "complete" ) {
			
				unrC = g.unrollCover( ni, t );
				
				// prevent division by zero:
				unrC = unrC <= 1.0 ? ( unrC < 0.9999 ? unrC : 0.9999 ) : ( unrC > 1.0001 ? unrC : 1.0001 );
				
				sigma0 = 0.5 * unrC;
				sigma  = 1 - unrC;		//  ... 1 .. 0 ...
				rUnrC  = 1 / sigma;		// radius unroll circle: ... 1 .. near infinity
				
				angle =  2 * pi * ( sigma0 + sigma * scalingAngle );
				
				if ( g.centerXdefault && g.centerYdefault && g.centerZdefault && g.noCenterPoints ) {
				
					xC	= g.radius * ( rUnrC - 1 );			// center unroll circle ( unroll: 0 -> xC: 0 )
					r 	= g.radius * ( ( rUnrC - 1 )	+ g.rCircHeight( nj,  ni, t ) );
					
					x 	= xC  +  r * Math.cos( angle )	+ g.radius * g.moveX( nj, ni, t );
					y	= g.height * scalingHeight		+ g.height * g.moveY( nj, ni, t ) - halfH;
					z	=	    -r * Math.sin( angle )	+ g.radius * g.moveZ( nj, ni, t );
					
				} else {
						
					// calculation of the vector equation of circle in 3D space:
					
					if ( g.noCenterPoints ) {
					
						cX = g.centerX( ni, t );
						cY = g.centerY( scalingHeight, t );
						cZ = g.centerZ( ni, t );
											
						scalingHeight01 = g.bottomHeight( nj, t ) + ( g.topHeight( nj, t ) - g.bottomHeight( nj, t ) ) * g.scaleHeight( ni01, t );
							
						cX01 = g.centerX( ni01, t );
						cY01 = g.centerY( scalingHeight01, t );
						cZ01 = g.centerZ( ni01, t );
						
						// approximated tangent vector of center curve (is the normal of segment bottom)
										
						tX = cX01 - cX;
						tY = cY01 - cY;
						tZ = cZ01 - cZ;
						
					} else {
					 
						cX = g.centerPoints[ i ][ 0 ];
						cY = g.centerPoints[ i ][ 1 ];
						cZ = g.centerPoints[ i ][ 2 ];
						
						p = i < hs ? i : i - 1; // ... to last point
						
						tX = g.centerPoints[ p + 1 ][ 0 ] - g.centerPoints[ p ][ 0 ];
						tY = g.centerPoints[ p + 1 ][ 1 ] - g.centerPoints[ p ][ 1 ];
						tZ = g.centerPoints[ p + 1 ][ 2 ] - g.centerPoints[ p ][ 2 ];
								
					}	
							
					if ( i === 0 ) {
						
						// mode of calculating the first binormal
						
						// ........................  BETA  .........................
						
						var mode = 6; 	// ... BETA ...  var mode = 1; ... var mode = 6;  
						
						if ( mode === 0 ) {	
						
							// prevents division by zero
							tY = ( tY < 0 ) ? ( ( tY > -0.0000001 ) ? -0.0000001 : tY ) : ( ( tY < 0.0000001 ) ? 0.0000001 : tY );
						
							bX = tX;
							bY = -( tX * tX + tZ * tZ ) / tY;
							bZ = tZ;
						
						}
										
						if ( mode === 1 ) {
							// prevents division by zero
							tZ = ( tZ < 0 ) ? ( ( tZ > -0.0000001 ) ? -0.0000001 : tZ ) : ( ( tZ < 0.0000001 ) ? 0.0000001 : tZ );		
							
							bX = 1;
							bY = ( tY * tY - tX ) / tZ;
							bZ = tZ;
						
						}
					
						if ( mode === 2 ) {
						
							bX = tZ;
							bY = 0;
							bZ = -tX;
						
						}
						
						if ( mode === 3 ) {
							
							// prevents division by zero
							tY = ( tY < 0 ) ? ( ( tY > -0.0000001 ) ? -0.0000001 : tY ) : ( ( tY < 0.0000001 ) ? 0.0000001 : tY );
						
							bX = 1;
							bY = -tX / tY ;
							bZ = 0;
						
						}
														
						if ( mode === 4 ) {
						
							// prevents division by zero
							tY = ( tY < 0 ) ? ( ( tY > -0.0000001 ) ? -0.0000001 : tY ) : ( ( tY < 0.0000001 ) ? 0.0000001 : tY );
		
							bX =  1;											
							bY =  tY < 0 ? ( tX < 0 ? tX / tY  :  -tX / tY ) : ( tX < 0 ? -tX / tY : tX / tY ); 	
							bZ = 0;
						
						}	
						
						if ( mode === 5 ) {
						
							bX = tY !== 0 ? 1 : 0;
							bY = tY !== 0 ? -tX / tY : 1;
							bZ = 0;
						
						}
						
						if ( mode === 6 ) {
						
							bX = 1;
							bY = tY !== 0 ? 0.000101 : -0.999989;
							bZ = 0;
						
						}			
									
						// .........................................................
						
					}
					
					// cross product b, t calculates the normal ( if i > 0  binormal from last segment )
					// see http://www.cs.cmu.edu/afs/andrew/scs/cs/15-462/web/old/asst2camera.html
					
					nX = tY * bZ - tZ * bY;
					nY = tZ * bX - tX * bZ;
					nZ = tX * bY - tY * bX;
					
					// new binormal
									
					bX = nY * tZ - nZ * tY;
					bY = nZ * tX - nX * tZ;
					bZ = nX * tY - nY * tX;		
					
					// normalize
					
					lenV = Math.sqrt( bX * bX + bY * bY + bZ * bZ );
					
					bX = bX / lenV;
					bY = bY / lenV;
					bZ = bZ / lenV;
										
					lenV = Math.sqrt( nX * nX + nY * nY + nZ * nZ );
					
					nX = nX / lenV;
					nY = nY / lenV;
					nZ = nZ / lenV;														
											
					r	= g.radius * ( ( rUnrC - 1 ) + g.rCircHeight( nj, ni, t ) );
					
					// vector equation of circle in 3D space
					
					x	= cX * g.height + r * ( Math.cos( angle ) * bX + Math.sin( angle ) * nX );
					y	= cY * g.height + r * ( Math.cos( angle ) * bY + Math.sin( angle ) * nY );
					z	= cZ * g.height + r * ( Math.cos( angle ) * bZ + Math.sin( angle ) * nZ );
					
					x = x + g.radius * g.moveX( nj, ni, t );
					y = y + g.height * g.moveY( nj, ni, t ) - halfH;
					z = z + g.radius * g.moveZ( nj, ni, t );
					
					// straight line for center of unroll circle, ( unroll: 0 -> xC: cX, yC: cY, zC: cZ )
					
					xC = cX + g.radius * ( rUnrC - 1 ) * bX;
					yC = cY + g.radius * ( rUnrC - 1 ) * bY;
					zC = cZ + g.radius * ( rUnrC - 1 ) * bZ;
					
					x = x + xC;
					y = y + yC;
					z = z + zC;
					
				}
			
			}
			
			g.vertices[ hvc * j + i ].set( x , y , z ); // set vertex position
			
		}
		
	}	
			
	if ( g.waffled ) {
	
		// calculation of the center points
		
		for ( var j = 0; j < rs; j ++ ) {
		
			nj = j / rs;
			
			for ( var i = 0; i  < hs; i ++ ) {
			
				ni =  i / hs;
				
				waffleVidx =  hvc * j + i + hss;
				
				g.vertices[ waffleVidx ].setScalar( 0 );
				
				// initialize two vectors from the waffle vertex
				
				f1Vec.x = 0;
				f1Vec.y = 0;
				f1Vec.z = 0;
				
				f2Vec.x = 0;
				f2Vec.y = 0;
				f2Vec.z = 0;
				
				leftBtm  = hvc * j + i;															// left-bottom
				leftTop  = hvc * j + i + 1;  													// left-top
				rightBtm = ( !g.circOpen && j === rs - 1 ) ? i : hvc * ( j + 1 ) + i;  			// right-bottom
				rightTop = ( !g.circOpen && j === rs - 1 ) ? i + 1 : hvc * ( j + 1 ) + i + 1; 	// right-topn
				
				g.vertices[ waffleVidx ].add( g.vertices[ leftBtm ] );
				g.vertices[ waffleVidx ].add( g.vertices[ leftTop ] );
				
				if ( !g.circOpen && j===rs - 1 && g.style !== "complete" ) {
					
					lastCircSegmentWidth = g.vertices[ leftBtm ].x - g.vertices[ hvc * ( j - 1 ) + i ].x ;
					
					g.vertices[ waffleVidx ].x += g.vertices[ leftBtm ].x  + lastCircSegmentWidth;
					g.vertices[ waffleVidx ].y += g.vertices[ leftBtm ].y;
					g.vertices[ waffleVidx ].z += g.vertices[ leftBtm ].z;
					
					g.vertices[ waffleVidx ].x += g.vertices[ leftTop ].x  + lastCircSegmentWidth;
					g.vertices[ waffleVidx ].y += g.vertices[ leftTop ].y;
					g.vertices[ waffleVidx ].z += g.vertices[ leftTop ].z;
					
				} else {
				
					g.vertices[ waffleVidx ].add( g.vertices[ rightBtm ] );
					g.vertices[ waffleVidx ].add( g.vertices[ rightTop ] );
					
				}
				
				g.vertices[ waffleVidx ].multiplyScalar( 0.25 );				// calculate center
				
				if ( g.style === "cover" || g.style === "complete" ) {
					
					f1Vec.x = g.vertices[ leftTop ].x - g.vertices[ waffleVidx ].x;
					f1Vec.y = g.vertices[ leftTop ].y - g.vertices[ waffleVidx ].y;
					f1Vec.z = g.vertices[ leftTop ].z - g.vertices[ waffleVidx ].z;
					
					f2Vec.x = g.vertices[ leftBtm ].x - g.vertices[ waffleVidx ].x;
					f2Vec.y = g.vertices[ leftBtm ].y - g.vertices[ waffleVidx ].y;
					f2Vec.z = g.vertices[ leftBtm ].z - g.vertices[ waffleVidx ].z;
					
					// cross product
					
					normalVec.x = f1Vec.y * f2Vec.z - f1Vec.z * f2Vec.y;
					normalVec.y = f1Vec.z * f2Vec.x - f1Vec.x * f2Vec.z;
					normalVec.z = f1Vec.x * f2Vec.y - f1Vec.y * f2Vec.x;
					
					lenV = Math.sqrt( normalVec.x * normalVec.x + normalVec.y * normalVec.y + normalVec.z * normalVec.z  );
					
					//normalize
					
					normalVec.x = -g.waffleDeep( nj, ni, t ) * normalVec.x / lenV;
					normalVec.y = -g.waffleDeep( nj, ni, t ) * normalVec.y / lenV;
					normalVec.z = -g.waffleDeep( nj, ni, t ) * normalVec.z / lenV;
					
					// set vertex position
					
					g.vertices[ waffleVidx ].x += normalVec.x;
					g.vertices[ waffleVidx ].y += normalVec.y;
					g.vertices[ waffleVidx ].z += normalVec.z;
					
				}
			
			}
		
		}
	
	}
	
	if ( g.withBottom ) {
	
		topOffset = 1;
		x = 0;
		y = 0;
		z = 0;
		
		for ( var j = 0; j < circVertexCount; j ++ ) {
		
			x += g.vertices[ hvc * j ].x;
			y += g.vertices[ hvc * j ].y;
			z += g.vertices[ hvc * j ].z;
		  	
		}
		
		x  = x / circVertexCount;
		y  = y / circVertexCount;
		z  = z / circVertexCount;
		
		idx = g.circOpen ? hvc * rs + hss  :  hvc * rs;
		
		g.vertices[ idx ].set( x, y, z );	// set vertex position
		
	}
	
	if ( g.withTop ) {
	
		x = 0;
		y = 0;
		z = 0;
		
		for ( var j = 0; j < circVertexCount; j ++ ) {
		
			x += g.vertices[ hvc * j + hs ].x;
			y += g.vertices[ hvc * j + hs ].y;
			z += g.vertices[ hvc * j + hs ].z;
		  	
		}
		
		x  = x / circVertexCount;
		y  = y / circVertexCount;
		z  = z / circVertexCount;
		
		idx = g.circOpen ? hvc * rs + hss + topOffset  : hvc * rs + topOffset;
		
		g.vertices[ idx ].set( x, y, z );	// set vertex position
	
	}

}

function morphFaces( time ) {
	
  if ( !g.materialDefault ) {
  
  	var t = time !== undefined ? time : 0;
	
	g = this;
	
	var rs = g.radiusSegments;
	var hs = g.noCenterPoints ? g.heightSegments : g.centerPoints.length - 1;
	var hsMinFixed;
	var topOffset;
	
	if ( g.style !== "complete" ) { g.withBottom = false; g.withTop = false; g.circOpen = true; }
	
	g.groupsNeedUpdate = true; // to change materialIndex for MultiMaterial
	
	if ( !g.materialCoverDefault || !g.fixedMaterialDefault ) {
		
		if ( !g.waffled ) {
		
			hsMinFixed = hs - Math.min( hs, g.fixedMaterial.length );
			
			for ( var j = 0; j < rs ; j ++ ) {
				
				for ( var i = 0; i < hs; i ++ ) {
					
					// left top,
					
					g.faces[ 2 * hs * j + 2 * i + 1 ].materialIndex  = g.materialCover( j / rs , i / hs, t );	// by function
					
					if ( hsMinFixed <= i ) {
					
						if ( 2 * j < g.fixedMaterial[ hs - ( i + 1 ) ].length ) {
							
							if ( g.fixedMaterial[ hs - ( i + 1 ) ][ 2 * j ] !== "." )
								g.faces[ 2 * hs * j + 2 * i + 1 ].materialIndex = g.fixedMaterial[ hs - ( i + 1 ) ][ 2 * j ]; // overwrite by array
						}
						
					}
					
					// right bottom
					
					g.faces[ 2 * hs * j + 2 * i ].materialIndex  = g.materialCover( ( j + 0.5 ) / rs, i / hs, t ); // by function
					
					if ( hsMinFixed <= i ) {
						
						if ( 2 * j + 1 < g.fixedMaterial[ hs - ( i + 1 ) ].length ) {
							
							if ( g.fixedMaterial[ hs - ( i + 1 ) ][ 2 * j + 1 ] !== "." )
								g.faces[ 2 * hs * j + 2 * i ].materialIndex = g.fixedMaterial[ hs - ( i + 1 ) ][ 2 * j + 1 ]; // overwrite by array
							
						}
					
					}
				
				}
				
			}
			
		}
		
		if ( g.waffled ) {
			
			hsMinFixed = hs - Math.min( hs, 0.5 * g.fixedMaterial.length );
			
			for ( var j = 0; j < rs ; j ++ ) {
				
				if ( g.fixedMaterial.length % 2 !== 0 ) g.fixedMaterial.push( '.' );   // make length even
				
				for ( var i = 0; i < hs; i ++ ) {
					
					
					// bottom
					
					g.faces[ 4 * hs * j + 4 * i ].materialIndex  = g.materialCover( j / rs , i / hs, t );	// by function
					
					if ( hsMinFixed <= i ) {
						
						if ( 2 * j < g.fixedMaterial[ 2 * hs - ( 2 * i + 1 ) ].length ) {
							
							if ( g.fixedMaterial[ 2 * hs - ( 2 * i + 1 ) ][ 2 * j ] !== "." )
								g.faces[ 4 * hs * j + 4 * i + 0 ].materialIndex = g.fixedMaterial[ 2 * hs - ( 2 * i + 1 ) ][ 2 * j ]; // overwrite by array
						}
					
					}
					
					// left
					
					g.faces[ 4 * hs * j + 4 * i + 1 ].materialIndex  = g.materialCover( j / rs, ( i + 0.5 ) / hs, t );	// by function
					
					if ( hsMinFixed <= i ) {
					
						if ( 2 * j < g.fixedMaterial[ 2 * hs - ( 2 * i + 2 ) ].length ) {
							
							if ( g.fixedMaterial[ 2 * hs - ( 2 * i + 2 ) ][ 2 * j ] !== "." )
								g.faces[ 4 * hs * j +4  * i + 1 ].materialIndex = g.fixedMaterial[ 2 * hs - ( 2 * i + 2 ) ][ 2 * j ]; // overwrite by array
						}
					
					}
					
					// right
					
					g.faces[ 4 * hs * j + 4 * i + 2 ].materialIndex  = g.materialCover( ( j + 0.5 ) / rs, i / hs , t );	// by function
					
					if ( hsMinFixed <= i ) {
						
						if ( 2 * j + 1 < g.fixedMaterial[ 2 * hs - ( 2 * i + 1 ) ].length ) {
							
							if ( g.fixedMaterial[ 2 * hs - ( 2 * i + 1 ) ][ 2 * j + 1 ] !== "." )
								g.faces[ 4 * hs * j + 4 * i + 2 ].materialIndex = g.fixedMaterial[ 2 * hs - ( 2 * i + 1 ) ][ 2 * j + 1 ]; // overwrite by array
						}
					
					}
					
					// top
					
					g.faces[ 4 * hs * j + 4 * i + 3 ].materialIndex  = g.materialCover( ( j + 0.5 ) / rs, ( i + 0.5 ) / hs , t );	// by function
					
					if ( hsMinFixed <= i ) {
						
						if ( 2 * j + 1 < g.fixedMaterial[ 2 * hs - ( 2 * i + 2 ) ].length ) {
							
							if ( g.fixedMaterial[ 2 * hs - ( 2 * i + 2 ) ][ 2 * j + 1 ] !== "." )
								g.faces[ 4 * hs * j + 4 * i + 3 ].materialIndex = g.fixedMaterial[ 2 * hs - ( 2 * i + 2 ) ][ 2 * j + 1 ]; // overwrite by array
						}
					
					}
				
				}
			
			}
		
		}

	}
	
	if ( g.withBottom || g.withTop ) {
		
		topOffset = 0;
		
		if ( g.withBottom  && !g.materialBottomDefault ) {
			
			topOffset = 1;
			
			for ( var j = 0; j < rs ; j ++ ) {
				
				g.faces[ ( g.waffled ? 4 : 2 ) * hs * rs + j ].materialIndex  = g.materialBottom( j / rs , t );
			
			}
		
		}
		
		if ( g.withTop && !g.materialTopDefault ) {
			
			for ( var j = 0; j < rs ; j ++ ) {
				
				g.faces[ topOffset * rs + ( g.waffled ? 4 : 2 )* hs * rs + j ].materialIndex  = g.materialTop( j / rs , t );
			
			}
		
		}
	
	}
	
  }

}

function vertexNumbersHelper( mesh, size, color ) {	

	var vertexNumbers = []; 	
	var materialDigits = new THREE.LineBasicMaterial( { color: color } );
	var geometryDigit = [];
	var digit = [];
	var d100, d10, d1;		// digits							
	var coordDigit = [];	// design of the digits
	
	coordDigit[ 0 ] = [ 0,0, 0,9, 6,9, 6,0, 0,0 ];
	coordDigit[ 1 ] = [ 0,6, 3,9, 3,0 ];
	coordDigit[ 2 ] = [ 0,9, 6,9, 6,6, 0,0, 6,0 ];
	coordDigit[ 3 ] = [ 0,9, 6,9, 6,5, 3,5, 6,5, 6,0, 0,0 ];
	coordDigit[ 4 ] = [ 0,9, 0,5, 6,5, 3,5, 3,6, 3,0 ];
	coordDigit[ 5 ] = [ 6,9, 0,9, 0,5, 6,5, 6,0, 0,0 ];
	coordDigit[ 6 ] = [ 6,9, 0,9, 0,0, 6,0, 6,5, 0,5 ];
	coordDigit[ 7 ] = [ 0,9, 6,9, 6,6, 0,0 ];
	coordDigit[ 8 ] = [ 0,0, 0,9, 6,9, 6,5, 0,5, 6,5, 6,0, 0,0 ];
	coordDigit[ 9 ] = [ 6,5, 0,5, 0,9, 6,9, 6,0, 0,0 ];
	
	for ( var i = 0; i<10; i ++ ) {
		
		geometryDigit[ i ]  = new THREE.Geometry();
		
		for ( var j = 0; j < coordDigit[ i ].length/ 2; j ++ ) {
		
			geometryDigit[ i ].vertices.push( new THREE.Vector3( 0.1 * size * coordDigit[ i ][ 2 * j ], 0.1 * size * coordDigit[ i ][ 2 * j + 1 ], 0 ) );
		
		}
		
		digit[ i ] = new THREE.Line( geometryDigit[ i ], materialDigits );
	
	}
	
	// numbering the vertices, hundreds ...
	var i100 =  0;   
	var i10  =  0;   
	var i1   = -1;   
	
	for ( var i = 0; i < mesh.geometry.vertices.length ; i ++ ) {
	
		// Number on board, up to three digits are pinned there
		var board = new THREE.Mesh( new THREE.Geometry() );
		i1 ++;														// starts with  -1 + 1 = 0
		
		if ( i1   === 10 ) {i1   = 0; i10 ++ }
		if ( i10  === 10 ) {i10  = 0; i100 ++ }
		if ( i100 === 10 ) {i100 = 0 }								// hundreds (reset when overflow)
		
		if ( i100 > 0 ) {
			
			d100 = digit[ i100 ].clone();							// digit for hundreds
			board.add( d100 );										// on the board ...
			d100.position.x = -8 * 0.1 * size;						// ... move slightly to the left
		
		}
		
		if ( ( i100 > 0 ) || ( ( i100 === 0 ) && ( i10 > 0 ) ) ) {	// no preceding zeros tens
			
			d10 = digit[ i10 ].clone();								// digit for tenth
			board.add( d10 );										// on the board
		
		}
		
		d1 =   digit[ i1 ].clone();									// digit 
		board.add( d1 );											//  on the board ...
		d1.position.x = 8 * 0.1 * size;		 						// ... move slightly to the right
		
		vertexNumbers.push( board );								// place the table in the numbering data field
		mesh.add( vertexNumbers[ i ] );
	
	}
	
	this.update = function () {
	
		for( var n = 0; n < vertexNumbers.length; n ++ ) {
		
			vertexNumbers[ n ].position.set( mesh.geometry.vertices[ n ].x, mesh.geometry.vertices[ n ].y, mesh.geometry.vertices[ n ].z ); 
			vertexNumbers[ n ].lookAt( camera.position ); 
			
		}
	}
	
}

exports.createMorphGeometry =	createMorphGeometry;
exports.createVertices = 		createVertices;
exports.createFaces =			createFaces;
exports.morphVertices =			morphVertices;
exports.morphFaces =			morphFaces;

exports.vertexNumbersHelper =	vertexNumbersHelper;

Object.defineProperty(exports, '__esModule', { value: true });

})));