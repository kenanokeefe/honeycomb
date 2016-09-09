SidebarController = function($scope, $rootScope, $http, $routeParams, $location) {

	$scope.makername = localStorage.maker;
	$scope.feedbackSubmit = 'Send';
	$scope.feedbackClass = null;

	//$rootScope.help = false;


 	$scope.active = function(id) {
		if(id == $routeParams.cellId) {
			return 'active'
		} else {
			return ''
		}
	}

	$scope.signout = function() {
		$rootScope.newLog($scope.makername, 'signedout', null); //send data to log
		//$location.url('/');
		//window.location('/');
		document.location.href = '/';
		localStorage.removeItem("maker");
	}

	$rootScope.help_click = function() {
		var pos = $('.sidebar-item#NewCell').position();
		$('.descriptor#NewCell').css('top',pos.top);
		if(pos.top < 91) {
			$('.descriptor#Cells').hide();
		}
		else {
			$('.descriptor#Cells').show();
		}
		$rootScope.help = !$rootScope.help;
		$scope.feedback = false;
		$scope.maker = false;
	}

	$scope.feedback_click = function() {
		$scope.feedback = !$scope.feedback;
		$scope.maker = false;
		$rootScope.help = false;
		$scope.feedbackText = null;
		$scope.feedbackSubmit = 'Send';
		$scope.feedbackClass = null;
		setTimeout(function(){$('#FeedbackWindow textarea').focus()}, 100);
	}

	$scope.send_feedback = function(email, text) {
		//TODO: include browser??
		$scope.feedbackSubmit = 'Sending';
		$scope.feedbackClass = 'sent';
		if(email && text) {
			$http.post('/feedbacks.json', {maker: email, text: text}).success(function(data){
				$scope.feedbackSubmit = 'Sent';
				$scope.feedbackClass = 'sent';
			});		
		}
	}

	$scope.maker_click = function() {
		$scope.maker = !$scope.maker;
		$scope.feedback = false;
		$rootScope.help = false;
	}

	$scope.descriptors = [
		{
			pos: 'top:0px',
			val: 'View all cells.',
		},
		{
			pos: 'top:51px',
			val: 'List of open cells.',
			id: 'Cells',
		},
		{
			pos: 'top:91px',
			val: 'Create new cell.',
			id: 'NewCell',
		},
		{
			pos: 'bottom:85px',
			val: 'Open/close this help dialog.',
		},
		{
			pos: 'bottom:45px',
			val: 'Send feedback!',
		},
		{
			pos: 'bottom:5px',
			val: 'Sign out.',
		},
	];

	$scope.sections = [
		{
			title: 'View Controls',
			data: [
				{
					val: 'Orbit - right click + drag',
					//img: ''
				},
				{
					val: 'Pan - middle click + drag',
					//img: ''
				},
/*				{
					val: 'Toggle Display - icon1, icon2',
					img: 'display'
				},*/
			],
		},
/*		{
			title: 'Workflow',
			data: [
				{
					val: 'Create sketch',
					img: 'sketch'
				},
				{
					val: 'Select sketch plane',
					img: 'plane_select'
				},
				{
					val: 'Create lines or rectangles',
					img: 'lines'
				},
				{
					val: 'Draw and edit lines',
					img: 'lines'
				},
				{
					val: 'Mesure lines',
					img: 'measure'
				},
				{
					val: 'Dimension lines',
					img: 'lines_dim'
				},
				{
					val: 'Finish sketch',
					img: 'sketch_finish'
				},
				{
					val: 'Extrude',
					img: 'extrude'
				},
				{
					val: 'Edit options',
					img: 'extrude_options'
				},
				{
					val: 'Repeat or edit previous steps',
					img: 'edit'
				},
				{
					val: 'Download STL',
					img: 'download'
				},
			],
		},
		{
			title: 'Additional Tools',
			data: [
				{
					val: 'Add a plane.',
				},
			],
		},*/
	];

};

SidebarController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location'];
app.controller('SidebarController', SidebarController);




