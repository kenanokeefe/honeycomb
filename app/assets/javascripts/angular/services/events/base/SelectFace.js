app.service('SelectFace', ['$rootScope', 'Projector', 'Plane', function($rootScope, Projector, Plane) {

	var SelectFace = {}

	SelectFace.cursor = 'select';

	SelectFace.leftClick = function($event) {

		var results = resultMeshObject.children;
		var mesh = results[results.length-1];
		//mesh.geometry.computeFaceNormals();
		//console.log(mesh)
		//just for testing
		//referencesObject.traverse(function(child) { child.visible = false });

		Projector.unproject($event);
		var intersects = raycaster.intersectObject( mesh, false );
		if(intersects && $event.button == 0) {
			if(intersects.length > 0) {
				if ( intersects[ 0 ].object != intersected ) { 
					if ( intersected ) { intersected.face.color = new THREE.Color() }
					intersected = intersects[ 0 ];  
					intersected.face.color.set( 0x0000FF ); 
					intersected.object.geometry.colorsNeedUpdate = true;

					Plane.create();
					var planeItem = $rootScope.last_item(); console.log(planeItem)
					planeItem.state = 'closed'; 
					var planeObject = referencesObject.getObjectByName(planeItem.name, true);
					
					planeObject.lookAt(intersected.face.normal);
					var vIndex = intersected.face.a;
					var vPos = intersected.object.geometry.vertices[vIndex];
					planeObject.position = vPos; //

/*					var testName = scene.getObjectByName('testPlane', true);
					if(testName)(scene.remove(testPlane))
					var planeGeometry = new THREE.PlaneGeometry (100, 100, 1, 1);
					testPlane = new THREE.Mesh(planeGeometry);
					testPlane.material = new THREE.MeshBasicMaterial({ opacity: 0.5, wireframe: false, side: THREE.DoubleSide, transparent: true, depthWrite: false });
					testPlane.material.color.setRGB( Math.random(),Math.random(),Math.random());
					testPlane.name = 'testPlane';
					scene.add(testPlane)
					*/

					




					//IDEA: could run script to name and group each face of the resultMesh, faces with same normal&&position would be grouped somehow
					///but when i update the mesh, the face name could be anything...
				}	
			}
		}

/*		var clickedName = Projector.select(referencesObject.children);
		if(clickedName && $event.button == 0) {
			var treeItems = $rootScope.cell.data[0].items;
			for (var j=0; j<treeItems.length; j++){
				var item = treeItems[j];
				if(item.class == 'Sketch' && item.state == 'pending') {
					item.options[0].val = clickedName;
					item.state = 'creating';
				}
			}	
		}*/
	}

	SelectFace.doubleClick = function($event) {

	}

	SelectFace.hover = function($event) {
		Projector.unproject($event);
		//Projector.hover(referencesObject.children);
		//clear hovered when leaving sceneEvent

		//var results = resultMeshObject.children;
		//var mesh = results[results.length-1];



	}

	return SelectFace;

}]);