app.service('PointElement', ['$rootScope', 'Material', function($rootScope, Material) { 

	var PointElement = {}

	PointElement.create = function(x, y) {
		$rootScope.sketch.elements.push(
			{
				state: 'pending',
				class: 'Point',
				selected: false,
				name: $rootScope.next_name($rootScope.sketch.elements, 'Point '),
				values: [ x, y	]
			}
		);
	}

	PointElement.read = function(model) {
		var geometry = new THREE.CubeGeometry(1, 1, 1);
		var pointMesh = new THREE.Mesh( geometry );
		pointMesh.position.set (model.values[0], model.values[1], 0);
		pointMesh.name = model.name;
		pointMesh.material = Material.element(model);
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);			
		sketchObject.add(pointMesh);
	}

	PointElement.update = function(model) {
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var object = sketchObject.getObjectByName(model.name, true);
		object.position.set (model.values[0], model.values[1], 0);
		object.material = Material.element(model);
		//update rotation to camera
		//object.rotation.set (model.options[0].val*(Math.PI/180), model.options[1].val*(Math.PI/180), model.options[2].val*(Math.PI/180));
		//update scale to zoom
		//update position on pending lines
	}

	PointElement.delete = function(model) { //can i delete points? bc then ref points are gone
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var object = sketchObject.getObjectByName(model.name, true);
		sketchObject.remove(object);
	}

	//make a material function, pass model, based on state and selected property, return material

	return PointElement;

}]);
