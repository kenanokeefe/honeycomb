app.service('Spline', ['$rootScope', 'Element', function($rootScope, Element) {

	var Spline = {}

	Spline.leftClick = function(snap) {
	}

	Spline.hover = function($event) { 
	}

	return Spline;

}]);
/*

function sketch_spline () {
	init_sketchevents(spline_render, spline_create);
	currentChild = sketchLines.children.length;
}

function add_spline() {
	var splineShape = new THREE.Shape();	
	splineShape.moveTo(clickPoints.vertices[0].x, clickPoints.vertices[0].y);
	splineShape.splineThru(clickPoints.vertices);
	var segmentsLength = 10;
	var splinePoints = splineShape.createPointsGeometry(segmentsLength);
	splinePoints.vertices.pop();
	var spline = new THREE.Line( splinePoints, lineMaterial );
	tube_mesh(spline, splinePoints.vertices, 0.25*sceneScale);
	return spline;
}

function spline_create() {
	if ( intersects.length > 0 ) {
	sketchLines.remove(sketchLines.children[currentChild]);
	clickPoints.vertices.push(new THREE.Vector3 ( snapX, snapY, 0 ));
	add_point(sketchPoints, snapX, snapY);
	sketchLines.add(add_spline());
	}
}
	
function spline_render(e) {
	clear_renders();
	mouseIntersect(e);//recalled to preserve refLine creation
	add_point(sketchRenders, snapX, snapY, []);
}

*/