app.service('Radius', ['$rootScope', function($rootScope) {
	
	var Radius = {};

	Radius.render = function(model) { 
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var point1 = sketchObject.getObjectByName(model.values[0], true);
		var point2 = sketchObject.getObjectByName(model.values[1], true);
		var start = point1.position;
		var end = point2.position;

		var linePoints = new THREE.Geometry();
		linePoints.vertices = [start, end];	

		var value = start.distanceTo(end).toFixed(3)+'mm';

		var screen = {
			x: (start.x+end.x)/2, 
			y: (start.y+end.y)/2
		};

		return { 
			geometry: linePoints, 
			value: value,
			screen: screen,
		}

	}

	return Radius;

}]);