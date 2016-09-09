EditorViewbarController = function($scope, $rootScope, $http, $routeParams, $location) {
	///TODO: setup watch for viewbar buttons
	///ORG: maybe put all view/material stuff in here

	$scope.switch_mesh = function() {
		if($scope.mesh == 'Solid'){
			$scope.mesh = 'Clear';
			resultMeshObject.traverse( function ( object ) { object.material.opacity = 0.25; } );
		}
		else if($scope.mesh == 'Clear'){
			$scope.mesh = 'Solid';
			resultMeshObject.traverse( function ( object ) { object.material.opacity = 1; } );
		}
	}

	$scope.switch_scene = function() {
		if($scope.scene == 'Planes'){
			$scope.scene = 'None'
			referencesObject.traverse( function ( object ) { object.visible = false; } );
		}
		else if($scope.scene == 'None'){
			$scope.scene = 'Planes'
			referencesObject.traverse( function ( object ) { object.visible = true; } );
		}
		//$rootScope.$digest();
	}

	$rootScope.$watch('cell', function(newValue, oldValue) { 
		if(newValue.data) {
			var newItems = newValue.data[0].items;

			var refState = referencesObject.visible;
			$scope.scene = refState ?  'Planes' : 'None';
/*			$scope.mesh = 'Solid';
			//for (var i=0; i<resultMeshObject.children.length; i++){
				var child = resultMeshObject.children[resultMeshObject.children.length-1];
				if(child.material.opacity === 0.25) {$scope.mesh = 'Clear'}
				console.log(child.material.opacity )
			//}*/
			
			//////  Reference Items ////////
/*			var newreferenceItems = [];
			for (var i=0; i<newItems.length; i++){ 
				if(['Plane','Axis'].indexOf(newItems[i].class) > -1) {
					newreferenceItems.push(newItems[i]);
				}
			}
			for (var i=0; i<newreferenceItems.length; i++){
				var item = newreferenceItems[i];
				var reference = referencesObject.getObjectByName(item.name, true); 
				switch (item.state) { 
					case 'closed':
					referencesObject.traverse(function(child) { child.visible = true });
					coordinatesObject.traverse(function(child) { child.visible = false });
					break;
					case 'editing':
					case 'creating':
					break;
				} 
			}	*/		
			//////  Sketch Items ////////
			var newsketchItems = [];
			for (var i=0; i<newItems.length; i++){ 
				if(['Sketch'].indexOf(newItems[i].class) > -1) {
					newsketchItems.push(newItems[i]);
				}
			}
			for (var i=0; i<newsketchItems.length; i++){
				var item = newsketchItems[i]; //console.log(item)
				var sketch = sketchesObject.getObjectByName(item.name, true);
				var parent = null;
				if(item.parent) {
					var parent = $rootScope.getItemByName(item.parent);
				}
				switch (item.state) { 
					case 'closed':
					//if(parent && parent.state != 'closed') { 
						sketch.traverse(function(child) { child.visible = true });	
						sketch.visible = false;
						var xAxis = sketch.getObjectByName('X Axis', true);
						xAxis.visible = false;
						var yAxis = sketch.getObjectByName('Y Axis', true);
						yAxis.visible = false;
					//}
					if(parent && parent.state == 'closed') { //console.log(parent.name)
						sketch.traverse(function(child) { child.visible = false });
					}
/*					if(!parent) { console.log('closed and no parent')
						sketch.traverse(function(child) { child.visible = true });	
						sketch.visible = false;	//TODO: hide all construction?
					}*/
					break;
					case 'editing':
					case 'creating':
					sketch.traverse(function(child) { child.visible = true });
					break;
				} 
			}
			//////  Mesh Items ////////
			var newmeshItems = [];
			for (var i=0; i<newItems.length; i++){  
				if(['Extrude'].indexOf(newItems[i].class) > -1) {
					newmeshItems.push(newItems[i]); 
				}
			}
			for (var i=0; i<newmeshItems.length; i++){
				var item = newmeshItems[i]; //console.log(item)
				switch (item.state) { 
					case 'closed': //hide sketch, workMesh, previousMesh(in resultMesh); show resultMesh if last				
						meshesObject.traverse(function(child) { child.visible = false });
						resultMeshObject.traverse(function(child) { child.visible = false });
						var resultMesh = resultMeshObject.getObjectByName(item.name, true);
						var extrudes = $rootScope.getItemsByClass('Extrude');
						var lastResult = extrudes[extrudes.length-1];
						if(resultMesh.name == lastResult.name){ //console.log(extrudes)
							resultMesh.traverse(function(child) { child.visible = true });
							resultMesh.material.color.set(0xffaa00);
						}
						break;
					case 'editing':
					case 'creating': //show elements, its workMesh, its previousMesh; hide all resultMeshes, if child is editing hide workMesh
						resultMeshObject.traverse(function(child) { child.visible = false });
						meshesObject.traverse(function(child) { child.visible = false });
						if(item.children[0]) {
							var sketch = sketchesObject.getObjectByName(item.children[0], true);
							sketch.traverse(function(child) { child.visible = true });
							sketch.visible = false;
							var xAxis = sketch.getObjectByName('X Axis', true);
							xAxis.visible = false;
							var yAxis = sketch.getObjectByName('Y Axis', true);
							yAxis.visible = false;
							var sketchItem = $rootScope.getItemByName(item.children[0]);
							var workMesh = meshesObject.getObjectByName(item.name, true);
							if(sketchItem.state == 'editing') {
								workMesh.traverse(function(child) { child.visible = false });
							}
							else {
								workMesh.traverse(function(child) { child.visible = true });
							}
						}											
						item.options[3].val == 'join' ?	workMesh.material.color.set(0x009245):'';
						item.options[3].val == 'cut' ?	workMesh.material.color.set(0xFF0000):'';
						if(item.previous) {
							var previousMesh = resultMeshObject.getObjectByName(item.previous, true);		
							previousMesh.traverse(function(child) { child.visible = true });	
						}
						return; ///FIXED: if previous mesh was open, was still looping through rest of meshes
						break;
				}
			}			
		}		
	}, true);


};

EditorViewbarController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location'];
app.controller('EditorViewbarController', EditorViewbarController);