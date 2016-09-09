app.service('LineElement', ['$rootScope', 'Material', function($rootScope, Material) {

	var LineElement = {}

	//make this like, var line = new WAX.Line(point1, point2)?
	//$rootScope.sketch.elements.push(line);
	LineElement.create = function(point1, point2) {
		$rootScope.sketch.elements.push(
			{
				state: 'pending', //need this so i can clear them
				class: 'Line',
				selected: false,
				name: $rootScope.next_name($rootScope.sketch.elements, 'Line '),
				values: [ point1.name, point2.name ]
			}
		);
	}

	LineElement.read = function(model) { 
		var vectors = []
		for (var i=0; i<$rootScope.sketch.elements.length; i++){
			var element = $rootScope.sketch.elements[i];
			if(element.name == model.values[0] || element.name == model.values[1]) {
				vectors.push(new THREE.Vector3( element.values[0], element.values[1], 0 ))
			}
		}
		if(vectors.length == 2)	 {
			var path = new THREE.SplineCurve3(vectors);
			var geometry = new THREE.TubeGeometry(path, vectors.length-1, 0.25, 8, false, true);
			geometry.path.needsUpdate = true;
			geometry.verticesNeedUpdate = true;
			geometry.dynamic = true;
			tubeMesh = new THREE.Mesh( geometry ); //add material
			tubeMesh.name = model.name;
			tubeMesh.material = Material.element(model);
			var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
			sketchObject.add(tubeMesh); //console.log(tubeMesh)
		}	
		//figure out LOD, figure out projector click/hover, marquee
	}

	LineElement.update = function(model) {
		LineElement.delete(model);
		LineElement.read(model);
	}

	LineElement.delete = function(model) {
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var object = sketchObject.getObjectByName(model.name, true);
		sketchObject.remove(object);
	}

	return LineElement;

}]);



		//possible solution is that i create my own TubeGeometry script to update vertices
/*		var vectors = []
		for (var i=0; i<$rootScope.sketch.elements.length; i++){
			var element = $rootScope.sketch.elements[i];
			if(element.name == model.values[0] || element.name == model.values[1]) {
				vectors.push(new THREE.Vector3( element.values[0], element.values[1], 0 ))
			}
		}
		var object = scene.getObjectByName(model.name, true); 
		if(vectors.length == 2)	 {
			object.geometry.path.points = vectors;
		}*/

/*
	//don't know if this works yet, right now deleting then reading each time 
		var vectors = []
		for (var i=0; i<model.points.length; i++){
			vectors.push(new THREE.Vector3( model.points[i].x, model.points[i].y, 0 ))
		}	
		var object = scene.getObjectByName(model.name, true);
		object.geometry.path.points = vectors;



//ng-copy, recognizes when something has been copied, can use when copying sketch lines, change cursor


for testing doing random color is good b/c I can see if it is creating a new mesh or not


TODO: figure out how to change render order, so when something is clicked or hovered it renders in front of others


//new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);
//main goal is to get the shape, need to figure that out...


*/