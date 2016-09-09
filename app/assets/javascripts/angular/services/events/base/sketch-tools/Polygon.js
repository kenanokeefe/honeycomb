app.service('Polygon', ['$rootScope', 'Element', function($rootScope, Element) {

	var Polygon = {}

	Polygon.leftClick = function(snap) {
	}

	Polygon.hover = function($event) { 
	}

	return Polygon;

}]);



/*

function sketch_polygon() {
	init_sketchevents(polygon_render, polygon_click);
	polySides = 6;
	polyHotkey();
}

function polyHotkey() {
window.requestAnimationFrame(polyHotkey);
$(document).on('keydown', function(e) {
if(e.keyCode-48 >=3 && e.keyCode-48 <=9) {
polySides = e.keyCode-48;
polygon_render();
console.log(polySides);
		}
	});
}

function add_polygon(name) {
	clickPoints.vertices[1] = new THREE.Vector3 ( snapX, snapY, 0 );
	polyPoints = new THREE.Geometry();
	var radialVector = new THREE.Vector3().subVectors(clickPoints.vertices[1], clickPoints.vertices[0]);
	//take vector from center to 2nd click, rotate by 360/sides add to 1rst click
	var rotationAngle = 2.0*Math.PI/polySides;
	for (var i=0; i<=polySides; i++){
	polyPoints.vertices.push(radialVector.clone().applyAxisAngle(new THREE.Vector3 (0,0,1), rotationAngle*i));
	}
	var polygon = new THREE.Line( polyPoints, lineMaterial );
	polygon.name = name;
	polygon.position = clickPoints.vertices[0];
	tube_mesh(polygon, polyPoints.vertices, 0.25*sceneScale);
	return polygon;
}

function polygon_render(e) {
	clear_renders();
	//mouseIntersect(e);//recalled to preserve refLine creation//causing error in unprojector
	add_point(sketchRenders, snapX, snapY, []);
	if (clickPoints.vertices.length > 0){//if first click event has fired
	add_point(sketchRenders, clickPoints.vertices[0].x, clickPoints.vertices[0].y, []);
	//doesn't create a reference point b/c it's not in sketchPoints
	sketchRenders.add(add_polygon('polygon-render'));
	}
}

function polygon_click() {
	if ( intersects.length > 0 ) {
		if (clickPoints.vertices.length == 0){ //FIRST CLICK	
		clickPoints.vertices[0] = new THREE.Vector3 ( snapX, snapY, 0 );
		}
		if (clickPoints.vertices.length == 2){ //SECOND CLICK	
		clear_renders();
		sketchLines.add(add_polygon('polygon-'+sketchLines.children.length));
		add_point(sketchPoints, clickPoints.vertices[0].x, clickPoints.vertices[0].y, []);
		clickPoints = new THREE.Geometry();//clears points
		}
	}
}

*/