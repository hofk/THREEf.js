# THREEf.js
THREE.js addon, to produce almost infinite many time-varying Geometries and BufferGeometries with functions

//

  @author hofk / http://sandbox.threejs.hofk.de/
  
  see also
  https://discourse.threejs.org/t/addon-produces-almost-infinite-many-time-varying-geometries-with-functions/262

//

 #####  * Inspired by https://threejs.org/examples/js/ParametricGeometries.js ( @author zz85 )*

Produce almost infinite many time-varying Geometries or BufferGeometries with only 14 properties, 19 functions and 2 arrays:

```javascript

geometry = new THREE.Geometry();    // base class geometry object from THREE.js
// or 
geometry = new THREE.BufferGeometry();    // base class buffer-geometry object from THREE.js

geometry.createMorphGeometry = THREEf.createMorphGeometry;    // insert the methode from THREEf.js

// for non-indexed BufferGeometry set parameter  indexed: false, 

geometry.createMorphGeometry();    // apply the methode ( here without parameters: all default )

mesh = new THREE.Mesh( geometry, materials ); // create a material array: materials
scene.add( mesh );

mesh.add( geometry.quadLine ); //  only if used propertie quadLine:  add the quad line

```
Include: 	<script src="THREEf.js"></script> 

-------------------------------------------------------------
````
_87 now contains
function vertexFaceNumbersHelper (mesh, mode, size, color) 
	// mode: 0 nothing, 1 vertex, 2 face, 3 vertex & face
and uses .flatShading: true or false; // three.js r87

-----------------------------------------------------

_88 now contains
explode, // function ( t ) // factor for exploded view (only non indexed BufferGeometry)

-----------------------------------------------------

_89 now contains
fixedMatTop,	// fixed given material index (string of digits for faces), overrides materialTop values
fixedMatBottom,	// fixed given material index (string of digits for faces), overrides materialBottom values

Additionally there is the tool modifyCreateGeo.html.
It outputs the elementary BufferGeometry definition for a selected time.
The code is displayed and is also copied to the clipboard.
````
-----------------------------------------------------------------------------------------------------------------
**Example:**

```javascript
geometry = new THREE.BufferGeometry();

geometry.createMorphGeometry = THREEf.createMorphGeometry;

geometry.createMorphGeometry({

   indexed: false, // default is true
   height: 80,
   heightSegments: 80,
   rCircHeight: function ( u, v, t ) { return 1.01 + Math.cos( 25.2 * v ) * Math.sin( 0.2 * t ) },
   centerX: function ( v, t ) { return 0.75*Math.sin( 9 * v + 0.2 * t)},
   centerZ: function ( v, t ) { return 0.45*Math.cos( 9 * v + 0.2 * t)},
   materialCover: function ( u, v, t) { return Math.floor( t ) % 20 < 5 ? 0 : 0.8 }		
   
});	// Material: min. 9 materials in multi material array!  index: 0.8 * 10 = 8

```
 View the live version of formLibrary.html: https://rawgit.com/hofk/THREEf.js/dev/formLibrary.html

Parameters briefly explained in THREEf.js:

```javascript

/*	parameter overview	--- all parameters are optional ---

p = {

		// simple properties
	
	indexed,		// indexed or non indexed BufferGeometry
	radius,			// reference radius, multiplier for functions
	height,			// reference height, multiplier for functions
	radiusSegments,		// radius segments (number)
	heightSegments,		// height segments (number)
	circOpen,		// circular connected or disconnected
	withTop,		// with a top
	fixedMatTop,		// fixed given material index (string of digits for faces), overrides materialTop values
	withBottom,		// with a bottom
	fixedMatBottom,		// fixed given material index (string of digits for faces), overrides materialBottom values
	waffled,		// four faces / segment, with center vertex
	quadLine,		// separate quad line, only aviable when circular open
	quadColor,		// color of quad line
	style,			// 'map', 'cover', 'complete'
			
		// functions: u,v and result normally 0 .. 1, otherwise specific / interesting results!
			// ( trigonometric functions often with factor n * PI )
		// u radial, v heigt, t time
	
	rCircHeight,  		//	function ( u, v, t )	// radius depending on segment location
	centerX,		//	function ( v, t )	// centerpoint x by height
	centerY,		//	function ( v, t )	// centerpoint y by height
	centerZ,		//	function ( v, t )	// centerpoint z by height
	unrollCover,		//	function ( v, t )	// 0 closed, 1 linear open (to -1*radius)
	waffleDeep,		//	function ( u, v, t )	// radius difference center vertex	
	moveX,			//	function ( u, v, t )	// factor for radius, move in x direction 
	moveY,			//	function ( u, v, t )	// factor for height, move in y direction
	moveZ,			//	function ( v, u, t )	// factor for radius, move in z direction
	explode,		// 	function ( t )		// factor for exploded view (only non indexed BufferGeometry)
	endCircAngle,		//	function ( v, t )	// circular end angle (per height)
	startCircAngle,		//	function ( v, t )	// circular starting angle (per height)
	scaleCircAngle,		//	function ( u, t )	// scaling between start and end of circular angle
	topHeight,		//	function ( u, t )	// top height (per circular angle)
	bottomHeight,		//	function ( u, t )	// bottom height (per circular angle)
	scaleHeight, 		//	function ( v, t )	// scaling between bottom and top height
	materialTop,		//	function ( u, t )	// material top ( per circular sector)
	materialBottom,		//	function ( u, t )	// material bottom ( per circular sector)
	materialCover,		//	function ( u, v, t )	// material cover ( per circular sector and height )
									// material: round( result*10 ) is material index  0 .. 10
	
		// string array (strings of digits) seperated with a ,
		
	fixedMaterial,	//  fixed given material index, overrides materialCover
	
		// array of center points replaces heightSegments, scaleHeight and the center functions centerX, centerY, centerZ
	
	centerPoints	// array of arrays of coordinates [ [ x0, y0, z0 ], ..  [ xi , yi, zi ] ], values normally 0 .. 1
	
  }
*/

// When using multi material:
// Take index 0 for invisible faces like THREE.MeshBasicMaterial( { visible: false } ),
// or use transparent faces like THREE.MeshBasicMaterial( {transparent: true, opacity: 0.05 } )
		
// Please note!	The functions normally should have results from 0 to 1. If the multimaterial array
// contains fewer materials than the functional result * 10, the script will crash.
// Even if the result is negative.

// String array fixedMaterial contains strings of digits 0 to 9, for instance [ .. '0011997741', '222200' .. ].
// Every string represents a corresponding row of faces from left-top from cover.
// It's not necessary, that the length of array / strings equals the number of faces, e.g. only ['1'] is sufficient.

```

