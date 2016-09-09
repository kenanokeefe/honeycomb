app.service('Angle', ['$rootScope', function($rootScope) {
	
	var Angle = {};

	Angle.getByName = function(sketch, name) { //very temp solution, resource problem
		for (var i=0; i<sketch.elements.length; i++){
			var element = sketch.elements[i];
			if(element.name === name) {
				return element;
			}
		}
	}

/*	Angle.calculate = function(model) {
		if(!model.reverse) {
			var nameA = model.values[0];
			var nameB = model.values[1];
		}
		else {
			var nameA = model.values[1];
			var nameB = model.values[0];
		}
		var sketch = $rootScope.getItemByName($rootScope.sketch.name);
		var l1 = Angle.getByName(sketch, nameA);
		var l1p1 = Angle.getByName(sketch, l1.values[0]);
		var l1p2 = Angle.getByName(sketch, l1.values[1]);
		var l2 = Angle.getByName(sketch, nameB);
		var l2p1 = Angle.getByName(sketch, l2.values[0]);
		var l2p2 = Angle.getByName(sketch, l2.values[1]);

		var l1p1V = new THREE.Vector3(l1p1.values[0], l1p1.values[1], 0);
		var l1p2V = new THREE.Vector3(l1p2.values[0], l1p2.values[1], 0);
		var l2p1V = new THREE.Vector3(l2p1.values[0], l2p1.values[1], 0);
		var l2p2V = new THREE.Vector3(l2p2.values[0], l2p2.values[1], 0);

		var vector1 = new THREE.Vector3().subVectors(l1p2V, l1p1V);
		var vector2 = new THREE.Vector3().subVectors(l2p2V, l2p1V);

		var angle1 = Math.atan2(vector1.y, vector1.x);
		angle1 += angle1 < 0 ?  2*Math.PI : 0;

		var angle2 = Math.atan2(vector2.y, vector2.x);
		angle2 += angle2 < 0 ?  2*Math.PI : 0;

		var angle = model.values[2];

		vectorZ = new THREE.Vector3(0, 0, 1);
		vector2.applyAxisAngle(vectorZ, - angle2 + angle1 - angle)
		var result = new THREE.Vector3().addVectors(l2p1V, vector2);

		l2p2.values = [ result.x, result.y ];

	}*/

	Angle.render = function(model) { 

		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var line1 = sketchObject.getObjectByName(model.values[0], true);
		var line2 = sketchObject.getObjectByName(model.values[1], true);

		var points1 = line1.geometry.path.points;
		var vector1 = new THREE.Vector3().subVectors(points1[0], points1[1]);
		var points2 = line2.geometry.path.points;
		var vector2 = new THREE.Vector3().subVectors(points2[1], points2[0]);
		
		var angle1 = Math.atan2(vector1.y, vector1.x);
		angle1 += angle1 < 0 ?  2*Math.PI : 0;

		var angle2 = Math.atan2(vector2.y, vector2.x);
		angle2 += angle2 < 0 ?  2*Math.PI : 0;

		var startAngle = angle1;
		var endAngle = angle2;
		
		var value = angle1 > angle2 ? angle1-angle2 : angle2-angle1;
		value *= (180/Math.PI);

		var circleShape = new THREE.Shape();	
		var circleRadius = 10;	
		circleShape.moveTo( points1[1].x+circleRadius, points1[1].y );
		circleShape.arc(-circleRadius,0, circleRadius, startAngle, endAngle, false);
		var segmentsLength = 25;
		var circlePoints = circleShape.createPointsGeometry(segmentsLength);
		circlePoints.vertices.shift();
		circlePoints.vertices.pop();

		var linePoints = new THREE.Geometry();
		for (var i=0; i<circlePoints.vertices.length; i++) {
			linePoints.vertices.push(circlePoints.vertices[i]);
		}

		//TODO: cant create an arc over (0,0,1)

		//make circle start point at line
		//cant do both rotation and translation
/*		var matrix = new THREE.Matrix4();
		var axis = new THREE.Vector3(0, 0, 1)
		matrix.makeRotationAxis( axis, startAngle );
		matrix.makeTranslation( points1[1].x+circleRadius, points1[1].y, 0 )
		linePoints.applyMatrix( matrix );*/
		
		value = value.toFixed(0);//+'°';

		var vector = new THREE.Vector3(circleRadius,0,0);
		var axis = new THREE.Vector3(0,0,1);
		var angle = (endAngle+startAngle)/2;
		vector.applyAxisAngle(axis, angle);
		var vector = new THREE.Vector3().addVectors(vector, points1[1]);

		var screen = {
			x: vector.x, 
			y: vector.y
		};
	
		return { 
			geometry: linePoints, 
			value: value,
			screen: screen,
		}

	}

	return Angle;

}]);


//if 90deg put a box in corner
//if 180deg put parallel indicator on

//dimension is a THREE.line, but on hover of area a cubeMesh pops up so it can be dragged, or a clear tubeMesh is over it...

//can create an angle from a line if that line is hovered over while L is pending

// tangent constraint??, curve.getTangentAt ( u )
