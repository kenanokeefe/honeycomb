app.service('SelectShape', ['$rootScope', 'Projector', 'Plane', function($rootScope, Projector, Plane) {

	var SelectShape = {}

	SelectShape.cursor = 'select';

	SelectShape.activeItem = function() {
		var items = $rootScope.cell.data[0].items;
		for (var i=0; i<items.length; i++){
			var item = items[i];  
			if(['creating','editing','pending'].indexOf(item.state) > -1 && item.children.length > 0) {  
				return item; 
			}
		}
	}

	SelectShape.sketchShapes = function(item) {
		var shapes = [];
		if(item) {
			var sketchObject = sketchesObject.getObjectByName(item.children[0], true);
			for (var j=0; j<sketchObject.children.length; j++){
				if(sketchObject.children[j].name.indexOf('Shape') > -1) {
					shapes.push(sketchObject.children[j]); 
				}
			}
			return shapes;
		} 
	}

	SelectShape.leftClick = function($event) {
		if($event.button == 0) {
			Projector.unproject($event);
			var item = SelectShape.activeItem();
			var shapes = SelectShape.sketchShapes(item);
			if(shapes) {
				var intersects = raycaster.intersectObjects( shapes, false );
				if(intersects.length > 0) {
					var intersected = intersects[ 0 ].object;
					//if hidden - push shape
					//if solid - splice shape
					//if only solid - do nothing
					item.options[0].shapes.push(intersected.name); console.log(intersected.name)
					/*
					item.options[0].val = 1 //make length of item.options[0].shapes
					*/
				}
			}
		}
	}

	SelectShape.doubleClick = function($event) {

	}

	SelectShape.hover = function($event) {
		Projector.unproject($event);
		var item = SelectShape.activeItem(); 
		var shapes = SelectShape.sketchShapes(item);
		var focus = new THREE.MeshBasicMaterial({ color: 0x804923, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false});
		var hidden = new THREE.MeshBasicMaterial({ color: 0x804923, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false});
		var solid = new THREE.MeshBasicMaterial({ color: 0x804923, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false});
		if(shapes) {
			var intersects = raycaster.intersectObjects( shapes, false );
			if(intersects.length > 0) {
				if ( intersects[ 0 ].object != intersected ) { //intersected defined in init rake $watch
					if ( intersected ) {	intersected.material = eval(intersected.type) } //on hover switch
					intersected = intersects[ 0 ].object; 
					//make all hover material 0.5 opacity, solid shapes are 0.75, hidden shapes are 0
					//if only solid, don't change material, make cursor no action
					intersected.material = focus;
					$rootScope.cursor = 'selected';
				}	
			}
			else { //on off hover
				if ( intersected ) { intersected.material = eval(intersected.type) }
				$rootScope.cursor = 'select';
				intersected = null;
			}	
		}
	}

	return SelectShape;

}]);