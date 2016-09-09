EditorTreeController = function($scope, $rootScope, $http, $routeParams, $location, Sketch, Plane) {

	/*
	 tree-item states:
	 closed
	 pending
	 creating 
	 editing
	 error
	 highlighted
	 new
	 */


	 $scope.active_child = function(model) {
	 	if(model.children.length > 0){
	 		for(var i=0; i<model.children.length; i++){
	 			var child = $rootScope.getItemByName(model.children[i]);
	 			if(['creating','editing'].indexOf(child.state) > -1) { 
	 				return false;
	 			}
	 		}
	 		return true;
	 	}
	 	else if(model.children.length == 0) {
	 		return true;
	 	}
	 }

	$scope.actionButtons = [
		{
			id: 'Finish',
			show: function(model){
				if(model.state == "creating" || model.state == "editing") {
					return $scope.active_child(model);
				} else {
					return false;
				}
			},
			click: function(model){
				model.state = 'closed';
				//$rootScope.save_cell($rootScope.cell); console.log('save');
			}
		},
		{
			id: 'Cancel',
			show: function(model){
				if(model.state == "creating" || model.state == "editing" || model.state == "pending") {
					return $scope.active_child(model);
				} else {
					return false;
				}
			},
			click: function(model){
				if(model.state == "creating" || model.state == "pending") {
 					var panel = $rootScope.cellItems;
					var index = panel.indexOf(model);
	  				panel.splice(index, 1); 	 
				}
				else if(model.state == "editing") {
					model.options = canceledOptions;
					if(model.parent) {
						var parent = $rootScope.getItemByName(model.parent);
						canceledOptions = parent.options;
					}
					else {
						canceledOptions = null;
					}
				}
				model.state = 'closed';
				//$rootScope.save_cell($rootScope.cell); console.log('save')
			}
		},
		{
			id: 'Delete',
			show: function(model){
				if(model.state == "closed") {
					return $scope.active_child(model);
				} else {
					return false;
				}
			},
			click: function(model){
				var panel = $rootScope.cellItems;
				var index = panel.indexOf(model);
  				panel.splice(index, 1);
  				//$rootScope.save_cell($rootScope.cell); console.log('save')	 
			}
		},
		//{id: 'Duplicate'},
		//{id: 'Display/Material'}
	]


	$scope.disable = function(model){ 
		//TODO: also disable toolbar if needed
		var treeItems = $rootScope.cellItems;
		for (var i=0; i<treeItems.length; i++){		
			if(['creating','editing','pending'].indexOf(treeItems[i].state) > -1) {
				if(model.state == 'closed' && model.class != 'Folder') {
					return 'disabled';
				}
				return;
			}	
		}
	}

	$scope.edit = function(model) { //console.log(model.index)
		if(model.class == 'Folder'){ //console.log(model)
			if(model.state == 'closed') { model.state = 'opened' }
			else if(model.state == 'opened') { model.state = 'closed' }
		}
		else {
			if (model.state == 'closed') {
				model.state = 'editing';
				canceledOptions = angular.copy(model.options);
				//canceledElements = 
			}
		}
	}

	$rootScope.child_class = function(model) {
		if(model.parent) {
			var parent = $rootScope.getItemByName(model.parent);
			if(parent.state == 'closed') {
				return 'hidden-child';
			}
			else if(parent.class == 'Folder') {
				return 'folder-child';
			}
			else if(parent.class != 'Folder') {
				return 'item-child';
			}
		}
		else {
			return;
		}
	}

	$scope.select_event = function(id) {
		if(id == 'sketchplane') {
			$rootScope.sceneEvent = 'SelectSurface';
		}
		if(id == 'sketch') {
			$rootScope.sceneEvent = 'SelectSketch';
		}
		if(id == 'shape') {
			$rootScope.sceneEvent = 'SelectShape';
		}
	}

	$scope.missing_sketch = function(item) {
		if(item.children.length < 1 && ['Extrude'].indexOf(item.class) > -1) {
			//$rootScope.sceneEvent = 'SelectSketch';
			return true;
		}
		else if(item.class === 'Sketch') {
			return true;
		}
		else {
			return false;
		}
	}

	$scope.csg_class = function(item) {
		for (var i=0; i<item.options.length; i++){
			if(item.options[i].id == 'csg') {
				return item.options[i].val;
			}
		}
	}





	$scope.mouseenter = function(model){
	}

	$scope.mouseleave = function(model){
	}

//Getting error here
/*	$scope.hover = function($index, state, opacity) {
		if ($rootScope.cell.data.references)
		if (state == 'closed') {
			var model = $rootScope.cell.data.references[$index];
			var object = scene.getObjectByName(model.name, true);
			object.material.opacity = opacity;
		}
			//when hover over html item, highlights object in scene
	//when click on object in scene, highlight html item
	}
ng-mouseover="treeItem_hover(indx, reference.state, 0.4)" ng-mouseleave="treeItem_hover(indx, reference.state, 0.2)"
	*/

};

EditorTreeController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'Sketch', 'Plane'];
app.controller('EditorTreeController', EditorTreeController);