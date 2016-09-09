app.service('Projector', ['$rootScope', function($rootScope) {

	var Projector = {}

	Projector.unproject = function(event) { //screen space to 3d space
		var mouse = {}; //console.log(event)
		var x = event.offsetX==undefined?event.pageX-45:event.offsetX;
		var y = event.offsetY==undefined?event.pageY-25:event.offsetY;
		//console.log($('canvas'))
		//console.log(x+', '+y)
		mouse.x = ( x / $('#Scene').innerWidth()) * 2 -1;
		mouse.y = -( y / $('#Scene').innerHeight()) * 2 + 1;
		var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
		var newProjector = new THREE.Projector();
		newProjector.unprojectVector( vector, camera );
		raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

		//$(".clickMarkers").remove();
		//$('#Scene').append('<div class="clickMarkers" style="border-top: solid 1px; border-left: solid 1px; pointer-events:none; position: absolute; z-index: 100; left: ' + event.offsetX + 'px; top: ' + event.offsetY +'px">click</div>' );	
	}

	Projector.project = function(xVariable, yVariable) { //3d space to screen space
		var widthHalf = $('#Scene').innerWidth() / 2;
		var heightHalf = $('#Scene').innerHeight() / 2;
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var matrix = sketchObject.matrix.clone();
		var projectVector = new THREE.Vector3(xVariable, yVariable, 0 ).applyMatrix4( matrix.transpose() );
		var newProjector = new THREE.Projector();
		newProjector.projectVector( projectVector, camera );
		projectVector.x = ( projectVector.x * widthHalf ) + widthHalf;
		projectVector.y = - ( projectVector.y * heightHalf ) + heightHalf; //console.log(projectVector)
		return projectVector;
		//LEARNED: .transpose() converts the actual matrix, needed to create clone...
	}

/*	Projector.project2 = function(xVariable, yVariable) { //3d space to screen space
		var widthHalf2 = $('#Scene').innerWidth() / 2;
		var heightHalf2 = $('#Scene').innerHeight() / 2;
		var sketchObject2 = scene.getObjectByName($rootScope.sketch.name, true);
		var projectVector2 = new THREE.Vector3(xVariable, yVariable, 0 ).applyMatrix4(sketchObject2.matrix.transpose() );
		var newProjector2 = new THREE.Projector();
		newProjector2.projectVector( projectVector2, camera );
		projectVector2.x = ( projectVector2.x * widthHalf2 ) + widthHalf2;
		projectVector2.y = - ( projectVector2.y * heightHalf2 ) + heightHalf2; //console.log(projectVector)
		return projectVector2;
	}*/

	Projector.select = function(selectables) {
		var intersects = raycaster.intersectObjects( selectables, false );
		if(intersects.length > 0) {
			if ( intersected ) {  //clears hovered
				intersected.material = intersected.default; 
				//intersected.scale.set(1,1,1);
			}
			return intersects[0].object.name;
		}
	}

	Projector.snap = function(selectable) {
		var intersects = raycaster.intersectObject( selectable, false );
		if(intersects.length > 0) { //console.log($rootScope.sketch)
			var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
			intersects[0].point.applyMatrix4( sketchObject.matrix.transpose() );
			snap = {};
			var precision = 0.001; //let makers change this
			snap.x = Math.round(intersects[ 0 ].point.x/precision)*precision;
			snap.y = Math.round(intersects[ 0 ].point.y/precision)*precision;
			return snap;
		}
	}

	Projector.hover = function(selectables) {
		var intersects = raycaster.intersectObjects( selectables, false );
		if(intersects.length > 0) {
			if ( intersects[ 0 ].object != intersected ) { //intersected defined in init rake $watch
				if ( intersected ) { intersected.material = intersected.default } //on hover switch
				intersected = intersects[ 0 ].object; 
				intersected.material = intersected.focus;
				$rootScope.cursor = 'selected';
			}	
		}
		else { //on off hover
			if ( intersected ) { intersected.material = intersected.default }
			$rootScope.cursor = 'select';
			intersected = null;
		}	
	}

	Projector.delete = function() {

	}

	return Projector;

}]);