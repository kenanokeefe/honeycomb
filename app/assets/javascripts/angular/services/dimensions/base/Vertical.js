app.service('Vertical', ['$rootScope', 'Material', 'Element', function($rootScope, Material, Element) {
	
	var Vertical = {};

	Vertical.create = function(element1, element2) {
		var model = {
			state: 'driving',
			class: 'Vertical',
			selected: false,
			reverse: false,
			update: null,
			name: $rootScope.next_name($rootScope.sketch.dimensions, 'Vertical '),
			values: [
			element1.name, 
			element2.name,
			null,                                 //the value
			{
				x: null,                          //coordinate for dim-box
				y: null
			}
			]
		}
		return model;
	}

	Vertical.read = function(model) {
		var nameA = (!model.reverse) ? model.values[0] : model.values[1];
		var nameB = (!model.reverse) ? model.values[1] : model.values[0];

		var sketchItem = $rootScope.getItemByName($rootScope.sketch.name);
		var p1Item = Element.getByName(sketchItem, nameA);
		var p2Item = Element.getByName(sketchItem, nameB);

		if(model.state === 'driving') {
			p2Item.values[0] = p1Item.values[0];
		}

		var linePoints = new THREE.Geometry();
		var start = Element.pointToVector(p1Item);
		var end = Element.pointToVector(p2Item);
		linePoints.vertices = [start, end];

		linePoints.computeLineDistances();
		dimensionLine = new THREE.Line( linePoints );
		dimensionLine.name = model.name;
		dimensionLine.material = Material.dimension(model);
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		sketchObject.add(dimensionLine);
	}

	Vertical.update = function(model) { 
		Vertical.delete(model);
		Vertical.read(model);
	}

	Vertical.delete = function(model) {
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var object = sketchObject.getObjectByName(model.name, true);
		sketchObject.remove(object);
	}

	return Vertical;

}]);