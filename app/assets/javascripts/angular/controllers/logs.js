LogsController = function($scope, $rootScope, $http, $routeParams, $location) {

	$rootScope.showSidebar = true;
	$scope.maker = localStorage.maker;

	if($scope.maker) {
		$http.get('/waitlists.json', {params: {email: $scope.maker}}).success(function(data){
			//console.log(data)
			if(data.length > 0 && data[0].admin) {
				$http.get('/logs.json').success(function(data2){
					$scope.logs = data2;
					//$rootScope.$apply();
					//console.log($scope.logs)
				}); 
			}
			else {
				document.location.href = '/';
			}
		});
	}
	else {
		document.location.href = '/'; //cheap cancan, have to be logged in
	}


	$scope.inviteClass = null;

	$scope.invite_check = function() {  console.log('check')
		$http.put('/waitlists/0.json').success(function(data){
			$scope.invites = data;
			$scope.inviteClass = 'ready';
		});		
	}

	$scope.invite_send = function() {
		if($scope.inviteClass) { console.log('send')
			$http.put('/waitlists/0.json', {send: true}).success(function(data){
				console.log(data)
				$scope.invites = data;
				$scope.inviteClass = null;
			});			
		}
	}

};

LogsController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location'];
app.controller('LogsController', LogsController);




