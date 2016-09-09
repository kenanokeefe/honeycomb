app.service('Distance', ['$rootScope', 'Element', 'Material' , function($rootScope, Element, Material) {
	
	var Distance = {};

	Distance.create = function(element1, element2) {
		var model = {
			state: 'pending',
			class: 'Distance',
			selected: false,
			reverse: false,
			update: null,
			name: $rootScope.next_name($rootScope.sketch.dimensions, 'Distance '),
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

	Distance.read = function(model) {
		if(model.state === 'driving') {
			var nameA = (!model.reverse) ? model.values[0] : model.values[1];
			var nameB = (!model.reverse) ? model.values[1] : model.values[0];

			var sketch = $rootScope.getItemByName($rootScope.sketch.name);
			var p1 = Element.getByName(sketch, nameA);
			var p2 = Element.getByName(sketch, nameB);
			var start = new THREE.Vector3(p1.values[0], p1.values[1], 0);
			var end = new THREE.Vector3(p2.values[0], p2.values[1], 0);

			var sumVector = new THREE.Vector3().subVectors(end, start);
			sumVector.setLength( model.values[2] );

			var endPoint = new THREE.Vector3().addVectors(start, sumVector);

			p2.values = [ endPoint.x, endPoint.y ];
			Element[p2.class].update(p2);

			//point is fully defined if its x/y is definite - coincident
			//can lock a point or line(it's two points) - no dimensions can change it

			//create right click dialog to change selected to locked or construction, cut copy paste delete, list all dimensions  (show shortcuts for each)
		}

		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var point1 = sketchObject.getObjectByName(model.values[0], true);
		var point2 = sketchObject.getObjectByName(model.values[1], true);
		var start = point1.position;
		var end = point2.position;

		var sumVector = new THREE.Vector3().subVectors(end, start);
		if( end.y > start.y ){
			var angle = Math.PI/2+sumVector.angleTo(new THREE.Vector3(1,0,0))
		}
		else {
			var angle = Math.PI/2-sumVector.angleTo(new THREE.Vector3(1,0,0))
		}
		var side = (end.x > start.x) ? 7 : -7; //+drag offset
		var tanVector = new THREE.Vector3(side,0,0).applyAxisAngle(new THREE.Vector3(0,0,1),angle)
		var startTanPoint = new THREE.Vector3().addVectors(start, tanVector);
		var endTanPoint = new THREE.Vector3().addVectors(end, tanVector);

		var linePoints = new THREE.Geometry();
		linePoints.vertices.push(start);
		linePoints.vertices.push(startTanPoint);
		linePoints.vertices.push(endTanPoint);
		linePoints.vertices.push(end);

		if(model.state !== 'driving' && model.state !== 'editing') {
			model.values[2] = start.distanceTo(end).toFixed(3);//+'mm';
		}

		model.values[3] = {
			x: (startTanPoint.x+endTanPoint.x)/2, 
			y: (startTanPoint.y+endTanPoint.y)/2
		};

		linePoints.computeLineDistances();
		dimensionLine = new THREE.Line( linePoints );
		dimensionLine.name = model.name;
		dimensionLine.material = Material.dimension(model);
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		sketchObject.add(dimensionLine);
	}

	Distance.update = function(model) { 
		Distance.delete(model);
		Distance.read(model);
	}

	Distance.delete = function(model) {
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var object = sketchObject.getObjectByName(model.name, true);
		sketchObject.remove(object);
	}

	return Distance;

}]);