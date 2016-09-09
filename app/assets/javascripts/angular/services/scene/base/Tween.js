app.service('Tween', ['$rootScope', function($rootScope) {

	var Tween = {}

	Tween.init = function(target) { //console.log(target)
		var position = camera.position;
		var tween = new TWEEN.Tween(position).to(target, 1000);
		tween.onUpdate(function(){ 
			camera.position.x = this.x;
			camera.position.y = this.y;
			camera.position.z = this.z;
		});
		tween.easing(TWEEN.Easing.Cubic.Out);
		tween.start();
	}

	return Tween;

}]);




/*

http://blog.tempt3d.com/2013/12/object4d-adding-native-animation-to.html

My camera controls might be affecting tweens....

*/