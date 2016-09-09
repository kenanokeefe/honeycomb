EditorToolbarController = function($scope, $rootScope, $http, $routeParams, $location, Sketch, Extrude, Plane, Axis) {
//, ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'Sketch', 'Extrude', 'Plane', 'Axis']
	$rootScope.toolbarClass = 'feature';

	$scope.click = function(tool){ //console.log(tool)
		if(tool.class == 'feature') {
			eval(tool.id).create();
		}
		else if(tool.class == 'sketch')  {
			$rootScope.sceneEvent = tool.id; 
		}
	}

	$scope.show_dropdown = function(toolClass, toolColumn) {
		var count = 0;
		for (var i=0; i<$scope.tools.length; i++){
			if($scope.tools[i].class == toolClass && $scope.tools[i].column == toolColumn) {		count++;
			}
		}
		if(count > 1){
			return true;
		}
		else if(count = 1) {
			return false;
		}
	}

	$scope.add_dropdowns = function(toolClass, toolColumn, toolId) {
		//console.log(angular.element('.feature>#Fillet').css('background-color'))
		//if(angular.element('.'+toolClass+'>#'+toolId+'>.dropdown').outerHeight() == '10px'){ 
			$scope.dropdowns = [];
			$scope.showDropdownTools = true;
			$scope.toolOffset = {'left':(toolColumn*65)+'px'};
			for (var i=0; i<$scope.tools.length; i++){
				if($scope.tools[i].class == toolClass && $scope.tools[i].column == toolColumn && $scope.tools[i].id != toolId) {		
					$scope.dropdowns.push($scope.tools[i]);
				}			
			}
		//}
	}

	$scope.hide_dropdowns = function() {
		$scope.showDropdownTools = false;
	}

	$scope.show_tool = function(toolClass, toolColumn, toolId) {
		$scope.showDropdownTools = false;
		for (var i=0; i<$scope.tools.length; i++){
			if($scope.tools[i].class == toolClass && $scope.tools[i].id == toolId) {		
				$scope.tools[i].show = true;
			}		
			if($scope.tools[i].class == toolClass && $scope.tools[i].column == toolColumn && $scope.tools[i].id != toolId) {		
				$scope.tools[i].show = false;
			}			
		}
	}

	//style="margin-left:{{center_toolbar(toolbarClass)}}"
	$scope.center_toolbar = function(toolClass) {
		var count = 0;
		for (var i=0; i<$scope.tools.length; i++){
			if($scope.tools[i].class == toolClass && $scope.tools[i].show == true) {		
				count++;
			}
		}
		return (count*65).toString()+'px';	
	}

	//TODO: need a way to indicate if tool has a dropdown

	$scope.tools = [
		{ class: 'sketch', id: 'Line', column: 0, show: true},
		//{ class: 'sketch', id: 'Spline', column: 0, show: false},
		//{ class: 'sketch', id: 'Arc', column: 0, show: false},
		{ class: 'sketch', id: 'Rectangle2pt', column: 1, show: true },
		//{ class: 'sketch', id: 'RectangleCenter', column: 1, show: false},
		//{ class: 'sketch', id: 'Rectangle3pt', column: 1, show: false},
		//{ class: 'sketch', id: 'Circle', column: 2, show: true },
		//{ class: 'sketch', id: 'Circle3pt', column: 2, show: false},
		//{ class: 'sketch', id: 'Ellipse', column: 2, show: false},
		//{ class: 'sketch', id: 'Polygon', column: 3, show: true },
/*		{ class: 'sketch', id: 'Text', column: 4, show: true },
		{ class: 'sketch', id: 'Fillet', column: 5, show: true },
		//{ class: 'sketch', id: 'Chamfer', column: 5, show: false,
		{ class: 'sketch', id: 'Mirror', column: 6, show: true },
		//{ class: 'sketch', id: 'Offset', column: 6, show: false},
		{ class: 'sketch', id: 'RadialPattern', column: 7, show: true },
		{ class: 'sketch', id: 'LinearPattern', column: 8, show: true},*/
		{ class: 'sketch', id: 'Measure', column: 9, show: true },
		//{ class: 'sketch', id: 'Trim', column: 10, show: true},

		{ class: 'feature', id: 'Sketch', column: 0, show: true},
		{ class: 'feature', id: 'Extrude', column: 1, show: true},
/*		{ class: 'feature', id: 'Revolve', column: 2, show: true},
		//{ class: 'feature', id: 'Shell', column: 0, show: true},
		{ class: 'feature', id: 'Fillet', column: 3, show: true},
		//{ class: 'feature', id: 'Chamfer', column: 0, show: false},
		{ class: 'feature', id: 'Mirror', column: 4, show: true},
		{ class: 'feature', id: 'RadialPattern', column: 5, show: true},
		{ class: 'feature', id: 'LinearPattern', column: 6, show: true},*/
		{ class: 'feature', id: 'Plane', column: 7, show: true },
		//{ class: 'feature', id: 'Axis', column: 7, show: false},
	];

};

EditorToolbarController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'Sketch', 'Extrude', 'Plane', 'Axis'];
app.controller('EditorToolbarController', EditorToolbarController);
