//<toolbar></toolbar>
app.directive('toolbar', function(){
	return {
		restrict: 'E', //element
		templateUrl: 'editor/toolbar.html'
	};
});