HomeController = function($scope, $rootScope, $http, $routeParams, $location) {

	if (!window.WebGLRenderingContext || window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		window.location = "http://get.webgl.org";
	} //blocks safari and ie

	var ua = navigator.userAgent.toLowerCase(); 
	if (ua.indexOf('safari') != -1) { 
		if (ua.indexOf('chrome') > -1) {
			//console.log("1") // Chrome
		} else {
			window.location = "http://get.webgl.org"; // Safari
		}
	}

	$rootScope.showSidebar = true;
	$scope.maker = localStorage.maker;
	//console.log($scope.maker)

	if(!$scope.maker) { 
		document.location.href = '/';
	}
	else {
		$http.get('/waitlists.json', {params: {email: $scope.maker}}).success(function(data){
			if(data.length === 0) {
				document.location.href = '/';
			}
		});
	}

	$rootScope.load_cells($routeParams.cellId, false);

	$scope.sort_direction = function() {
		$scope.sort == 'updated_at' ? $scope.reverse = true : $scope.reverse = false
	}

	$scope.menuItems = [
/*		{ 
			id: 'Download', 
			name: 'Download .STL',
			action: function(cell) {}
		},*/
/*		{ 
			id: 'Duplicate', 
			name: 'Duplicate',
			action: function(cell) {
				$rootScope.duplicate_cell(cell);
			}
		},*/
		{ 
			id: 'Delete', 
			name: 'Delete',
			action: function(cell) {
				$rootScope.delete_cell(cell);
			}
		}	
	];

	$scope.menu_click = function() {
		if($scope.selectedIndex >= 0) {
			$scope.menu = !$scope.menu;
			angular.element(document.body).bind('click', function(e){
				if (!e.target.classList.contains('menu')) {
					$scope.menu = false;
					$scope.$apply(); //need this b/c it is under a jquery click
					angular.element(document.body).unbind();
				}
			});
		}
	}

	$scope.cell_click = function(index) {
		$scope.selectedIndex = index;
		angular.element(document.body).bind('click', function(e){
			if (!e.target.classList.contains('hexagon') && !e.target.classList.contains('menu')) {
				$scope.selectedIndex = -1;
				$scope.$apply(); // update scope in view
				angular.element(document.body).unbind();
			}
		});
	}

	$rootScope.cellPosition = function() {
		heightArray = [];
		angular.element('.cell-item').each(function(){
			angular.element(this).css('margin-left', '0px');
			var top = angular.element(this).position().top;
			if(heightArray.indexOf(top) == -1) {
				heightArray.push(top);
			}
		});

		for (var i=1; i<=heightArray.length; i+=2){
			angular.element('.cell-item').each(function(){
				var top = angular.element(this).position().top;
				if(top == heightArray[i]) {
					angular.element(this).css('margin-left', '93px');
					return false;
				};
			});
		};
	}

	angular.element(window).resize(function(){
		$rootScope.cellPosition();
	});

};

HomeController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location'];
app.controller('HomeController', HomeController);