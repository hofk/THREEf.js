// THREEf.module.js ( r147.0 )

/**
 * @author hofk / http://sandbox.threejs.hofk.de/
*/

import {

    BufferGeometry, BufferAttribute, Mesh, Line, DynamicDrawUsage, LineBasicMaterial
	 
} from '../jsm/three.module.147.js';

let g;	//  BufferGeometry

function createMorphGeometry( p ) {
 
/*	parameter overview	--- all parameters are optional ---

p = {

		// simple properties
		
	indexed,		// indexed or non indexed BufferGeometry
	radius,			// reference radius, multiplier for functions
	height,			// reference height, multiplier for functions
	radiusSegments,	// radius segments (number)
	heightSegments,	// height segments (number)
	circOpen,		// circular connected or disconnected (see quadLine)
	withTop,		// with a top
	fixedMatTop,	// fixed given material index (string of digits for faces), overrides materialTop values
	withBottom,		// with a bottom
	fixedMatBottom,	// fixed given material index (string of digits for faces), overrides materialBottom values
	waffled,		// four faces / segment, with center vertex
	quadLine,		// separate quad line, only aviable when circular open
	quadColor,		// color of quad line
	style,			// 'map', 'cover', 'complete'
	explodemode,	// 'center','normal'
			
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
	explode,		// 	function ( t )		// factor for exploded view (only non indexed BufferGeometry)
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
	
	g = this;  // this is a   BufferGeometry() - the base geometry objects from three.js
	
	g.noCenterPoints = p.centerPoints === undefined ? true : false;
	
	g.explodeDefault = p.explode === undefined ? true : false;
	
	g.centerXdefault = p.centerX === undefined ? true : false;
	g.centerYdefault = p.centerY === undefined ? true : false;
	g.centerZdefault = p.centerZ === undefined ? true : false;
	
	g.materialTopDefault = p.materialTop === undefined ? true : false;
	g.materialBottomDefault = p.materialBottom === undefined ? true : false;
	g.materialCoverDefault = p.materialCover === undefined ? true : false;
	g.fixedMaterialDefault = p.fixedMaterial === undefined ? true : false;
	g.materialDefault = g.materialTopDefault && g.materialBottomDefault && g.materialCoverDefault && g.fixedMaterialDefault;
	
	//...................................................................... set defaults
	
	g.indexed = 		p.indexed			!== undefined ? p.indexed			: true;
	g.radius = 			p.radius			!== undefined ? p.radius			: 16;
	g.height =			p.height			!== undefined ? p.height			: 100;
	g.radiusSegments =	p.radiusSegments	!== undefined ? p.radiusSegments	: 10;
	g.heightSegments =	p.heightSegments	!== undefined ? p.heightSegments	: 10; 
	g.circOpen =		p.circOpen			!== undefined ? p.circOpen			: false; // is automatic set true if quadLine
	g.withTop =			p.withTop			!== undefined ? p.withTop			: false;
	g.fixedMatTop =		p.fixedMatTop		!== undefined ? p.fixedMatTop		: ""; 
	g.withBottom =		p.withBottom		!== undefined ? p.withBottom		: false;
	g.fixedMatBottom =	p.fixedMatBottom	!== undefined ? p.fixedMatBottom	: "";
	g.waffled =			p.waffled			!== undefined ? p.waffled			: false;
	g.quadLine = 		p.quadLine			!== undefined ? p.quadLine			: false;
	if ( g.quadLine ) g.circOpen = true; 				// quad line is only aviable when circular open
	g.quadColor = 		p.quadColor			!== undefined ? p.quadColor			: 0x000000;
	g.style =			p.style				!== undefined ? p.style				: 'complete';
	g.explodemode =		p.explodemode 		!== undefined ? p.explodemode		: 'center';
	g.rCircHeight =		p.rCircHeight		!== undefined ? p.rCircHeight		: function ( u, v, t ) { return 1 };
	g.centerX =			p.centerX			!== undefined ? p.centerX			: function ( v, t ) { return 0 };
	g.centerY =			p.centerY			!== undefined ? p.centerY			: function ( v, t ) { return v };
	g.centerZ =			p.centerZ			!== undefined ? p.centerZ			: function ( v, t ) { return 0 };
	g.unrollCover =		p.unrollCover		!== undefined ? p.unrollCover 		: function ( v, t ) { return 0 };
	g.waffleDeep =		p.waffleDeep		!== undefined ? p.waffleDeep		: function ( u, v, t ) { return 0 };
	g.moveX =			p.moveX				!== undefined ? p.moveX				: function ( u, v, t ) { return 0 };
	g.moveY =			p.moveY				!== undefined ? p.moveY				: function ( u, v, t ) { return 0 };
	g.moveZ =			p.moveZ				!== undefined ? p.moveZ				: function ( u, v, t ) { return 0 };
	g.explode = 		p.explode			!== undefined ? p.explode			: function ( t ) { return 0 };
	g.endCircAngle =	p.endCircAngle		!== undefined ? p.endCircAngle		: function ( v, t ) { return 1 };
	g.startCircAngle =	p.startCircAngle	!== undefined ? p.startCircAngle	: function ( v, t ) { return 0 };
	g.scaleCircAngle =	p.scaleCircAngle	!== undefined ? p.scaleCircAngle	: function ( u, t ) { return u };
	g.topHeight =		p.topHeight			!== undefined ? p.topHeight			: function ( u, t ) { return 1 };
	g.bottomHeight =	p.bottomHeight		!== undefined ? p.bottomHeight		: function ( u, t ) { return 0 };
	g.scaleHeight =		p.scaleHeight		!== undefined ? p.scaleHeight		: function ( v, t ) { return v };
	
	// When using multi material:
	// Take index 0 for invisible faces like MeshBasicMaterial( { visible: false } ),
	// or use transparent faces like MeshBasicMaterial( {transparent: true, opacity: 0.05 } )
	
	// Please note!	The functions normally should have results from 0 to 1. If the multimaterial array
	// contains fewer materials than the functional result * 10 or highest digit in fixedMatBottom / fixedMatTop
	// the script will crash. Even if the result is negative.
	
	g.materialCover = function() { return 1 };	// default material index is 0.1 * 10 = 1
	g.materialBottom = function() { return 1 }; // can be overwritten by fixedMatBottom (string of digits for faces)
	g.materialTop =	function() { return 1 };	// can be overwritten by fixedMatTop (string of digits for faces)
	
	if ( p.materialCover !== undefined ) g.materialCover = function ( u, v, t ) { return  Math.floor( 10 * p.materialCover( u, v, t ) ) };
	if ( p.materialBottom !== undefined ) g.materialBottom = function ( u, t ) { return  Math.floor( 10 * p.materialBottom( u, t ) ) };
	if ( p.materialTop !== undefined ) g.materialTop = function ( u, t ) { return  Math.floor( 10 * p.materialTop( u, t ) ) };
	
	// Please note!
	// If the multimaterial array contains fewer materials than the highest number in fixed material, the script will crash.
	// String array fixedMaterial contains strings of digits 0 to 9, for instance [ '0011..997741', '22.2.200' ].
	// Every string represents a corresponding row of faces from left-top from cover. The dot is the placeholder for unchanged faces!
	// It's not necessary, that the length of array / strings equals the number of faces, e.g. only ['1'] is sufficient.
	
	g.fixedMaterial = p.fixedMaterial !== undefined ? p.fixedMaterial : []; // default is empty
	
	// array of center points replaces heightSegments, scaleHeight and the center functions centerX, centerY, centerZ
	
	g.centerPoints  = g.noCenterPoints ? [] : p.centerPoints; // default is empty
		
	//..............................................................................................
	
	g.create =	create;
	g.morphVertices	=	morphVertices;
	g.morphFaces =		morphFaces;
	
	g.create();
	g.morphVertices();
	
	if ( !g.materialDefault ) {
	
		g.morphFaces();
	
	}
	
}

function create() {
	
	g = this;
	
	if ( g.style !== "complete" ) { g.withBottom = false; g.withTop = false; g.circOpen = true; }
	
	var rs = g.radiusSegments;
	var rss = rs + 1;
	var hs = g.noCenterPoints ? g.heightSegments : g.centerPoints.length - 1;
	var hss	= hs + 1;
	var hvc	= g.waffled ? hss + hs : hss;   // height vertex count
	
	var nj;					// relative radius segment (circular)
	var nj1;				// next relative radius segment
	var ni;					// relative height segment
	var ni1;				// next relative height segment
	var x, x1, xC;			// coordinates	
	var y, y1, yC;
	var uX, uX1;	
	var uZ, uZ1;
	var topOffset;
	
	var a;					// vertices (index)
	var b1, b2, b3, b4;
	var c1, c2, c3, c4;	

	if ( g.indexed ) {
	
		var vIdx;				// vertex index
		var waffleVidx; 		// waffle vertex index	
		var circVertexCount = g.circOpen ? rss : rs;
	
		var vertexCount = hvc * rs + hss;	
		vertexCount += g.withBottom ? 1 + rss : 0;
		vertexCount += g.withTop ? 1 + rss : 0;
		
		var fps = g.waffled ? 4 : 2; // faces per segment
		
		var faceCount =  hs * rs * fps;
		faceCount += g.withBottom ? rs : 0;
		faceCount += g.withTop ? rs : 0;
		
		var idxCount = 0;
		
		function uvCoordinatesBottomTop() {
	
			uX =  0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
			// uX1 = 0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) ); // not required for indexed
			uZ =  0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
			// uZ1 = 0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) ); // not required for indexed
		
		}
		
		g.faceIndices = new Uint32Array( faceCount * 3 );
		g.vertices = new Float32Array( vertexCount * 3 );  
		g.normals = new Float32Array( vertexCount * 3 ); 
		g.uvs = new Float32Array( vertexCount * 2 ); // uvs to vertices	
		
		g.setIndex( new  BufferAttribute( g.faceIndices, 1 ) );	
		g.setAttribute( 'position', new BufferAttribute( g.vertices, 3 ).setUsage( DynamicDrawUsage ) );
		g.setAttribute( 'normal', new BufferAttribute( g.normals, 3 ).setUsage( DynamicDrawUsage ) );
		g.setAttribute( 'uv', new BufferAttribute( g.uvs, 2 ) );
		
		if ( g.quadLine ) {
			
			g.lineGeometry = new BufferGeometry();
			g.quadLine = new Line( g.lineGeometry, new LineBasicMaterial( { color: g.quadColor } ) );
			
			g.linePositions = new Float32Array(  2 * hss * rss * 3 );
			g.lineGeometry.setAttribute( 'position', new BufferAttribute( g.linePositions, 3 ) );
			
		}	
		
		g.vertexFaces = [];		// needed to calculate the normals
		
		if ( !g.waffled ) {
	
			for ( var j = 0; j < rs; j ++ ) {
				
				//uvCoordinatesX();
				
				for ( var i = 0; i < hs; i ++ ) {
					
					// 2 faces / segment,  3 vertex indices
					a =  hvc * j + i;
					b1 = hvc * ( j + 1 ) + i;		// right-bottom
					c1 = hvc * ( j + 1 ) + 1 + i;
					b2 = hvc * ( j + 1 ) + 1 + i;	// left-top
					c2 = hvc * j + 1 + i;
					
					g.faceIndices[ idxCount	 ] = a; // right-bottom
					g.faceIndices[ idxCount + 1 ] = b1;
					g.faceIndices[ idxCount + 2 ] = c1; 
					
					g.faceIndices[ idxCount + 3 ] = a; // left-top
					g.faceIndices[ idxCount + 4 ] = b2,
					g.faceIndices[ idxCount + 5 ] = c2; 
					
					idxCount += 6;
					
				}
				
			}
			
			// faces to vertex
			
			for ( var j = 0; j < rss; j ++ ) {
				
				for ( var i = 0; i < hss; i ++ ) {
					
					//vIdx =  hvc * j + i;	// vertex index
					fLeft = 2 * ( ( j - 1 ) * hs + i ); // face indices left
					fLeftPos = fLeft * 3;
					fRight = 2 * ( j * hs + i );		// face indices right
					fRightPos = fRight * 3;
					
					vFace = [];
					
					if  ( !g.circOpen && j === 0  ) {
					
						// connect face
						
						fIdx = ( ( rs - 1 ) * hs  + i ) * 2;
						
						if ( i < hs ) {
							
							vFace.push( fIdx * 3 );
							if ( i === 0 ) vFace.push( fIdx * 3 ); // face double (equal number left and right) 
							
						}
						
						if ( i > 0 ) { 
							
							vFace.push( ( fIdx - 1 ) * 3 );
							vFace.push( ( fIdx - 2 ) * 3 );
							
						}
						
					}
					
					if  ( !g.circOpen && j === rs  ) {
						
						// connect face
						
						fIdx = i * 2;
						
						if ( i < hs ) {
						
							vFace.push( fIdx * 3 );
							vFace.push( ( fIdx + 1 ) * 3 );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( ( fIdx - 1 ) * 3 );
							if ( i === hs ) vFace.push( ( fIdx - 1 ) * 3 ); // face double (equal number left and right) 
							
						}	
						
					}
					
					if  (  j > 0 ) {
						
						if ( i < hs ) {
							
							vFace.push(  fLeftPos );
							if ( i === 0 && ( !g.circOpen || ( g.circOpen && j !== rs ) ) ) vFace.push( fLeftPos ); // face double (equal number left and right)
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fLeftPos - 3 );
							vFace.push( fLeftPos - 6 );
							
						}
						
					}
					
					if	( j < rs ) {
					
						if ( i < hs ) { 
							
							vFace.push( fRightPos );
							vFace.push( fRightPos + 3 ); 
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fRightPos - 3 );
							if ( i === hs && ( !g.circOpen || ( g.circOpen && j !== 0 ) ) ) vFace.push( fRightPos - 3 ); // face double (equal number left and right)
							
						}
						
					}
					
					if ( i === 0 && g.withBottom ) {
						
						fIdx = hs * rs * 2 + j;
						
						if ( !g.circOpen && j === 0  ) vFace.push( ( fIdx + rs - 1  ) * 3 ); 
						
						if ( !g.circOpen && j === rs ) vFace.push( ( fIdx - rs ) * 3 ); 
						
						if ( j < rs ) vFace.push( fIdx * 3 );
						
						if ( j > 0  ) vFace.push( ( fIdx - 1 ) * 3 );
					}
						
					if ( i === hs && g.withTop ) {
						
						fIdx =  hs * rs * 2 + ( g.withBottom ? rs : 0 ) + j; 
						
						if (  !g.circOpen  && j === 0 ) vFace.push( ( fIdx + rs - 1 ) * 3 );
						
						if ( !g.circOpen && j === rs ) vFace.push( ( fIdx - rs ) * 3 ); 
						
						if ( j < rs ) vFace.push( fIdx * 3 );
						
						if ( j > 0 ) vFace.push( ( fIdx - 1 ) * 3 );
						
					}
					
					g.vertexFaces.push( vFace );
					
				}
				
			}
			
		}
		
		if ( g.waffled ) {
			
			for ( var j = 0; j < rs; j ++ ) {
			
				//uvCoordinatesX();
				//xC = 0.5 * ( x + x1 );
				
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
					
					g.faceIndices[ idxCount] = a;		// bottom
					g.faceIndices[ idxCount + 1 ] = b1;
					g.faceIndices[ idxCount + 2 ] = c1; 
					
					g.faceIndices[ idxCount + 3 ] =  a; // left
					g.faceIndices[ idxCount + 4 ] =  b2,
					g.faceIndices[ idxCount + 5 ] =  c2; 
					
					g.faceIndices[ idxCount + 6 ] = a;	// right
					g.faceIndices[ idxCount + 7 ] = b3;
					g.faceIndices[ idxCount + 8 ] = c3; 
					
					g.faceIndices[ idxCount + 9 ] =  a; // top
					g.faceIndices[ idxCount + 10 ] =  b4,
					g.faceIndices[ idxCount + 11 ] =  c4;
					
					idxCount += 12;
					
				}
				
			}
			
			// faces to vertex
			
			for ( var j = 0; j < rss; j ++ ) {
			
				for ( var i = 0; i < hss; i ++ ) {
						
					// vIdx =  hvc * j + i;	// vertex index
					fLeft = 4 * ( ( j - 1 ) * hs + i ); // face indices left
					fLeftPos = fLeft * 3;
					fRight = 4 * ( j * hs + i );		// face indices right
					fRightPos = fRight * 3;
					
					vFace = [];
					
					if  ( !g.circOpen && j === 0 ) {
					
						// connect face
						
						fIdx = ( ( rs - 1 ) * hs + i ) * 4; 
						
						if ( i < hs ) {
							
							vFace.push( fIdx * 3 );
							vFace.push( ( fIdx + 2 ) * 3 );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( ( fIdx - 1 ) * 3 );
							vFace.push( ( fIdx - 2 ) * 3 ); 
							
						}
						
					}
					
					if  ( !g.circOpen && j === rs  ) {
						
						// connect face
						
						fIdx = i * 4;
						
						if ( i < hs ) {
							
							vFace.push( fIdx * 3 );
							vFace.push( ( fIdx + 1 ) * 3 );
					
						}
						
						if ( i > 0 ) {
							
							vFace.push( ( fIdx - 1 ) * 3 );
							vFace.push( ( fIdx - 3 ) * 3 ); 
							
						}
						
					}
					
					if  ( j > 0 ) {
						
						if ( i < hs ) { 
							
							vFace.push( fLeftPos );
							vFace.push( fLeftPos + 6 );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fLeftPos - 3 );
							vFace.push( fLeftPos - 6 );
							
						}
						
					}
				
					if	( j < rs ) {
						
						if ( i < hs ) {
							
							vFace.push( fRightPos + 3 );
							vFace.push( fRightPos );
							
						}
						
						if ( i > 0 ) {
						
							vFace.push( fRightPos - 3 );
							vFace.push( fRightPos - 9 );
							
						}
						
					}
					
					if ( i === 0 && g.withBottom ) {
					
						fIdx =  hs * rs * 4 + j;
						
						if ( !g.circOpen && j === 0 ) vFace.push( ( fIdx + rs - 1 ) * 3 ); 
						
						if ( !g.circOpen && j === rs ) vFace.push( ( fIdx - rs ) * 3 ); 
						
						if ( j < rs ) vFace.push( fIdx * 3 );
						
						if ( j > 0  ) vFace.push( ( fIdx - 1 ) * 3 ); 
						
					}
					
					if ( i === hs && g.withTop ) {
						
						fIdx = hs * rs * 4 + ( g.withBottom ? rs : 0 ) + j;
						
						if ( !g.circOpen  && j === 0 ) vFace.push( ( fIdx + rs - 1 ) * 3 ); 
						
						if ( !g.circOpen && j === rs ) vFace.push( ( fIdx - rs ) * 3 ); 
						
						if ( j < rs ) vFace.push( fIdx * 3 );
						
						if ( j > 0 ) vFace.push( ( fIdx - 1 ) * 3  );
						 
					}
					
					g.vertexFaces.push( vFace );
					
				}
				
				// waffle vertices with four faces
				
				if ( j < rs ) {
					
					for ( var i = 0; i < hs; i ++ ) {
					
						vFace = []; 
						
						// fIdx = ( j * hs + i ) * 4; // face index
						fPos = ( j * hs + i ) * 12 // fIdx * 3
						
						vFace.push( fPos );
						vFace.push( fPos + 3 );
						vFace.push( fPos + 6 );
						vFace.push( fPos + 9 );
						
						g.vertexFaces.push( vFace );
						
					}
					
				}
				
			}
			
		}
		
		if ( g.withBottom || g.withTop ) {
			
			topOffset = 0;
			
			if ( g.withBottom ) {
				
				topOffset = 1 + rss;
				
				a = hvc * rs + hss;  // from center a
				
				for ( var j = 0; j < rs; j ++ ) {
					
					b1 = a + j + 2;
					c1 = a + j + 1;
					
					g.faceIndices[ idxCount ] = a;
					g.faceIndices[ idxCount + 1 ] = b1;
					g.faceIndices[ idxCount + 2 ] = c1; 
					
					idxCount += 3;
					
				}
				
				// faces to center vertex
				
				vFace = []; 
				
				for ( var j = 0; j < rs; j ++ ) {
					
					vFace.push( (  hs * rs * fps + j ) * 3 );
					
				}
				
				g.vertexFaces.push( vFace );
				
				// faces to edge-vertices
				
				for ( var j = 0; j < rss; j ++ ) {
					
					vFace = []; 
					
					if ( j === 0  && !g.circOpen ) vFace.push( ( hs * rs * fps + rs - 1 ) * 3 );
					if ( j === rs  && !g.circOpen ) vFace.push( hs * rs * fps * 3 );
					if ( j > 0 ) vFace.push( ( hs * rs * fps + j - 1 ) * 3 );
					if ( j < rs ) vFace.push( ( hs * rs * fps + j ) * 3 );
					
					if ( !g.waffled ) {
						
						if ( !g.circOpen && j === 0 ) {
							
							vFace.push(  hs * ( rs - 1) * 2 * 3 );
							vFace.push(  hs * ( rs - 1) * 2 * 3 ); // face double (equal number left and right)
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							vFace.push( 0 );
							vFace.push( 3 );
							vFace.push(  hs * ( rs - 1) * 2 * 3 ); // face double (equal number left and right)
							
						}
						
						if ( j > 0 ) {
							
							vFace.push(  hs * ( j - 1 ) * 2 * 3 );
							if ( j !== rs ) vFace.push(  hs * ( j - 1 ) * 2 * 3 ); // face double (equal number left and right)
							
						}
						
						if ( j < rs ) {
							
							vFace.push( hs * j * 2 * 3 );
							vFace.push( ( hs * j * 2 + 1 ) * 3 );
							
						}
						
					}
					
					if ( g.waffled ) { 
						
						if ( !g.circOpen && j === 0 ) {
							
							vFace.push( hs * ( rs - 1 ) * 4 * 3 );
							vFace.push( ( hs * ( rs - 1 ) * 4 + 2 ) * 3 );
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							vFace.push( 0 );
							vFace.push( 3 );
							
						}
						
						if ( j > 0 ) {
							
							vFace.push( hs * ( j - 1 ) * 4 * 3 );
							vFace.push( ( hs * ( j - 1 ) * 4 + 2 ) * 3 );
							
						}
						
						if ( j < rs ) {
							
							vFace.push( hs * j * 4 * 3 );
							vFace.push( ( hs * j * 4 + 1 ) * 3 );
							
						}
						
					}
					
					g.vertexFaces.push( vFace ); 
					
				}
				
			}
			
			if ( g.withTop ) {
			
				a = hvc * rs + hss + topOffset ;   // from center a
				
				for ( var j = 0; j < rs; j ++ ) {
					
					b1 = a + j + 1;
					c1 = a + j + 2;
					
					g.faceIndices[ idxCount ] = a;
					g.faceIndices[ idxCount + 1 ] = b1;
					g.faceIndices[ idxCount + 2 ] = c1; 
					
					idxCount += 3;
					
				}
				
				// faces to center vertex	
				
				vFace = []; 
				
				for ( var j = 0; j < rs; j ++ ) {
					
					vFace.push( ( hs * rs * fps + ( g.withBottom ? rs : 0 ) + j ) * 3 );
					
				}
				
				g.vertexFaces.push( vFace );
				
				// faces to edge-vertices
				
				for ( var j = 0; j < rss; j ++ ) {
					
					vFace = []; 
					
					if ( j === 0  && !g.circOpen ) vFace.push( ( hs * rs * fps + ( g.withBottom ? rs : 0 ) + rs - 1 ) * 3 );
					if ( j === rs  && !g.circOpen ) vFace.push( ( hs * rs * fps + ( g.withBottom ? rs : 0 ) ) * 3 );
					if ( j > 0 ) vFace.push( ( hs * rs * fps + ( g.withBottom ? rs : 0 ) + j - 1 ) * 3 );
					if ( j < rs ) vFace.push( ( hs * rs * fps + ( g.withBottom ? rs : 0 ) + j ) * 3 );
					
					if ( !g.waffled ) {
						
						if ( !g.circOpen && j === 0 ) {
							
							vFace.push( ( hs * rs * 2 - 2 ) * 3 );
							vFace.push( ( hs * rs * 2 - 1 ) * 3 ); 
							vFace.push( (hs * 2 - 1 )* 3 ); // face double (equal number left and right)
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							vFace.push( ( hs * 2 - 1 ) * 3 );
							vFace.push( ( hs * 2 - 1 ) * 3 ); // face double (equal number left and right)
							
						}
						
						if ( j > 0 ) {
							
							vFace.push( ( hs * j * 2  - 2  ) * 3 );
							vFace.push( ( hs * j * 2  - 1  ) * 3 );
							
						}
						
						if ( j < rs ) {
							
							vFace.push( ( hs * ( j + 1 ) * 2 - 1 ) * 3 );
							if ( j !== 0 ) vFace.push( ( hs * ( j + 1 ) * 2 - 1 ) * 3 ); // face double (equal number left and right)
							
						}
						
						
					}
					
					if ( g.waffled ) { 
						
						if ( !g.circOpen && j === 0 ) {
							
							vFace.push( ( hs * rs * 4 - 1 ) * 3 );
							vFace.push( ( hs * rs * 4 - 2 ) * 3 );
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							vFace.push( ( hs * 4 - 1 ) * 3 );
							vFace.push( ( hs * 4 - 3 ) * 3 );
						
						}
						
						if ( j > 0 ) {
							
							vFace.push( ( hs * j * 4 - 1 ) * 3 );
							vFace.push( ( hs * j * 4 - 2 ) * 3 );
							
						}
						
						if ( j < rs ) {
							
							vFace.push( ( hs * ( j + 1 ) * 4 - 1 ) * 3 );
							vFace.push( ( hs * ( j + 1 ) * 4 - 3 ) * 3 );
							
						}
					
					}
					
					g.vertexFaces.push( vFace );
					
				}
				
			}
			
		}
		
		// write uv buffer array cover
		
		for ( var j = 0; j < rss; j ++ ) {
			
			for ( var i = 0; i < hss; i ++ ) {
				
				vIdx = hvc * j + i;	// vertex index
				
				g.uvs[ vIdx * 2 ] = g.scaleCircAngle( j / rs );
				g.uvs[ vIdx * 2 + 1 ] = g.scaleHeight( i / hs );
				
			}
			
		}
		
		// write uv buffer array waffle points
		
		if ( g.waffled ) {
			
			for ( var j = 0; j < rs; j ++ ) {
			
				for ( var i = 0; i < hs; i ++ ) {
					
					waffleVidx = hvc * j + i + hss; // waffle-vertex index
					
					g.uvs[ waffleVidx * 2 ] = g.scaleCircAngle( ( j + 0.5 ) / rs );
					g.uvs[ waffleVidx * 2 + 1 ] = g.scaleHeight( ( i + 0.5 ) / hs );
					
				}
				
			}
			
		}
		
		// write uv buffer array bottom / top
		
		if ( g.withBottom || g.withTop ) {
			
			topOffset = 0;
			
			if ( g.withBottom ) {
				
				topOffset = 1 + rss;
				
				vIdx = hvc * rs  + hss;  // center bottom
				
				g.uvs[ vIdx * 2 ] = 0.5;
				g.uvs[ vIdx * 2 + 1 ] = 0.5;
				
				for ( var j = 0; j < rss; j ++ ) { 
					
					vIdx = hvc * rs  + hss + 1 + j; // vertex index
					
					nj  = 1 - j / rs;
					uvCoordinatesBottomTop();
					
					g.uvs[ vIdx * 2 ] = uX;
					g.uvs[ vIdx * 2 + 1 ] = uZ;
					
				}
				
			}
		
			if ( g.withTop ) {
				
				vIdx = hvc * rs  + hss + topOffset; // center top
				
				g.uvs[ vIdx * 2 ] = 0.5;
				g.uvs[ vIdx * 2 + 1 ] = 0.5;
				
				for ( var j = 0; j < rss; j ++ ) { 
					
					vIdx = hvc * rs  + hss + topOffset + 1 + j; // vertex index
					
					nj  = j / rs;
					uvCoordinatesBottomTop();
					
					g.uvs[ vIdx * 2 ] = uX;
					g.uvs[ vIdx * 2 + 1 ] = uZ;
					
				}
				
			}
			
		}
		
		// write groups for multi material
		
		for ( var f = 0, p = 0; f < faceCount; f ++, p += 3 ) {
			
			g.addGroup( p, 3, 1 ); // default material index is 0.1 * 10 = 1
			
		}
		
	}
	
	if ( !g.indexed ) {
	
		var fLeft;				// face left (index)
		var fLeftPos;
		var fRight;				// face right (index)
		var fRightPos;
		var fIdx;				// face index
		var fPos 
		var vIdx;				// vertex index
		var waffleVidx; 		// waffle vertex index
		var uvIdx;				// uv index
		
		var circVertexCount = g.circOpen ? rss : rs;
		
		var fps = g.waffled ? 4 : 2; // faces per segment
		
		var faceCount = hs * rs * fps;
		faceCount += g.withBottom ? rs : 0;
		faceCount += g.withTop ? rs : 0;
		
		function uvCoordinatesBottomTop() {
	
			uX =  0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
			uX1 = 0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) );
			uZ =  0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
			uZ1 = 0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) );
		
		}
		
		g.positions = new Float32Array( faceCount * 9 );
		g.normals = new Float32Array( faceCount * 9 );
		g.uvs = new Float32Array( faceCount * 6 );  // uv's to positions
		
		g.setAttribute( 'position', new BufferAttribute( g.positions, 3 ).setUsage( DynamicDrawUsage) );
		g.setAttribute( 'normal', new BufferAttribute( g.normals, 3 ).setUsage( DynamicDrawUsage) );
		g.setAttribute( 'uv', new BufferAttribute( g.uvs, 2 ) ); 
		
		if ( g.quadLine ) {
			
			g.lineGeometry = new BufferGeometry();
			g.quadLine = new Line( g.lineGeometry, new LineBasicMaterial( { color: g.quadColor } ) );
			
			g.linePositions = new Float32Array(  2 * hss * rss * 3 );
			g.lineGeometry.setAttribute( 'position', new BufferAttribute( g.linePositions, 3 ) );
			
		}	
		
		g.vertexFaces = [];		// needed to calculate the normals
		g.vertexPositions = [];
		
		var vFace = [];
		var vPos = [];
		
		// const a = 0; //  position index offset, triangle corners a, b, c
		const b = 3;
		const c = 6;
		
		if ( !g.waffled ) {
			
			for ( var j = 0; j < rss; j ++ ) {
				
				for ( var i = 0; i < hss; i ++ ) {
					
					//vIdx =  hvc * j + i;	// vertex index
					fLeft = 2 * ( ( j - 1 ) * hs + i ); // face indices left
					fLeftPos = fLeft * 9;
					fRight = 2 * ( j * hs + i );		// face indices right
					fRightPos = fRight * 9;
					
					vFace = [];
					vPos = [];
					
					if ( !g.circOpen && j === 0 ) {
						
						// connect face / positions on the far right are identical
						
						fIdx = ( ( rs - 1 ) * hs  + i ) * 2;
						
						if ( i < hs ) {
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							if ( i === 0 ) vFace.push( fPos  ); // face double (equal number left and right)
							vPos.push( fPos + b );
							
						}
						
						if ( i > 0 ) { 
							
							fPos = ( fIdx - 1 ) * 9
							
							vFace.push( fPos );
							vPos.push( fPos + b );
							
							fPos = ( fIdx - 2 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
						}
						
					}
					
					if ( !g.circOpen && j === rs ) {
						
						// connect face
						
						// fIdx = i * 2;
						fPos = i * 2 * 9;
						
						if ( i < hs ) {
							
							vFace.push( fPos );
							vPos.push(  fPos );
							
							vFace.push( fPos + 9 );
							vPos.push(  fPos + 9 );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fPos - 9 );
							if ( i === hs ) vFace.push( fPos - 9 ); // face double (equal number left and right)
							vPos.push( fPos - 9 + c );
							
						}
						
					}
					
					if  (  j > 0 ) {
						
						if ( i < hs ) {
							
							vFace.push(  fLeftPos );
							if ( i === 0 && ( !g.circOpen || ( g.circOpen && j !== rs ) ) ) vFace.push( fLeftPos );
							vPos.push( fLeftPos + b );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fLeftPos - 9 );
							vPos.push( fLeftPos - 9 + b );
							
							vFace.push( fLeftPos - 18 );
							vPos.push( fLeftPos - 18 + c );
							
						}
						
					}
					
					if	( j < rs ) {
						
						if ( i < hs ) { 
							
							vFace.push( fRightPos );
							vPos.push( fRightPos );
							
							vFace.push( fRightPos + 9 ); 
							vPos.push( fRightPos + 9 );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fRightPos - 9 );
							if ( i === hs && ( !g.circOpen || ( g.circOpen && j !== 0 ) ) ) vFace.push( fRightPos - 9 ); // face double (equal number left and right)
							vPos.push( fRightPos - 9 + c );
							
						}
						
					}
					
					if ( i === 0 && g.withBottom ) {
						
						fIdx = hs * rs * 2 + j;
						
						if ( !g.circOpen && j === 0  ) {  
							
							fPos = ( fIdx + rs - 1  ) * 9;
							
							vFace.push( fPos ); 
							vPos.push( fPos + b ); // position far right is identical
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							fPos = ( fIdx - rs ) * 9;
							
							vFace.push( fPos ); 
							
						}
						
						if ( j < rs ) {
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
						}
						
						if (  j > 0 ) {  
							
							fPos = ( fIdx - 1 ) * 9; 
							
							vFace.push( fPos ); 
							vPos.push( fPos + b ); 
							
						}
						
					}
					
					if ( i === hs && g.withTop ) {
						
						fIdx =  hs * rs * 2 + ( g.withBottom ? rs : 0 ) + j; 
						
						if ( !g.circOpen && j === 0 ) {
							
							fPos = ( fIdx + rs - 1 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c ); // position far right is identical
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							fPos = ( fIdx - rs ) * 9;
							
							vFace.push( fPos );
							
						}
						
						if ( j < rs ) {
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + b );
							
						}
						
						if ( j > 0 ) {
							
							fPos = ( fIdx - 1 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
						}
					}
					
					g.vertexFaces.push( vFace );
					g.vertexPositions.push( vPos );
					
				}
				
			}
			
		}
		
		if ( g.waffled ) {
			
			for ( var j = 0; j < rss; j ++ ) {
				
				for ( var i = 0; i < hss; i ++ ) {
					
					// vIdx =  hvc * j + i;	// vertex index
					fLeft = 4 * ( ( j - 1 ) * hs + i ); // face indices left
					fLeftPos = fLeft * 9;
					fRight = 4 * ( j * hs + i );		// face indices right
					fRightPos = fRight * 9;
					
					vFace = [];
					vPos = [];
					
					if  ( !g.circOpen && j === 0 ) {
						
						// connect face / positions on the far right are identical
						
						fIdx = ( ( rs - 1 ) * hs + i ) * 4; 
						
						if ( i < hs ) {
							
							fPos = fIdx * 9; 
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
							fPos = ( fIdx + 2 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + b );
							
						}
						
						if ( i > 0 ) {
							
							fPos = ( fIdx - 1 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + b );
							
							fPos = ( fIdx - 2 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
						}
						
					}
					
					if ( !g.circOpen && j === rs ) {
					
						// connect face
						
						// fIdx = i * 4;
						fPos = i * 4 * 9;
					
						if ( i < hs ) { 
							
							vFace.push( fPos );	
							vPos.push( fPos + b );
							
							vFace.push( fPos + 9 );	
							vPos.push( fPos + 9 + c );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fPos - 9 );	
							vPos.push( fPos - 9 + c );
							
							vFace.push( fPos - 27 );
							vPos.push( fPos - 27 + b );
							
						}
						
					}
					
					if ( j > 0 ) {
						
						if ( i < hs ) { 
							
							vFace.push( fLeftPos );
							vPos.push( fLeftPos + c );
							
							vFace.push( fLeftPos + 18 );
							vPos.push( fLeftPos + 18 + b );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fLeftPos - 9 );
							vPos.push( fLeftPos - 9 + b );
							
							vFace.push( fLeftPos - 18 );
							vPos.push( fLeftPos - 18 + c );
						}
						
					}
					
					if ( j < rs ) {
						
						if ( i < hs ) {
							
							vFace.push( fRightPos + 9 );
							vPos.push( fRightPos + 9 + c );
							
							vFace.push( fRightPos );
							vPos.push( fRightPos + b );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fRightPos - 9 );
							vPos.push( fRightPos - 9 + c );
							
							vFace.push( fRightPos - 27 );
							vPos.push( fRightPos - 27 + b );
							
						}
						
					}
					
					if ( i === 0 && g.withBottom ) {
						
						fIdx =  hs * rs * 4 + j;
						
						if ( !g.circOpen && j === 0 ) {
							
							fPos = ( fIdx + rs - 1 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + b ); // position far right is identical
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							fPos = ( fIdx - rs ) * 9;
							
							vFace.push( fPos );
							
						}
						
						if ( j < rs ) {
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
						}
						
						if ( j > 0 ) {
							
							fPos = ( fIdx - 1 ) * 9;
							
							vFace.push( fPos ); 
							vPos.push( fPos + b );
							
						}
						
					}
					
					if ( i === hs && g.withTop ) {
						
						fIdx = hs * rs * 4 + ( g.withBottom ? rs : 0 ) + j;
						
						if ( !g.circOpen  && j === 0 ) {
							
							fPos = ( fIdx + rs - 1 ) * 9;
							
							vFace.push( fPos ); 
							vPos.push( fPos + c ); // position far right is identical
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							fPos = ( fIdx - rs ) * 9;
							
							vFace.push( fPos );
							
						}
						
						if ( j < rs ) {
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + b );
							
						}
						
						if ( j > 0 ) {
							
							fPos = ( fIdx - 1 ) * 9
							
							vFace.push( fPos  );
							vPos.push( fPos + c );
							
						}
						
					}
					
					g.vertexFaces.push( vFace );
					g.vertexPositions.push( vPos );
					
				}
				
				// waffle vertices with four faces
				
				if ( j < rs ) {
					
					for ( var i = 0; i < hs; i ++ ) {
						
						vFace = []; 
						vPos = [];
						
						// fIdx = ( j * hs + i ) * 4; // face index
						fPos = ( j * hs + i ) * 36 // fIdx * 9
						
						vFace.push( fPos );
						vPos.push( fPos );
						
						vFace.push( fPos + 9 );
						vPos.push( fPos + 9 );
						
						vFace.push( fPos + 18 );
						vPos.push( fPos + 18 );
						
						vFace.push( fPos + 27 );
						vPos.push( fPos + 27 );
						
						g.vertexFaces.push( vFace );
						g.vertexPositions.push( vPos );
						
					}
					
				}
				
			}
			
		}
		
		if ( g.withBottom ) {
			
			vFace = []; 
			vPos = [];
			
			for ( var j = 0; j < rs; j ++ ) {
				
				fPos = ( hs * rs * fps + j ) * 9;
				
				vFace.push( fPos );
				vPos.push( fPos );
				
			}
			
			g.vertexFaces.push( vFace );
			g.vertexPositions.push( vPos );
			
		}
		
		if ( g.withTop ) {
			
			vFace = [];
			vPos = [];
			
			for ( var j = 0; j < rs; j ++ ) {
				
				fPos = ( hs * rs * fps + ( g.withBottom ? rs : 0 ) + j ) * 9;
				
				vFace.push( fPos );
				vPos.push( fPos);
				
			}
			
			g.vertexFaces.push( vFace );
			g.vertexPositions.push( vPos );
			
		}
		
		// write uv buffer array
		
		for ( var j = 0; j < circVertexCount; j ++ ) {
			
			for ( var i = 0; i < hss; i ++ ) {
				
				vIdx = hvc * j + i;	// vertex index
				
				for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++ ) {
					
					uvIdx = g.vertexPositions[ vIdx ][ p ] / 3 * 2;
					
					g.uvs[ uvIdx ] = g.scaleCircAngle( j / rs );
					g.uvs[ uvIdx + 1 ] = g.scaleHeight( i / hs );
					
				}
				
			}
		}
		
		// write uv buffer array waffle points
		
		if ( g.waffled ) {
			
			//for ( var j = 0; j < circVertexCount - 1; j ++ ) {
			for ( var j = 0; j < rs; j ++ ) {
				
				for ( var i = 0; i < hs; i ++ ) {
					
					waffleVidx = hvc * j + i + hss; // waffle-vertex index
					
					for ( var p = 0; p < g.vertexPositions[ waffleVidx ].length; p ++ ) {
						
						uvIdx =  g.vertexPositions[ waffleVidx  ][ p ] / 3 * 2;
						
						g.uvs[ uvIdx ] = g.scaleCircAngle( ( j + 0.5 ) / rs );
						g.uvs[ uvIdx + 1 ] = g.scaleHeight( ( i + 0.5 ) / hs );
						
					}
					
				}
				
			}
			
		}
		
		// write uv buffer array bottom
		
		if ( g.withBottom ) {
			
			fIdx =  rs * hs * fps;
			
			for ( var j = 0; j < rs; j ++ ) {
			
				nj  = ( rs - j ) / rs;
				nj1 = ( rs - j - 1 ) / rs;
				
				uvCoordinatesBottomTop();
				
				uvIdx = ( fIdx + j ) * 6;
				
				g.uvs[ uvIdx ] = 0.5;
				g.uvs[ uvIdx + 1 ] = 0.5;
				
				g.uvs[ uvIdx + 2 ] = uX1;
				g.uvs[ uvIdx + 3 ] = uZ1;
				
				g.uvs[ uvIdx + 4 ] = uX;
				g.uvs[ uvIdx + 5 ] = uZ;
				
			}
			
		}
		
		// write uv buffer array top
		
		if ( g.withTop ) {
			
			fIdx =  rs * hs * fps + ( g.withBottom ? rs : 0 );
			
			for ( var j = 0; j < rs; j ++ ) {
				
				nj  = j / rs;
				nj1 = ( j + 1 ) / rs;
				
				uvCoordinatesBottomTop();
				
				uvIdx = ( fIdx + j ) * 6;
				
				g.uvs[ uvIdx ] = 0.5;
				g.uvs[ uvIdx + 1 ] = 0.5;
				
				g.uvs[ uvIdx + 2 ] = uX;
				g.uvs[ uvIdx + 3 ] = uZ;
				
				g.uvs[ uvIdx + 4 ] = uX1;
				g.uvs[ uvIdx + 5 ] = uZ1;
				
			}
			
		}
		
		// overwrite last right uvs (u with scaled 1)
		
		if ( !g.circOpen ) {
			
			for ( var i = 0; i < hs; i ++ ) {
				
				fIdx = ( rs - 1 ) * hs * fps; // last right face index (i=0)
				
				if ( !g.waffled ) {
					
					uvIdx = fIdx * 6 + i * 12;
					
					g.uvs[ uvIdx + 2 ] = g.scaleCircAngle( 1 );	// lower face, vertex b, u 
					g.uvs[ uvIdx + 4 ] = g.scaleCircAngle( 1 ); // lower face, vertex c, u 
					g.uvs[ uvIdx + 8 ] = g.scaleCircAngle( 1 ); // upper face, vertex b, u 
					
				}
				
				if ( g.waffled ) {
					
					uvIdx = fIdx * 6 + i * 24;
					
					g.uvs[ uvIdx +  4 ] = g.scaleCircAngle( 1 ); // lower face, vertex c, u 
					g.uvs[ uvIdx + 14 ] = g.scaleCircAngle( 1 ); // right face, vertex b, u 
					g.uvs[ uvIdx + 16 ] = g.scaleCircAngle( 1 ); // right face, vertex c, u 
					g.uvs[ uvIdx + 20 ] = g.scaleCircAngle( 1 ); // upper face, vertex b, u 
					
				}
				
			}
			
		}
		
		// write groups for multi material
		
		for ( var f = 0, p = 0; f < faceCount; f ++, p += 3 ) {
			
			g.addGroup( p, 3, 1 ); // default material index is 0.1 * 10 = 1
			
		}
		
	}
	
}

function morphVertices( time ) {
	
	var t = time !== undefined ? time : 0;
	
	g = this;
	
	var rs = g.radiusSegments;
	var rss = rs + 1;
	var hs = g.noCenterPoints ? g.heightSegments : g.centerPoints.length - 1;
	var hss	= hs + 1;
	var hvc	= g.waffled ? hss + hs : hss;   // height vertex count
	var circVertexCount = g.circOpen ? rss : rs;
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
	var rUnrC;				// radius unroll circle
	var sigma0;				// start angle unroll
	var sigma;				// unroll angle 
	var f0Vec = {};
	var f1Vec = {};
	var f2Vec = {};
	var normal = {};
	var leftBtm;
	var leftTop;
	var rightBtm;
	var rightTop;
	var lastCircSegmentWidth;
	var idx;
	var vIdx; 				// vertex index
	var posIdx;				// position index
	var posIdx0;
	var fIdx;				// face index
	var fIdx0;
	var waffleVidx; 		// waffle vertex index
	var pi = Math.PI;
	var topOffset = 0;
	// quad line
	var sign;				// for vertical line up / down
	var vlst;				// vertical line start indices
	var hlIdx;				// horizontal line index
	var hld0; 				// horizontal line difference even
	var hld1; 				// horizontal line difference odd
	
	function xyzCalculation() {
		
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
				z	=		-r * Math.sin( angle )	+ g.radius * g.moveZ( nj, ni, t );
				
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
				
				if ( i === 0 ) {  // first binormal 
					
					// see  http://lolengine.net/blog/2013/09/21/picking-orthogonal-vector-combing-coconuts
					
					// normalize tangent
					
					lenV = Math.sqrt( tX * tX + tY * tY + tZ * tZ );
					
					tX = tX / lenV;
					tY = tY / lenV;
					tZ = tZ / lenV;
					
					const k = ( Math.abs( tX ) + 0.5 ) % 1; // fract
					
					bX = -tY;
					bY = tX - k * tZ;
					bZ = k * tY;
					
					// normalize binormal
					
					lenV = Math.sqrt( bX * bX + bY * bY + bZ * bZ );
					
					bX = bX / lenV;
					bY = bY / lenV;
					bZ = bZ / lenV;
					
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
				
				r = g.radius * ( ( rUnrC - 1 ) + g.rCircHeight( nj, ni, t ) );
				
				// vector equation of circle in 3D space
				
				x = cX * g.height + r * ( Math.cos( angle ) * bX + Math.sin( angle ) * nX );
				y = cY * g.height + r * ( Math.cos( angle ) * bY + Math.sin( angle ) * nY );
				z = cZ * g.height + r * ( Math.cos( angle ) * bZ + Math.sin( angle ) * nZ );
				
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
		
	}
	
	if ( g.style !== "complete" ) { g.withBottom = false; g.withTop  = false; g.circOpen = true; }
	
	if ( !g.noCenterPoints ) {
		
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
				
				scHeight[ i ] = scHeight[ i - 1 ] + Math.sqrt( dX * dX + dY * dY + dZ * dZ ) * g.height;
				
			}
			
		}
		
	}
	
	if ( g.indexed ) {
	
		var leftBtmVec = {}; 
		var leftTopVec = {};
		var rightBtmVec = {};
		var rightTopVec = {};
		var wVec = {};
		
		var fps = g.waffled ? 4 : 2; // faces per segment
		
		var faceCount = hs * rs * fps;
		faceCount += g.withBottom ? rs : 0;
		faceCount += g.withTop ? rs : 0;
		
		function xyzSet() {
			
			posIdx = vIdx * 3;
			
			g.vertices[ posIdx ]  = x;		// set vertex position
			g.vertices[ posIdx + 1 ]  = y;
			g.vertices[ posIdx + 2 ]  = z;
			
		}
		
		g.attributes.position.needsUpdate = true;
		g.attributes.normal.needsUpdate = true;
		
		if ( !g.quadLine ) {
		
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj = j / rs;
				
				for ( var i = 0; i < hss; i ++ ) {
					
					ni   = i / hs;
					ni01 = ( i + 0.1 ) / hs;
					
					vIdx =  hvc * j + i;	// vertex index
					
					xyzCalculation();
					
					xyzSet(); // set vertex position
					
					if (j === 0  && !g.circOpen ) {
						
						vIdx =  hvc * rs + i;	// vertex index
						
						xyzSet(); // connect face / positions on the far right are identical
						
					}
					
					if ( i === 0 && g.withBottom ){
						
						topOffset = 1 + rss;
						
						vIdx = hvc * rs + hss + 1 + j;
						
						xyzSet(); // set vertex position
						
						if (j === 0  && !g.circOpen ) {
							
							vIdx += rs; 
							
							xyzSet(); // connect face / positions on the far right are identical
							
						}
						
					}
					
					if ( i === hs && g.withTop){
						
						vIdx = hvc * rs + hss + topOffset + 1 + j;
						
						xyzSet(); // set vertex position
						
						if (j === 0  && !g.circOpen ) {
							
							vIdx += rs; 
							
							xyzSet(); // connect face / positions on the far right are identical
							
						}
								
					}
					
				}
				
			}
			
		} else {
		
			g.lineGeometry.attributes.position.needsUpdate = true;
			
			sign = 1;	// quad line vertical line up / down
			
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj = j / rs;
				
				// quad line
				
				hlIdx = hss * rss - j - 1; // horizontal line index ( start )
				
				hld0 = 2 * rs - 2 * j + 1; // horizontal line vertices difference
				hld1 = 2 * j + 1;
				
				vlst = ( rss + j ) * hss + ( j % 2 === 0 ? 0 : hs ) ;	// vertical line start
				
				for ( var i = 0; i < hss; i ++ ) {
					
					ni   = i / hs;
					ni01 = ( i + 0.1 ) / hs;
					
					vIdx =  hvc * j + i;	// vertex index
										
					xyzCalculation();
					
					xyzSet(); // set vertex position
					
					// quad line
						
					posIdx = ( vlst + sign * i ) * 3;	// vertical line 
					
					g.linePositions[ posIdx ] = x;
					g.linePositions[ posIdx + 1 ] = y;
					g.linePositions[ posIdx + 2 ] = z;
											
					posIdx = hlIdx * 3;					// horizontal line
					
					g.linePositions[ posIdx ] = x;
					g.linePositions[ posIdx + 1 ] = y;
					g.linePositions[ posIdx + 2 ] = z;
						
						
					hlIdx -= i % 2 === 0 ? hld0 : hld1; // horizontal line ( index difference )
					
					if (j === 0  && !g.circOpen ) {
						
						vIdx =  hvc * rs + i;	// vertex index
						
						xyzSet(); // connect face / positions on the far right are identical
						
					}
					
					if ( i === 0 && g.withBottom ){
						
						topOffset = 1 + rss;
						
						vIdx = hvc * rs + hss + 1 + j;
						
						xyzSet(); // set vertex position
						
						if (j === 0  && !g.circOpen ) {
							
							vIdx += rs; 
							
							xyzSet(); // connect face / positions on the far right are identical
							
						}
						
					}
					
					if ( i === hs && g.withTop){
						
						vIdx = hvc * rs + hss + topOffset + 1 + j;
						
						xyzSet(); // set vertex position
						
						if (j === 0  && !g.circOpen ) {
							
							vIdx += rs; 
							
							xyzSet(); // connect face / positions on the far right are identical
							
						}
								
					}
					
				}
				
				sign = -sign;	// alternately up / down
				
			}
			
		}
		
		if ( g.waffled ) {
			
			// calculation of the center points (waffle points)
			
			for ( var j = 0; j < rs; j ++ ) {
				
				nj = j / rs;
				
				for ( var i = 0; i  < hs; i ++ ) {
					
					ni =  i / hs;
					
					waffleVidx =  hvc * j + i + hss;		// waffle vertex index
					
					g.uvs[ waffleVidx * 2 ] = g.scaleCircAngle( ( j + 0.5 ) / rs );
					g.uvs[ waffleVidx * 2 + 1 ] = g.scaleHeight( ( i + 0.5 ) / hs );
					
					
					leftBtm  = hvc * j + i;				// left-bottom
					leftTop  = hvc * j + i + 1;  		// left-top
					rightBtm = hvc * ( j + 1 ) + i;  	// right-bottom
					rightTop = hvc * ( j + 1 ) + i + 1; // right-top
					
					leftBtmVec.x =  g.vertices[ leftBtm * 3 ];
					leftBtmVec.y =  g.vertices[ leftBtm * 3 + 1 ];
					leftBtmVec.z =  g.vertices[ leftBtm * 3 + 2 ];
					
					leftTopVec.x =  g.vertices[ leftTop * 3 ];
					leftTopVec.y =  g.vertices[ leftTop * 3 + 1 ];
					leftTopVec.z =  g.vertices[ leftTop * 3 + 2 ];
					
					rightBtmVec.x =  g.vertices[ rightBtm  * 3 ];
					rightBtmVec.y =  g.vertices[ rightBtm * 3 + 1 ];
					rightBtmVec.z =  g.vertices[ rightBtm * 3 + 2 ];
					
					rightTopVec.x =  g.vertices[ rightTop * 3 ];
					rightTopVec.y =  g.vertices[ rightTop * 3 + 1 ];
					rightTopVec.z =  g.vertices[ rightTop * 3 + 2 ];
					
					wVec.x = leftBtmVec.x + leftTopVec.x;
					wVec.y = leftBtmVec.y + leftTopVec.y;
					wVec.z = leftBtmVec.z + leftTopVec.z;
					
					wVec.x += rightBtmVec.x;
					wVec.y += rightBtmVec.y;
					wVec.z += rightBtmVec.z;
					
					wVec.x += rightTopVec.x;
					wVec.y += rightTopVec.y;
					wVec.z += rightTopVec.z;
					
					// center
					wVec.x *= 0.25; 
					wVec.y *= 0.25; 
					wVec.z *= 0.25;
					
					
					if ( g.style === "cover" || g.style === "complete" ) {
						
						f1Vec.x = leftTopVec.x - wVec.x;
						f1Vec.y = leftTopVec.y - wVec.y;
						f1Vec.z = leftTopVec.z - wVec.z;
						
						f2Vec.x = leftBtmVec.x - wVec.x;
						f2Vec.y = leftBtmVec.y - wVec.y;
						f2Vec.z = leftBtmVec.z - wVec.z;
						
						// cross product
						
						normal.x = f1Vec.y * f2Vec.z - f1Vec.z * f2Vec.y;
						normal.y = f1Vec.z * f2Vec.x - f1Vec.x * f2Vec.z;
						normal.z = f1Vec.x * f2Vec.y - f1Vec.y * f2Vec.x;
						
						lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
						
						// normalize and waffleDeep
						
						normal.x = -g.waffleDeep( nj, ni, t ) * normal.x / lenV;
						normal.y = -g.waffleDeep( nj, ni, t ) * normal.y / lenV;
						normal.z = -g.waffleDeep( nj, ni, t ) * normal.z / lenV;
						
						// new position
						wVec.x += normal.x; 
						wVec.y += normal.y;
						wVec.z += normal.z;
						
					}
					
					g.vertices[ waffleVidx * 3 ] = wVec.x;
					g.vertices[ waffleVidx * 3 + 1 ] = wVec.y;
					g.vertices[ waffleVidx * 3 + 2 ] = wVec.z;
					
				}
				
			}
			
		}
		
		if ( g.withBottom || g.withTop ) {
			
			topOffset = 0;
			
			if ( g.withBottom ) {
				
				topOffset = 1 + rss;
				
				vIdx = hvc * rs + hss;
				
				x = 0;
				y = 0;
				z = 0;
				
				for ( var j = 0; j < rs; j ++ ) {
					
					posIdx = hvc * j * 3;	// position index of cover/bottom
					
					x += g.vertices[ posIdx ];
					y += g.vertices[ posIdx + 1 ];
					z += g.vertices[ posIdx + 2 ];
					
				}
				
				x = x / rs;
				y = y / rs;
				z = z / rs;
				
				xyzSet(); // set vertex position bottom
				
			}
			
			if ( g.withTop ) {
				
				vIdx = hvc * rs + hss + topOffset;
				
				x = 0;
				y = 0;
				z = 0;
				
				for ( var j = 0; j < rs; j ++ ) {
					
					posIdx = ( hvc * j + hs ) * 3 ; // position index of cover/top
					
					x += g.vertices[ posIdx ];
					y += g.vertices[ posIdx + 1 ];
					z += g.vertices[ posIdx + 2 ];
					
				}
				
				x = x / rs;
				y = y / rs;
				z = z / rs;
				
				xyzSet(); // set vertex position top
				
			}
			
		}
		
		// face normals (needed for vertex normals) 
		
		g.faceNormals = [];
		
		for ( var f = 0; f < faceCount ; f ++ ) {
			
			normal.x = 0;
			normal.y = 0;
			normal.z = 0;
			
			fIdx = f * 3 + 1;
			fIdx0 = f * 3;
			
			f1Vec.x = g.vertices[ g.faceIndices[ fIdx ] * 3 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 ];
			f1Vec.y = g.vertices[ g.faceIndices[ fIdx ] * 3 + 1 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 + 1 ];
			f1Vec.z = g.vertices[ g.faceIndices[ fIdx ] * 3 + 2 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 + 2 ];
			
			fIdx ++;
			
			f2Vec.x = g.vertices[ g.faceIndices[ fIdx ] * 3 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 ];
			f2Vec.y = g.vertices[ g.faceIndices[ fIdx ] * 3 + 1 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 + 1 ];
			f2Vec.z = g.vertices[ g.faceIndices[ fIdx ] * 3 + 2 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 + 2 ];
			
			//  add cross product
			
			normal.x += f1Vec.y * f2Vec.z - f1Vec.z * f2Vec.y;
			normal.y += f1Vec.z * f2Vec.x - f1Vec.x * f2Vec.z;
			normal.z += f1Vec.x * f2Vec.y - f1Vec.y * f2Vec.x;
			
			// normalize
			
			lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
			
			normal.x = normal.x / lenV;
			normal.y = normal.y / lenV;
			normal.z = normal.z / lenV;
			
			g.faceNormals.push( normal.x, normal.y, normal.z );
			
		}
		
		//vertex normals
		
		for ( var v = 0; v < g.vertexFaces.length; v ++ ) {
			
			normal.x = 0;
			normal.y = 0;
			normal.z = 0;
			
			// add face normals	
			
			for ( var f = 0; f < g.vertexFaces[ v ].length; f ++ ) {
				
				normal.x += g.faceNormals[ g.vertexFaces[ v ][ f ] ];
				normal.y += g.faceNormals[ g.vertexFaces[ v ][ f ] + 1 ];
				normal.z += g.faceNormals[ g.vertexFaces[ v ][ f ] + 2 ];
				
			}
			
			// normalize
			
			lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
			
			normal.x = normal.x / lenV;
			normal.y = normal.y / lenV;
			normal.z = normal.z / lenV;
			
			// write the vertex normal
			
			g.normals[ v * 3 ] = normal.x;
			g.normals[ v * 3 + 1 ] = normal.y;
			g.normals[ v * 3 + 2 ] = normal.z;
		}
		
	}
	
	if ( !g.indexed ) {
	
		// const a = 0; //  position index offset, triangle corners a, b, c
		const b = 3;
		const c = 6;
		
		var fps = g.waffled ? 4 : 2; // faces per segment
		
		var faceCount = hs * rs * fps;
		faceCount += g.withBottom ? rs : 0;
		faceCount += g.withTop ? rs : 0;
		
		var posIdx; // position index
		
		function setExplodedPositions() {
			
			posIdx = f * 9;
			
			x = 0;
			y = 0;
			z = 0;
		
			x += g.positions[ posIdx ] + g.positions[ posIdx  + 3 ] + g.positions[ posIdx  + 6 ];
			y += g.positions[ posIdx + 1 ] + g.positions[ posIdx  + 4 ] + g.positions[ posIdx  + 7 ];
			z += g.positions[ posIdx + 2 ] + g.positions[ posIdx  + 5 ] + g.positions[ posIdx  + 8 ];
			
			x = g.explode( t ) * x / 3;
			y = g.explode( t ) * y / 3; 
			z = g.explode( t ) * z / 3;
			
			for ( var p = 0; p < 9; p += 3 ) {
			
				g.positions[ posIdx + p ] += x; 
				g.positions[ posIdx + p + 1 ] += y;
				g.positions[ posIdx + p + 2 ] += z;
				
			}
			
		}
		
		g.attributes.position.needsUpdate = true;
		g.attributes.normal.needsUpdate = true;
		
		if ( !g.quadLine ) { 
		
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj = j / rs;
				
				for ( var i = 0; i < hss; i ++ ) {
					
					ni   = i / hs;
					ni01 = ( i + 0.1 ) / hs;
					
					vIdx =  hvc * j + i;	// vertex index
					
					xyzCalculation();
										
					for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++) {
						
						g.positions[ g.vertexPositions[ vIdx ][ p ] ] = x;
						g.positions[ g.vertexPositions[ vIdx ][ p ] + 1 ] = y;
						g.positions[ g.vertexPositions[ vIdx ][ p ] + 2 ] = z;
						
					}
					
				}
				
			}
					
		} else {
			
			g.lineGeometry.attributes.position.needsUpdate = true;
			
			sign = 1;	// quad line vertical line up / down
			
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj = j / rs;
				
				// quad line
				
				hlIdx = hss * rss - j - 1; // horizontal line index ( start )
				
				hld0 = 2 * rs - 2 * j + 1; // horizontal line vertices difference
				hld1 = 2 * j + 1;
				
				vlst = ( rss + j ) * hss + ( j % 2 === 0 ? 0 : hs ) ;	// vertical line start
				
				for ( var i = 0; i < hss; i ++ ) {
					
					ni   = i / hs;
					ni01 = ( i + 0.1 ) / hs;
					
					vIdx =  hvc * j + i;	// vertex index
					
					xyzCalculation();
										
					for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++) {
						
						g.positions[ g.vertexPositions[ vIdx ][ p ] ] = x;
						g.positions[ g.vertexPositions[ vIdx ][ p ] + 1 ] = y;
						g.positions[ g.vertexPositions[ vIdx ][ p ] + 2 ] = z;
						
					}
					
					// quad line
			
					posIdx = ( vlst + sign * i ) * 3;	// vertical line 
					
					g.linePositions[ posIdx ] = x;
					g.linePositions[ posIdx + 1 ] = y;
					g.linePositions[ posIdx + 2 ] = z;
											
					posIdx = hlIdx * 3;					// horizontal line
					
					g.linePositions[ posIdx ] = x;
					g.linePositions[ posIdx + 1 ] = y;
					g.linePositions[ posIdx + 2 ] = z;
						
						
					hlIdx -= i % 2 === 0 ? hld0 : hld1; // horizontal line ( index difference )	
					
				}
				
				sign = -sign;	// alternately up / down
				
			}
			
		}
		
		if ( g.waffled ) {
			
			for ( var j = 0; j < rs; j ++ ) {
				
				nj = j / rs;
				
				for ( var i = 0; i  < hs; i ++ ) {
					
					ni =  i / hs;
					
					waffleVidx =  hvc * j + i + hss;
					posIdx = ( j * hs + i ) * 36  // position index ( 4 faces * 9 positions)
					
					// xyzCenterPoint
					
					f0Vec.x = 0;
					f0Vec.y = 0;
					f0Vec.z = 0;
					
					f0Vec.x += g.positions[ posIdx + 3 ];	// lower face, b, x
					f0Vec.x += g.positions[ posIdx + 6 ];	// lower face, c, x
					f0Vec.x += g.positions[ posIdx + 30 ];	// upper face, b, x
					f0Vec.x += g.positions[ posIdx + 33 ];	// upper face, c, x
					
					f0Vec.y += g.positions[ posIdx + 4 ];	// lower face, b, y
					f0Vec.y += g.positions[ posIdx + 7 ];	// lower face, c, y
					f0Vec.y += g.positions[ posIdx + 31 ];	// upper face, b, y
					f0Vec.y += g.positions[ posIdx + 34 ];	// upper face, c, y
					
					f0Vec.z += g.positions[ posIdx + 5 ];	// lower face, b, z
					f0Vec.z += g.positions[ posIdx + 8 ];	// lower face, c, z
					f0Vec.z += g.positions[ posIdx + 32 ];	// upper face, b, z
					f0Vec.z += g.positions[ posIdx + 35 ];	// upper face, c, z
					
					f0Vec.x *= 0.25;
					f0Vec.y *= 0.25;
					f0Vec.z *= 0.25;
					
					if ( g.style === "cover" || g.style === "complete" ) {
						
						// wafflePoint();
						f1Vec.x = g.positions[ posIdx + 33 ] - g.positions[ posIdx + 6 ]; // left top -  right bottom
						f1Vec.y = g.positions[ posIdx + 34 ] - g.positions[ posIdx + 7 ];
						f1Vec.z = g.positions[ posIdx + 35 ] - g.positions[ posIdx + 8 ];
						
						f2Vec.x = g.positions[ posIdx + 3 ] - g.positions[ posIdx + 30 ]; // left bottom - right top
						f2Vec.y = g.positions[ posIdx + 4 ] - g.positions[ posIdx + 31 ];
						f2Vec.z = g.positions[ posIdx + 5 ] - g.positions[ posIdx + 32 ];
						
						// cross product
						
						normal.x = f1Vec.y * f2Vec.z - f1Vec.z * f2Vec.y;
						normal.y = f1Vec.z * f2Vec.x - f1Vec.x * f2Vec.z;
						normal.z = f1Vec.x * f2Vec.y - f1Vec.y * f2Vec.x;
						
						lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
						
						//normalize
						
						normal.x = -g.waffleDeep( nj, ni, t ) * normal.x / lenV;
						normal.y = -g.waffleDeep( nj, ni, t ) * normal.y / lenV;
						normal.z = -g.waffleDeep( nj, ni, t ) * normal.z / lenV;
						
						f0Vec.x += normal.x;
						f0Vec.y += normal.y;
						f0Vec.z += normal.z;
						
					}
					
					// set positions
					
					for ( var p = 0; p < g.vertexPositions[ waffleVidx ].length; p ++) {
						
						g.positions[ g.vertexPositions[ waffleVidx][ p ] ] = f0Vec.x;
						g.positions[ g.vertexPositions[ waffleVidx ][ p ] + 1 ] = f0Vec.y;
						g.positions[ g.vertexPositions[ waffleVidx ][ p ] + 2 ] = f0Vec.z;
						
					}
					
				}
			
			}
			
		}
		
		if ( g.withBottom ) {
			
			// calculate bottom center
			
			x = 0;
			y = 0;
			z = 0;
			
			for ( j = 0; j < rs; j ++ ) {
				
				posIdx = ( rs * hs * fps + j ) * 9;
				
				x += g.positions[ posIdx + 3 ];
				y += g.positions[ posIdx + 4 ];
				z += g.positions[ posIdx + 5 ];
				
				x += g.positions[ posIdx + 6 ];
				y += g.positions[ posIdx + 7 ];
				z += g.positions[ posIdx + 8 ];
				
			}
			
			x = x / ( rs * 2 );
			y = y / ( rs * 2 );
			z = z / ( rs * 2 );
			
			vIdx = hvc * rs + hss;
			
			// set positions
			
			for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++ ) {
				
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 0 ] = x;
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 1 ] = y;
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 2 ] = z;
				
			}
			
		}
		
		if ( g.withTop ) {
			
			// calculate top center
			
			x = 0;
			y = 0;
			z = 0;
			
			for ( j = 0; j < rs; j ++ ) {
				
				posIdx = ( rs * hs * fps + ( g.withBottom ? rs : 0 ) + j ) * 9;
				
				x += g.positions[ posIdx + 3 ];
				y += g.positions[ posIdx + 4 ];
				z += g.positions[ posIdx + 5 ];
					
				x += g.positions[ posIdx + 6 ];
				y += g.positions[ posIdx + 7 ];
				z += g.positions[ posIdx + 8 ];
				
			}
			
			x = x / ( rs * 2 );
			y = y / ( rs * 2 );
			z = z / ( rs * 2 );
			
			vIdx = hvc * rs + hss + ( g.withBottom ? 1 : 0 ) ;
			
			// set positions
			
			for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++ ) {
				
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 0 ] = x;
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 1 ] = y;
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 2 ] = z;
				
			}
			
		}
		
		// face normals
		
		g.faceNormals = []; // clear face normals
		
		for ( var f = 0; f < faceCount ; f ++ ) {
			
			normal.x = 0;
			normal.y = 0;
			normal.z = 0;
			
			posIdx = f * 9 + 3;
			posIdx0 = f * 9;
			
			f1Vec.x = g.positions[ posIdx ] - g.positions[ posIdx0 ];
			f1Vec.y = g.positions[ posIdx + 1 ] - g.positions[ posIdx0 + 1 ];
			f1Vec.z = g.positions[ posIdx + 2 ] - g.positions[ posIdx0 + 2  ];
			
			posIdx = f * 9 + 6;
			
			f2Vec.x = g.positions[ posIdx ] - g.positions[ posIdx0 ];
			f2Vec.y = g.positions[ posIdx + 1 ] - g.positions[ posIdx0 + 1 ];
			f2Vec.z = g.positions[ posIdx + 2 ] - g.positions[ posIdx0 + 2 ];
			
			//  add cross product
			
			normal.x += f1Vec.y * f2Vec.z - f1Vec.z * f2Vec.y;
			normal.y += f1Vec.z * f2Vec.x - f1Vec.x * f2Vec.z;
			normal.z += f1Vec.x * f2Vec.y - f1Vec.y * f2Vec.x;
			
			// normalize
			
			lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
			
			normal.x = normal.x / lenV;
			normal.y = normal.y / lenV;
			normal.z = normal.z / lenV;
			
			g.faceNormals.push( normal.x, normal.y, normal.z );
			
		}
		
		// vertex normals
		
		for ( var v = 0; v < g.vertexFaces.length; v ++ ) {
			
			normal.x = 0;
			normal.y = 0;
			normal.z = 0;
			
			// add face normals	
			
			for ( var f = 0; f < g.vertexFaces[ v ].length; f ++ ) {
				
				normal.x += g.faceNormals[ g.vertexFaces[ v ][ f ] / 3 ];
				normal.y += g.faceNormals[ g.vertexFaces[ v ][ f ] / 3 + 1 ];
				normal.z += g.faceNormals[ g.vertexFaces[ v ][ f ] / 3 + 2 ];
				
			}
			
			// normalize
			
			lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
			
			normal.x = normal.x / lenV;
			normal.y = normal.y / lenV;
			normal.z = normal.z / lenV;
			
			// write the vertex normals corresponding to positions 
			
			for ( var f = 0; f < g.vertexFaces[ v ].length; f ++ ) {
				
				g.normals[ g.vertexPositions[ v ][ f ] ] = normal.x;
				g.normals[ g.vertexPositions[ v ][ f ] + 1 ] = normal.y;
				g.normals[ g.vertexPositions[ v ][ f ] + 2 ] = normal.z;
				
			}
			
		}
		
		// explode
		
		if ( !g.explodeDefault ) {
		
			if ( g.explodemode === 'center' ) {
				
				// explode with 'center' mode
				
				if ( !g.waffled ) {
				
					for ( var f = 0; f < hs * rs * fps; f ++ ) {
					
						 setExplodedPositions( );
												
					} 
					
				}
				
				if ( g.waffled ) {
				
					// set exploded positions per segment (using waffleVertex)
				
					for ( var j = 0; j < rs; j ++ ) {
					
						nj = j / rs;
					
						for ( var i = 0; i  < hs; i ++ ) {
							
							ni = i / hs;
							
							waffleVidx =  hvc * j + i + hs + 1;
							posIdx = ( 4 * ( j * hs + i )) * 9 ; // position index ( 4 faces / segment with 9 positions)
									
							x = g.positions[ g.vertexPositions[ waffleVidx][ 0 ] ] * g.explode( t );
							y = g.positions[ g.vertexPositions[ waffleVidx ][ 0 ] + 1 ] * g.explode( t );
							z = g.positions[ g.vertexPositions[ waffleVidx ][ 0 ] + 2 ] * g.explode( t );
							
							// set positions
							for ( var p = posIdx; p < posIdx + 36 ; p += 3) {
								
								g.positions[ p ] += x;
								g.positions[ p + 1 ] += y;
								g.positions[ p + 2 ] += z;
								
							}
							
						}
						
					}
										
				}
													
				if ( g.withBottom ){
					
					for ( var f = hs * rs * fps; f < hs * rs * fps + rs ; f ++ ) {
						
						setExplodedPositions( );
						
					}
					
				}
				
				if ( g.withTop ){
				
					for ( var f = hs * rs * fps  + ( g.withBottom ? rs : 0 ); f < hs * rs * fps + ( g.withBottom ? 2 * rs : rs ) ; f ++ ) {
						
						setExplodedPositions( ); 
						
					}
					
				}
				
			}
			
			if ( g.explodemode === 'normal' ) {
				
				// explode with 'normal' mode
		
				for ( var f = 0; f < faceCount; f ++ ) {
					
					for ( var p = 0; p < 3; p ++ ) {
						
						posIdx = f * 9;
							
						g.positions[ posIdx + p * 3 ] = g.positions[ posIdx + p * 3 ] + g.faceNormals[ f * 3 ] * g.radius * g.explode( t );				
						g.positions[ posIdx + p * 3 + 1 ] = g.positions[ posIdx + p * 3 + 1 ] + g.faceNormals[ f * 3 + 1 ] * g.radius * g.explode( t );
						g.positions[ posIdx + p * 3 + 2 ] = g.positions[ posIdx + p * 3 + 2 ] + g.faceNormals[ f * 3 + 2 ] * g.radius * g.explode( t );
											
					}	
					
				}
				
			}	
			
		}	
		
	}
	
}

function morphFaces( time ) {
	
	if ( !g.materialDefault ) {
	
		var t = time !== undefined ? time : 0;
		
		g = this;
		
		var rs = g.radiusSegments;
		var hs = g.noCenterPoints ? g.heightSegments : g.centerPoints.length - 1;
		var hsMinFixed;
		var fIdx;		// face index
		var fixMatIdx;	// fixed material Index
		var j0;			// j - index
		var j1;			// j - index
		var topOffset;
		
		var fps = g.waffled ? 4 : 2; // faces per segment
		
		if ( g.style !== "complete" ) { g.withBottom = false; g.withTop = false; g.circOpen = true; }
		
		// indexed and non-indexed BufferGeometry identical
			
		if ( !g.materialCoverDefault || !g.fixedMaterialDefault ) {
			
			if ( !g.waffled ) {
				
				hsMinFixed = hs - Math.min( hs, g.fixedMaterial.length );
				
				for ( var j = 0; j < rs ; j ++ ) {
					
					j0 = 2 * j; 
					j1 = j0 + 1;
					
					for ( var i = 0; i < hs; i ++ ) {
						
						// right bottom
						
						fIdx  = 2 * hs * j + 2 * i;	
						fixMatIdx =  hs - ( i + 1 );
						
						g.groups[ fIdx ].materialIndex = g.materialCover( ( j + 0.5 ) / rs, i / hs, t ); // by function
						
						if ( hsMinFixed <= i ) {
							
							if ( j1 < g.fixedMaterial[ fixMatIdx ].length ) {
								
								if ( g.fixedMaterial[ fixMatIdx ][ j1 ] !== "." ) {
									
									g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j1 ]; // overwrite by array
									
								}
								
							}
							
						}
						
						// left top
						
						fIdx ++;
						
						g.groups[ fIdx ].materialIndex = g.materialCover( j / rs , i / hs, t ); // by function
						
						if ( hsMinFixed <= i ) {
							
							if ( j0 < g.fixedMaterial[ fixMatIdx ].length ) {
								
								if ( g.fixedMaterial[ fixMatIdx ][ j0 ] !== "." ) {
									
									g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j0 ]; // overwrite by array
									
								}
								
							}
							
						}
						
					}
					
				}
				
			}
			
			if ( g.waffled ) {
				
				hsMinFixed = hs - Math.min( hs, 0.5 * g.fixedMaterial.length );
				
				for ( var j = 0; j < rs ; j ++ ) {
					
					if ( g.fixedMaterial.length % 2 !== 0 ) g.fixedMaterial.push( '.' );   // make length even
					
					j0 = 2 * j; 
					j1 = j0 + 1;
					
					for ( var i = 0; i < hs; i ++ ) {
						
						// bottom
						
						fIdx  =  4 * hs * j + 4 * i;
						fixMatIdx = 2 * hs - ( 2 * i + 1 );
						
						g.groups[ fIdx ].materialIndex =  g.materialCover( j / rs, i / hs, t ); // by function
						
						if ( hsMinFixed <= i ) {
							
							if ( j0 < g.fixedMaterial[ fixMatIdx ].length ) {
								
								if ( g.fixedMaterial[fixMatIdx ][ j0 ] !== "." ) {
									
									g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx][ j0 ]; // overwrite by array
									
								}
								
							}
							
						}
						
						// left
						
						fIdx ++;
						fixMatIdx --;
						
						g.groups[ fIdx ].materialIndex =  g.materialCover( j / rs, ( i + 0.5 ) / hs, t ); // by function
						
						if ( hsMinFixed <= i ) {
							
							if ( j0 < g.fixedMaterial[ fixMatIdx ].length ) {
								
								if ( g.fixedMaterial[ fixMatIdx ][ j0 ] !== "." ) {
									
									g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j0 ]; // overwrite by array
									
								}
								
							}
							
						}
						
						// right
						
						fIdx ++;
						fixMatIdx ++;
						
						g.groups[ fIdx ].materialIndex =  g.materialCover( ( j + 0.5 ) / rs, i / hs, t ); // by function
						
						if ( hsMinFixed <= i ) {
							
							if ( j1 < g.fixedMaterial[ fixMatIdx ].length ) {
								
								if ( g.fixedMaterial[ fixMatIdx ][ j1 ] !== "." ) {
									
									g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j1 ]; // overwrite by array
									
								}
								
							}
							
						}
						
						// top
						
						fIdx ++;
						fixMatIdx --;
						
						g.groups[ fIdx ].materialIndex = g.materialCover( ( j + 0.5 ) / rs, ( i + 0.5 ) / hs, t ); // by function
						
						if ( hsMinFixed <= i ) {
							
							if ( j1 < g.fixedMaterial[ fixMatIdx ].length ) {
								
								if ( g.fixedMaterial[ fixMatIdx ][ j1 ] !== "." ) {
									
									g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j1 ]; // overwrite by array
									
								}
								
							}
							
						}
						
					}
					
				}
				
			}
			
		}
		
		if ( g.withBottom || g.withTop ) {
				
				topOffset = 0;
				
				if  ( g.withBottom ) topOffset = rs;
				
				if ( g.withBottom  && ( !g.materialBottomDefault || g.fixedMatBottom !== "" ) ) {
					
					fIdx = hs * rs * fps; 
					
					for ( var j = 0; j < rs ; j ++ ) {
						
						g.groups[ fIdx + j ].materialIndex = g.materialBottom( j / rs, t ); // by function
						
						if ( j < g.fixedMatBottom.length ) {
							
							if ( g.fixedMatBottom[ j ] !== "." ) {
								
								g.groups[ fIdx + j ].materialIndex  =  g.fixedMatBottom[ j ]; // overwrite
								
							}
							
						}
						
					}
					
				}
				
				if ( g.withTop && ( !g.materialTopDefault  || g.fixedMatTop !== "" ) ) {
					
					fIdx = topOffset + hs * rs * fps;
					
					for ( var j = 0; j < rs ; j ++ ) {
						
						g.groups[ fIdx + j ].materialIndex = g.materialTop( j / rs, t ); // by function
						
						if ( j < g.fixedMatTop.length ) {
							
							if ( g.fixedMatTop[ j ] !== "." ) {
								
								g.groups[ fIdx + j ].materialIndex  =  g.fixedMatTop[ j ]; // overwrite
								
							}
							
						}
						
					}
					
				}
				
			}
		
	}

}

export {
     createMorphGeometry, create, morphVertices, morphFaces 
};