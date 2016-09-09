app.service('Coordinates', ['$rootScope', function($rootScope) {

	var Coordinates = {}

	Coordinates.create = function() {

	}

	Coordinates.read = function() {

		coordinatesObject = new THREE.Object3D();
		coordinatesObject.name = "coordinatesObject";
		var axisGeometry = new THREE.CylinderGeometry(0.5, 0.5, 50, 20, 1, true);
		var arrowGeometry = new THREE.CylinderGeometry(0, 2, 4, 20, 1, true);
		coordinatesMaterial = new THREE.MeshBasicMaterial({ color: "rgb(51,51,51)", side: THREE.DoubleSide});

		function coordinates_create(name, rotationX, rotationY, rotationZ, positionX, positionY, positionZ) {
			var axis = new THREE.Mesh (axisGeometry, coordinatesMaterial);
			axis.rotation.set ( rotationX, rotationY, rotationZ );
			axis.position.set ( positionX, positionY, positionZ );
			coordinatesObject.add ( axis );
			var arrow = new THREE.Mesh (arrowGeometry, coordinatesMaterial);
			arrow.rotation.set ( rotationX, rotationY, rotationZ );
			arrow.position.set ( positionX*2, positionY*2, positionZ*2 );
			coordinatesObject.add ( arrow );				
		}

		coordinates_create('xzAxes', Math.PI / 2, 0, 0, 0, 0, 25);
		coordinates_create('yzAxes', 0, 0, -Math.PI / 2, 25, 0, 0);
		coordinates_create('xyAxes', 0, 0, 0, 0, 25, 0);
		var sphereGeometry = new THREE.SphereGeometry( 0.4925, 32, 16 ); 		
		var sphereAxis = new THREE.Mesh(sphereGeometry, coordinatesMaterial);
		coordinatesObject.add ( sphereAxis );	
		coordinatesObject.scale.multiplyScalar( 0.35 );
		scene.add(coordinatesObject);

	}

	Coordinates.update = function() {

	}

	Coordinates.delete = function() {

	}

	return Coordinates;

}]);