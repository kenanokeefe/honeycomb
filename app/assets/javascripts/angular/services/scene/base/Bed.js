/*

//////////////// Print Bed /////////////////
printBedObject = new THREE.Object3D(); 
printBedObject.name = 'printBedObject';

var printBed = new THREE.Mesh ( new THREE.CubeGeometry (225,150,145), printBedMaterial );
printBed.name = "printBed";
printBed.position.set ( 0, 0, 0 );
printBedObject.add(printBed);
var printFloor = new THREE.Mesh (new THREE.PlaneGeometry (225, 145, 1, 1), meshTransparentMaterial);
printFloor.rotation.x = -Math.PI / 2;
printFloor.position.set ( 0, -75, 0 );
printBedObject.add(printFloor);

scene.add( printBedObject );
object_visibility(printBedObject, false, false);
	 
$('#printBed').click(function(){
	$(this).toggleClass('active');
	if(	$(this).hasClass('active')) {
	object_visibility(printBedObject, true, true);
	} else {
		object_visibility(printBedObject, false, false);
		}
});	

*/