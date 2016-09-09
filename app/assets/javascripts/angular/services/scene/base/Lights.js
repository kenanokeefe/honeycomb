app.service('Lights', ['$rootScope', function($rootScope) {

	var Lights = {}

	Lights.init = function() {// console.log('lights')
		lightsObject = new THREE.Object3D(); 
		lightsObject.name = 'lightsObject';
		
		var directionalLight1 = new THREE.DirectionalLight( 0xffffff );
		directionalLight1.position.set( 1, 1, 1 ).normalize();
		directionalLight1.name = 'directionalLight1';
		lightsObject.add( directionalLight1 );
		var directionalLight2 = new THREE.DirectionalLight( 0xffffff );
		directionalLight2.position.set( -1, 1, -1 ).normalize();
		directionalLight2.name = 'directionalLight2';
		lightsObject.add( directionalLight2 );
		var directionalLight3 = new THREE.DirectionalLight( 0xffffff );
		directionalLight3.position.set( -1, -1, 1 ).normalize();
		directionalLight3.name = 'directionalLight3';
		lightsObject.add( directionalLight3 );
		var directionalLight4 = new THREE.DirectionalLight( 0xffffff );
		directionalLight4.position.set( 1, -1, -1 ).normalize();
		directionalLight4.name = 'directionalLight4';
		lightsObject.add( directionalLight4 );	

		scene.add( lightsObject );
		
/*		scene.remove(scene.children[5]); 
		scene.remove(scene.children[4]);
		scene.remove(scene.children[3]);
		scene.remove(scene.children[2]);*/
		//three.js bug, adds a second object to scene for each light
	}

	return Lights;

}]);