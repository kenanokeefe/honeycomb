app.service('Plane', ['$rootScope', function($rootScope) {

	var Plane = {}

	Plane.create = function(){
		$rootScope.cellItems.push(
			{
				state: 'creating',
				class: 'Plane',
				name: $rootScope.next_name($rootScope.cellItems, 'Plane '),
				index: $rootScope.next_index(),
				options: [
					{id: 'rX', type: 'number', val: 0},
					{id: 'rY', type: 'number', val: 0},
					{id: 'rZ', type: 'number', val: 0},
					{id: 'tX', type: 'number', val: 0},
					{id: 'tY', type: 'number', val: 0},
					{id: 'tZ', type: 'number', val: 0}
				],
				children: [],
				parent: null
			}
		);	
		//var folder = $rootScope.getItemByName('References'); 	
		//var plane = $rootScope.last_item();
		//folder.children.push(plane.name);
	}

	Plane.read = function(model) {
		var planeGeometry = new THREE.PlaneGeometry (100, 100, 1, 1);
		planeGeometry.computeBoundingBox();
		var b = planeGeometry.boundingBox;
		var planePoints = new THREE.Geometry();
		planePoints.vertices = [new THREE.Vector3(b.min.x, b.max.y, 0), b.max, new THREE.Vector3(b.max.x, b.min.y, 0), b.min, new THREE.Vector3(b.min.x, b.max.y, 0)];
		var planeFace = new THREE.MeshBasicMaterial({ color: 0xFFCC00, opacity: 0.2, wireframe: false, side: THREE.DoubleSide, transparent: true, depthWrite: false });
		var planeWireframe = new THREE.LineBasicMaterial({ color: 0x999999, opacity: 1,  wireframe: true, transparent: true });

		var workplane = new THREE.Mesh( planeGeometry, planeFace);
		var planeBorder = new THREE.Line( planePoints, planeWireframe);
		workplane.add( planeBorder );
		workplane.name = model.name;
		workplane.rotation.set (model.options[0].val*(Math.PI/180), model.options[1].val*(Math.PI/180), model.options[2].val*(Math.PI/180));
		workplane.position.set (model.options[3].val, model.options[4].val, model.options[5].val)
		workplane.focus = new THREE.MeshBasicMaterial({ color: 0xFFCC00, opacity: 0.5, wireframe: false, side: THREE.DoubleSide, transparent: true, depthWrite: false });
		workplane.default = new THREE.MeshBasicMaterial({ color: 0xFFCC00, opacity: 0.2, wireframe: false, side: THREE.DoubleSide, transparent: true, depthWrite: false });
		referencesObject.add ( workplane );	
		//console.log(workplane)	
	}

	Plane.update = function(model){
		var object = scene.getObjectByName(model.name, true);
		object.rotation.set (model.options[0].val*(Math.PI/180), model.options[1].val*(Math.PI/180), model.options[2].val*(Math.PI/180));
		object.position.set (model.options[3].val, model.options[4].val, model.options[5].val);
	}

	Plane.delete = function(model){
		var object = scene.getObjectByName(model.name, true);
		referencesObject.remove(object);
		
	}

	//// States ////
	Plane.closed = function(model) {
		$rootScope.save_cell($rootScope.cell);
		//console.log('plane now closed')
	}

	Plane.pending = function(model) {
		//console.log('plane now pending')
	}

	Plane.creating = function(model) {
		//console.log('plane now creating')
	}

	Plane.editing = function(model) {
		//console.log('plane now editing')
	}	

	return Plane;

}]);