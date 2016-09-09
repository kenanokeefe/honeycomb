/*<!-- Mr. Doob, Three.js
Chandler Prall, ThreeCGS.js
Paul Kaplan, stl export
accessed under the MIT Lincense -->*/

EditorSceneController = function($scope, $rootScope, $http, $routeParams, $location, Sketch, Coordinates, Lights, Projector) {

	$scope.project = function(dim) {
		if(dim && $rootScope.sketch) {
			var id = '#'+$rootScope.no_spaces(dim.name);
			var point = dim.values[3]; 
			var screen = Projector.project(point.x, point.y); 
			var left = screen.x-40;
			var top = screen.y-10; 
			$(id).css({'left': left+'px', 'top': top+'px'}); //console.log(screen)
			///LEARNED: updating the css through angular was causing an extra digest which conflicted with the other digests occurring, solution - use jquery
		}
	}

	$scope.focus = function(dimension) {
		if(dimension.state === 'pending') {
			angular.element('#'+$rootScope.no_spaces(dimension.name)).focus().select();
		}
		return;
	}

	$scope.disabled = function(dimension) {
		if($rootScope.sceneEvent !== 'SelectElement' || $rootScope.draggingPoint || $rootScope.draggingLarc || $rootScope.marquee) {
			return 'disabled'; 
		}
	}

	$scope.hidden = function(dimension) {
		return (!dimension.values[3].x && !dimension.values[3].y) ? false : true;
	}

	$scope.blur = function(dimension) {
		//account for exiting by esc, or tab, or if val is still same
		dimension.state = 'driving';
		//console.log($rootScope.sketch)
		$rootScope.update_sketch($rootScope.sketch);
	}

	$scope.change = function(dimension) { //console.log(dimension.values[2])
		dimension.state = 'editing';
	}

	$('.toggle').click(function(){
		$(this).toggleClass('max');
		$(this).parent().parent().toggleClass('min');
	})

//**scene children: referencesObject, axisObject, coordinateObject, meshObject
	//////////////// Scene ///////////////////
	function scene_init() {
		scene = new THREE.Scene(); 
		renderer = new THREE.WebGLRenderer({ //how stuff is displayed on monitor
		antialias: true, alpha: true, gammaInput: true, gammaOutput: true, shadowMapEnabled: true, shadowMapSoft: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: true });
		renderer.sortObjects = true;
		renderer.setSize($('#Scene').innerWidth(), $('#Scene').innerHeight());
		renderer.setClearColor( 0xffffff, 1 );
		//talk about sending canvas to DOM as a directive
		//http://winkervsbecks.github.io/angularWebglDirective/
		$("#Scene").append( renderer.domElement ); //sends data to html
		projector = new THREE.Projector();
		//create a div element here in js
	}
	scene_init();

	//want to put in service but cameraControls.js needs the var camera
	function camera_init(focusLength) {
		//if(typeof camera!='undefined'){
			//var camPosition = camera.position;		
		//} else {
			var camPosition = new THREE.Vector3(60000, 60000, 60000);
			//}
		camera = new THREE.PerspectiveCamera( focusLength, $('#Scene').innerWidth() / $('#Scene').innerHeight(), 0.1, 1000000 );
		camera.position = camPosition.multiplyScalar(1/(focusLength*focusLength)); 
		//camera.up = new THREE.Vector3( 0, 0, 0 ); //z up, important
		//todo: error when clicking on the active viewpane camera button
		cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
		cameraControls.target.set(0,0,0); //maybe set at the center of mass?
		$(window).resize(function(){
			camera.aspect = $('#Scene').innerWidth() / $('#Scene').innerHeight();
			camera.updateProjectionMatrix();
			renderer.setSize( $('#Scene').innerWidth(), $('#Scene').innerHeight() );
		});	
	}
	camera_init(10);
	var viewDistance = 1200; //some global variable used?


	Lights.init(); //these only affect lambert and phong materials


	//////////////// Animate ///////////////////
	var clock = new THREE.Clock();
	function animate() {
		window.requestAnimationFrame(animate);
		cameraControls.update(clock.getDelta());
		TWEEN.update(); //tweens are still choppy
		renderer.render(scene, camera);
	}
	animate();

	//////////////// References ////////////////
		referencesObject = new THREE.Object3D(); 
		referencesObject.name = 'referencesObject';
		scene.add(referencesObject);

	//////////////// Sketches ////////////////
		sketchesObject = new THREE.Object3D(); 
		sketchesObject.name = 'sketchesObject';
		scene.add(sketchesObject);

	//////////////// Meshes ////////////////
		meshesObject = new THREE.Object3D(); 
		meshesObject.name = 'meshesObject';
		scene.add(meshesObject);

	//////////////// Result Mesh ////////////////
		resultMeshObject = new THREE.Object3D(); 
		resultMeshObject.name = 'resultMeshObject';
		resultMeshObject.material = new THREE.MeshBasicMaterial({opacity: 0});
		scene.add(resultMeshObject);

	Coordinates.read();

};

EditorSceneController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'Sketch', 'Coordinates', 'Lights', 'Projector'];
app.controller('EditorSceneController', EditorSceneController);





