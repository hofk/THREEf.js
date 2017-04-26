# THREEf.js
THREE.js addon, to produce almost infinite many time-varying geometries with functions

//
  @author hofk / http://sandbox.threejs.hofk.de/
//

Inspired by 
https://threejs.org/examples/js/ParametricGeometries.js ( @author zz85 )

Produce almost infinite many time-varying geometrieswith with only 9 properties, 18 functions and 2 arrays:

geometry = new THREE.Geometry(); // base class geometry object from THREE.js
geometry.createMorphGeometry = THREEf.createMorphGeometry; // insert the methode from THREEf.js
geometry.createMorphGeometry(); // apply the methode ( here without parameters: all default )

Include 	<script src="THREEf.js"></script> 

-----------------------------------------------------------------------------------------------------------------
**Example:**

`geometry = new THREE.Geometry();
geometry.createMorphGeometry = THREEf.createMorphGeometry;
geometry.createMorphGeometry({
   height: 80,
   heightSegments: 80,
   rCircHeight: function ( u, v, t ) { return 1.01 + Math.cos( 25.2 * v ) * Math.sin( 0.2 * t ) },
   centerX: function ( v, t ) { return 0.75*Math.sin( 9 * v + 0.2 * t)},
   centerZ: function ( v, t ) { return 0.45*Math.cos( 9 * v + 0.2 * t)},
   materialCover: function ( u, v, t) { return Math.floor( t ) % 20 < 5 ? 0 : 0.8 }		
});	
// Material: min. 9 materials in multi material array!  index: 0.8 * 10 = 8`

Parameters briefly explained in THREEf.js
