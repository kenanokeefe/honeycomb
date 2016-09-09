LandingController = function($scope, $rootScope, $http, $routeParams, $location) {

	$scope.maker = localStorage.maker;
	//console.log($scope.maker)

	$scope.alert = 'Enter email to get on the beta waitlist.';
	$scope.submitVal = 'Submit';
	$scope.submitClass = 'disabled';
	$scope.signinClass = null;
	$scope.signinAlert = null;
	$scope.sign = false;
	$scope.popup = false; //used so signinAlert only shows if 'Enter Beta' is clicked

	angular.element(document.body).bind('click', function(e){
		if (!e.target.classList.contains('signin')) {
			$scope.sign = false;
			$scope.$apply();
		}
	});

	$scope.home = function() {
		$("html, body").animate({ scrollTop: "0px" }, 1000);
	}

	$scope.validate_signin = function(email,password) {
		$scope.signinClass = null;
		$scope.signinAlert = null;
		$scope.popup = false;
		var found = null;
		$http.get('/waitlists.json', {params: {email: email}}).success(function(data){
			if(data.length === 0) { 
				$scope.signinAlert = 'Email not found.';	
				return;
			}
			if(data[0].access === false) { 
				$scope.signinAlert = 'Email found, but no access.';	
				return;
			}				
			if(data[0].password !== password) { //console.log(data.password+', '+password)
				$scope.signinAlert = 'Incorrect password.';			
				return;
			}
			$scope.signinClass = 'ready';
			$scope.signinAlert = null;
			$scope.popup = false;
			var found = null;
		});
	}

	$scope.new_log = function(maker, action, cell) {
		$http.post('/logs.json', {maker: maker, action_name: action, cell: cell}).success(function(data){
			//console.log(data)
		});	
	}

	$scope.enter_beta = function(email) {
		$scope.popup = true;
		if($scope.signinClass === 'ready') {
			localStorage.setItem("maker", email);
			$scope.new_log(email, 'signedin', null); //send data to log
			//create their first cell
			//$location.url('/home'); //open to first cell page instead, activate help popup
			//window.location('/app');
			document.location.href = '/app';
		}
	}

	$scope.enter_beta2 = function() {
		if($scope.maker) {
			//$location.url('/home');
			//window.location('/app');
			document.location.href = '/app';
		}
	}

	$scope.signin = function() {
		$scope.sign = true;
		setTimeout(function(){$('#Popup input[type=email]').focus()}, 100);
	}

	$scope.signup = function() {
		$scope.sign = false;
		$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	}

	$scope.exsists = function(data, email) { 
		for (var i=0; i<data.length; i++){
			if(data[i].email === email) {
				return true; 
			}
		}
		return false; 	
	}

	$scope.validate_waitlister = function(email) {
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		$http.get('/waitlists.json', {params: {email: email}}).success(function(data){
			if(email === '') {
				$scope.alert = 'Enter email to get on the beta waitlist.';
				$scope.alertColor = 'white';
				$scope.submitClass = 'disabled';
				return;
			}	
			else if( !emailReg.test( email ) ) {
			  	$scope.alert = 'Invalid email format.';
			  	$scope.alertColor = 'red';
			  	$scope.submitClass = 'disabled';
			  	return;
			}	
			else if(data.length > 0) {
				$scope.alert = email+' is already taken.';
				$scope.alertColor = 'red';
				$scope.submitClass = 'disabled';
				return;
			}
			else if(data.length === 0) {
				$scope.alert = email+' is available!';
				$scope.alertColor = 'rgba(0, 146, 69, 1)';
				$scope.submitClass = 'ready';
				return;
			}
		});
	}

	$scope.new_waitlister = function(waitlist,comment) {
		$scope.submitVal = 'Sending';
		$scope.submitClass = 'sent';
		$scope.inputClass = 'disabled';
		$http.post('/waitlists.json', {email: waitlist, comment: comment}).success(function(data){
			$scope.alert = 'Email sent to '+waitlist;
			$scope.alertColor = 'rgba(0, 146, 69, 1)';
			$scope.submitVal = 'Sent';
			//console.log(data)
		});		
	}

	function section_resize() {
		var deskH = ($('section.landing').width())/1.947148;
		$('#Desk').css('height',deskH+'px');
		$('#Printrbot').css('margin-top',(deskH*.2)+'px');

		var iframeH = (($('section.landing').width())*.6)/1.5326;
		$('#Demo iframe').css('height',iframeH+'px');
	}

	section_resize();

	$(document).ready(function(){
	  section_resize();
	});

	$(window).resize(function(){
		section_resize();
	});

};

LandingController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location'];
landingApp.controller('LandingController', LandingController);




