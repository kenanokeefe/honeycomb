app.service('MirrorF', ['$rootScope', function($rootScope) {

	var MirrorF = {}

	MirrorF.leftClick = function(snap) {
		//have to select to lines
		//have to select mirror line
	}

	MirrorF.render = function(pendings, snap) {
		//copy elements
		//create a mirror matrix to use...
	}

	return MirrorF;

}]);


/*

function Mirror_activate() {
	MirrorMesh = newMesh.clone();
	MirrorMesh.position.set(newMesh.position.x*-1, newMesh.position.y, newMesh.position.z);
	MirrorMesh.material = new THREE.MeshBasicMaterial( {color:  0x33CC33, transparent: true, opacity: 0.5, depthWrite: false  } )
	scene.add(MirrorMesh);
	console.log(newMesh);
	//just makes x position negative
	//copys mesh, changes vetices
	//select mirror plane
	//move or copy
}

*/