app.service('Transform', ['$rootScope', 'Projector', function($rootScope, Projector) {

	var Transform = {}

	Transform.cursor = 'default';

	//ORG: begin breaking each transform type into other services?
	Transform.cursorHover = function($event) {
		var transformBox = scene.getObjectByName('transformBox', true);
		if (transformBox) {
			var hoveredName = Projector.select(transformBox.children);
			hoveredName ? 
			$rootScope.cursor = hoveredName : 
			$rootScope.cursor = 'default';
		}
	}

	Transform.pBaseClick = function($event) {
		//if click on transformBox move pBase there
	}

	Transform.read = function() {
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var selectedElements = Element.getBySelected($rootScope.sketch);
		var selected = []; //includes max/min vectors
		for (var i=0; i<selectedElements.length; i++){
		var select = sketchObject.getObjectByName(selectedElements[i].name, true);
		select.geometry.computeBoundingBox();
		selected.push(select.geometry.boundingBox);	
		}
		var max = {x: selected[0].max.x, y: selected[0].max.y};
		var min = {x: selected[0].min.x, y: selected[0].min.y};
		//var max = {x: 20, y: 20};
		//var min = {x: -10, y: -10};

		for (var i=1; i<selected.length; i++){
			if(selected[i].max.x > max.x) {
				max.x = selected[i].max.x;
			}
			if(selected[i].max.y > max.y) {
				max.y = selected[i].max.y;
			}
			if(selected[i].min.x < min.x) {
				min.x = selected[i].min.x;
			}
			if(selected[i].min.y < min.y) {
				min.y = selected[i].min.y;
			}
		}
		var offset = 5; //changes based on zoom
		max.x += offset;
		max.y += offset;
		min.x -= offset;
		min.y -= offset;

		//TODO: learn if positions are relative to their parents
		//var planeGeometry = new THREE.PlaneGeometry (max.x-min.x, max.y-min.y, 1, 1);
		var boxGeometry = new THREE.Geometry();
		boxGeometry.vertices = [
			new THREE.Vector3(min.x, max.y, 0), 
			new THREE.Vector3(max.x, max.y, 0), 
			new THREE.Vector3(max.x, min.y, 0), 
			new THREE.Vector3(min.x, min.y, 0), 
			new THREE.Vector3(min.x, max.y, 0)
		];
		var transformBox = new THREE.Line( boxGeometry );

		transformBox.material.color.set(0x7A2929);
		transformBox.name = 'transformBox';

		var geometry = new THREE.CubeGeometry(1, 1, 1);
		var mesh = new THREE.Mesh( geometry );
		var rO = 1;
		var points = [
			{ name: 'pN', position: [(min.x+max.x)/2, max.y] },
			{ name: 'pNE', position: [max.x, max.y] },
			{ name: 'pE', position: [max.x, (min.y+max.y)/2] },
			{ name: 'pSE', position: [max.x, min.y] },
			{ name: 'pS', position: [(min.x+max.x)/2, min.y] },
			{ name: 'pSW', position: [min.x, min.y] },
			{ name: 'pW', position: [min.x, (min.y+max.y)/2] },
			{ name: 'pNW', position: [min.x, max.y] },
			{ name: 'pBase', position: [(min.x+max.x)/2, (min.y+max.y)/2] },
			{ name: 'pNErotate', position: [max.x+rO, max.y+rO] },
			{ name: 'pSErotate', position: [max.x+rO, min.y-rO] },
			{ name: 'pSWrotate', position: [min.x-rO, min.y-rO] },
			{ name: 'pNWrotate', position: [min.x-rO, max.y+rO] },
		];
		for (var i=0; i<points.length; i++){ 
			var point = mesh.clone();
			point.position.set (points[i].position[0], points[i].position[1], 0);
			point.name = points[i].name;
			point.material.color.set(0x7A2929);
			if(points[i].name == 'pBase') {
				point.material = new THREE.MeshBasicMaterial({ color: 0x7A2929, wireframe: true})
				point.scale.set(3, 3, 3);
			}
			transformBox.add ( point );
		}
		
		sketchObject.add ( transformBox ); //console.log(transformBox)			
	}

	Transform.delete = function() { 
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var object = sketchObject.getObjectByName('transformBox', true);
		sketchObject.remove(object); //console.log(object)
	}

	Transform.leftClick = function($event) {

	}

	Transform.doubleClick = function($event) {
	}



	Transform.mouseUp = function($event) {
	}

	return Transform;

}]);

/*

//var planeGeometry = new THREE.PlaneGeometry (max.x-min.x, max.y-min.y, 1, 1);
//var transformBox = new THREE.BoxHelper( boxHelper );
//transformBox.position.set((min.x+max.x)/2, (min.y+max.y)/2, 0);

appears when multiples lines/arcs are selected
appears after a line/arc was dragged

rotate and scale cubes w/ camera
icons in corner to change state of selected: lock, construction, duplicate (R&T don't change w/ camera) SHIFT+L,SHIFT+C,SHIFT+D

should be able to lock points...

press SHIFT to keep aspect on scale and stretch - could get away with making all scale keep aspect, they can stregth with sides - don't have to do both at same time?

on move, has to be dragged from base point?
on move, ALT copies 

on rotate need a center point

ALT make center base point

if element is fully constrained, use not-allowed cursor, try to highlight the driven dimensions that are limiting RSTbox

have to decide when to relax or break constrains... 

event order:
1. click inside box selects base point (default is center) (focal point changes to hover)
2. click on scale/stretch/base point starts change (hover changes cursor to event type)
3. value boxes pop up as denoted below
4. click ends the change

on each RST, a measure input box pops up to enter precise change:
move - create temp line between old and new base point (let maker chose length/angle or X/Y) should be simple trig math to calculate, allows 2 inputs out of the 4
scale - scale factor
rotate - angle

*/