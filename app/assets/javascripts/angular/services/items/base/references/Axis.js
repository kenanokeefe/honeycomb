app.service('Axis', ['$rootScope', function($rootScope) {

	var Axis = {}

	Axis.create = function(){
/*		$rootScope.cellItems.push(
			{
				state: 'creating',
				class: 'Axis',
				name: $rootScope.next_name($rootScope.references, 'Axis '),
				options: [
					{id: 'rX', val: 0},
					{id: 'rY', val: 0},
					{id: 'rZ', val: 0},
					{id: 'tX', val: 0},
					{id: 'tY', val: 0},
					{id: 'tZ', val: 0}
				]
			}
		);*/
	}

	Axis.read = function(model) {
/*		var axisGeometry = new THREE.axisGeometry (100, 100, 1, 1);

		var workAxis = new THREE.Mesh( axisGeometry );

		workAxis.name = model.name;
		workAxis.rotation.set (model.options[0].val*(Math.PI/180), model.options[1].val*(Math.PI/180), model.options[2].val*(Math.PI/180));
		workAxis.position.set (model.options[3].val, model.options[4].val, model.options[5].val)
		workAxisObject.add ( workAxis );		*/
	}

	Axis.update = function(model){
/*		var object = scene.getObjectByName(model.name, true);
		object.rotation.set (model.options[0].val*(Math.PI/180), model.options[1].val*(Math.PI/180), model.options[2].val*(Math.PI/180));
		object.position.set (model.options[3].val, model.options[4].val, model.options[5].val);*/
	}

	Axis.delete = function(model){
/*		var object = scene.getObjectByName(model.name, true);
		workAxisObject.remove(object);*/
	}

	return Axis;

}]);

/*

//////////////// Axes //////////////// 
axesObject = new THREE.Object3D(); 
axesObject.name = 'axesObject';

function axes_create(name, rotationX, rotationY, rotationZ) {
	var axesPoints = new THREE.Geometry();
	axesPoints.vertices.push(new THREE.Vector3( 0, -55, 0 ));
	axesPoints.vertices.push(new THREE.Vector3( 0, 55, 0 ));
	axesPoints.computeLineDistances();
	axesLine = new THREE.Line( axesPoints, axesLineMaterial );
	axesLine.rotation.set ( rotationX, rotationY, rotationZ );
	axesLine.name = name;
	axesObject.add ( axesLine );
}

scene.add( axesObject );
axes_create('xzAxes', -Math.PI / 2, 0, 0);
axes_create('yzAxes', 0, 0, Math.PI / 2);
axes_create('xyAxes', 0, 0, 0);

*/