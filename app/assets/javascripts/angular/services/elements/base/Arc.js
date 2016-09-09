app.service('ArcElement', ['$rootScope', 'Material', function($rootScope, Material) {

	var ArcElement = {}

	///have points on startpoint, endpoint, and focal point, if startpoint == endpoint make hidden (aka a circle)

	ArcElement.create = function(p1, p2) {
		$rootScope.sketch.elements.push(
			{
				state: 'pending',
				class: 'Arc',
				selected: false,
				name: $rootScope.next_name($rootScope.sketch.elements, 'Arc '),
				values: [p1.name, p2.name]
			}
		);
	}

	//update segmentLength on camera zoom
	ArcElement.read = function(model) {
		var vectors = []
		for (var i=0; i<$rootScope.sketch.elements.length; i++){
			var element = $rootScope.sketch.elements[i];
			if(element.name == model.values[0] || element.name == model.values[1]) {
				vectors.push(new THREE.Vector3( element.values[0], element.values[1], 0 ))
			}
		}
		if(vectors.length == 2)	 {
			var circleShape = new THREE.Shape();	
			var circleRadius = vectors[0].distanceTo(vectors[1]);	
			circleShape.moveTo( vectors[0].x + circleRadius, vectors[0].y);
			//can make it an ellipse here:
			circleShape.arc(-circleRadius,0, circleRadius, 0, 2.0*Math.PI, false);
			var segmentsLength = 10+circleRadius/10;
			var circlePoints = circleShape.createPointsGeometry(segmentsLength);

			//TODO: rotate arc so it starts at cursor
						
			var path = new THREE.SplineCurve3(circlePoints.vertices);
			var geometry = new THREE.TubeGeometry(path, circlePoints.vertices.length-1, 0.25, 8, false, true); //need to ensure that the points match the points rendered in mesh

			tubeMesh = new THREE.Mesh( geometry );
			tubeMesh.name = model.name;
			tubeMesh.material = Material.element(model);

/*			var axis = new THREE.Vector3(vectors[0].x, vectors[0].y, 1);
			var angle = Math.atan2(vectors[1].y, vectors[1].x);
			tubeMesh.rotateOnAxis( axis, angle );*/

			var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
			sketchObject.add(tubeMesh); //console.log(circleShape)
		}
	}

	ArcElement.update = function(model) {
		ArcElement.delete(model);
		ArcElement.read(model);
	}

	ArcElement.delete = function(model) {
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var object = sketchObject.getObjectByName(model.name, true);
		sketchObject.remove(object);
	}

	return ArcElement;

}]);




/*	function(p1, radius){
		this.state = 'pending';
		this.class = 'Arc';
		this.name = Element.next_name(this.class);
		this.rotation = 0;
		this.scale = {x: 1, y: 1};
		this.position = {x: 0, y: 0};	
		
		this.centerPoint = 'pointName';
		this.radius = 0;	
	}

	//I'm applying methods to the model itself
	//To update do var.update();
	// sketch.delete(element);
	//would i be addeding the method scripts inside the json file?

		Sketch.add(new Element.Arc())
	A.prototype = {
		read:
		update:
		delete:
	}*/