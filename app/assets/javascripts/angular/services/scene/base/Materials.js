app.service('Materials', ['$rootScope', function($rootScope) {

	var Materials = {}

//NOTE: 'location is not from current program' error was due to Materials not loading from external file
//might be b/c of the fact that were creating a new material

	Materials.planeFace = new THREE.MeshBasicMaterial({ color: 0xFFCC00, opacity: 0.2, wireframe: false, side: THREE.DoubleSide, transparent: true, depthWrite: false });

	Materials.planeWireframe = new THREE.MeshBasicMaterial({ color: 0x999999, opacity: 1,  wireframe: true, transparent: true });
	
	Materials.coordinates = new THREE.MeshBasicMaterial({ color: "rgb(51,51,51)", side: THREE.DoubleSide});


	return Materials;

}]);


/*

types:
flat
phong
lambert
bitmap

//////////////////////////////////////////////
//////////////// MATERIALS //////////////// 

var lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1, transparent: true, opacity: 0} );
var LineDashedMaterial = new THREE.LineDashedMaterial( { color: 0x000000, opacity: 0.25, dashSize: 1, gapSize:0.5 } );
var dimensionLineMaterial = new THREE.LineDashedMaterial( { color: 0x000000, opacity: 0.25, dashSize: 1, gapSize:0.5 } );
var refLineMaterial = new THREE.LineDashedMaterial( { color: 0x000000, opacity: 0.5, dashSize: 0.5, gapSize:0.5 } ); //TODO: change size based on sceneScale
var unselectedMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
var selectedMaterial = new THREE.MeshBasicMaterial({color: 0x0000FF});
var meshColoredMaterial = new THREE.MeshPhongMaterial( { ambient: 0x000000, color: 0xffaa00, specular: 0x555555, shininess: 30 } );
var meshTransparentMaterial = new THREE.MeshPhongMaterial( { ambient: 0xffaa00, color: 0xffaa00, specular: 0x555555, shininess: 30, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false} );
var meshWireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
var meshAddPreviewMaterial = new THREE.MeshPhongMaterial( { ambient: 0x000000, color: 0x33CC33, specular: 0x555555, shininess: 30, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false} );
var meshCutPreviewMaterial = new THREE.MeshPhongMaterial( { ambient: 0x000000, color: 0xFF0000, specular: 0x555555, shininess: 30, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false} );
var meshNormalMaterial = new THREE.MeshBasicMaterial({color:  0x000000});
var planeFace = new THREE.MeshBasicMaterial({ color: 0xFFCC00, opacity: 0.2, wireframe: false, side: THREE.DoubleSide, transparent: true, depthWrite: false });
var planeWireframe = new THREE.MeshBasicMaterial({ color: 0x999999, opacity: 1,  wireframe: true, transparent: true });
var printBedMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, wireframe: true });
var axesLineMaterial = new THREE.LineDashedMaterial( { color: 0x999999, opacity: 1, dashSize: 2, gapSize: 1} );
var coordinatesMaterial = new THREE.MeshBasicMaterial({ color: "rgb(51,51,51)", side: THREE.DoubleSide});

*/