ProfileController = function($scope, $rootScope, $http, $routeParams, $location) {

	$rootScope.showSidebar = true;

	$scope.maker = {
		name: 'Kenan OKeefe',
		username: 'Ironman',
		bio: 'maker for the Maker',
		bioData: [
			{
				class: 'joined',
				data: 1412626872,
			},
			{
				class: 'location',
				data: 'United States', 
			},
			{
				class: 'rank',
				data: '43rd',
			},
			{
				class: 'work',
				data: 'Honeycomb',
			},
			{
				class: 'school',
				data: 'Carnegie Mellon University',
			},
			{
				class: 'royal',
				data: 'Royal Bee',
			},
			{
				class: 'worker',
				data: 'Worker Bee',
			}
		]
	}

	$scope.tabs = [ 'buzz', 'hives', 'cells', 'requests', 'prints' ]

};

ProfileController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location'];
app.controller('ProfileController', ProfileController);	