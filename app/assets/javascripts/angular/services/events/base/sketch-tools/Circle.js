app.service('Circle', ['$rootScope', 'Projector', 'Snap', 'Element', 'SelectElement', function($rootScope, Projector, Snap, Element, SelectElement) {

	var Circle = {}

	Circle.cursor = 'none';

	Circle.leftClick = function($event) {
		if($event.button == 0) {
			Snap.click($event); //FIX: first point is jumping, think this function is choppy
			if($rootScope.arc1) {
				$rootScope.arc1.state = 'ok';
				$rootScope.arc1 = null;
				//$rootScope.d1.state = 'ok';
				//$rootScope.d1 = null; 
				//Element.clearPendingDimentions();
				return;
			}
			//A.create(centerPoint, radius);
			//$rootScope.sketch.elements.push($rootScope.arc1);
			//make second point hidden, still need it for dimensioning
			//add a pending dimension, if not used make hidden, if used make driving 
			 //point2 is hidden - if clicked state changes point2
			//dimension - point stays at center of circle, center of circle stays at point, radius is distance from center and hidden point
			//if use measure tool if no input make driven, if input make driving
			//dimensions have to rendered post Transform somehow
			Element.Arc.create($rootScope.previousPoint, $rootScope.snappedPoint);
			$rootScope.arc1 = Element.last();
			//Element.Dimension.create('Radius', $rootScope.previousPoint, $rootScope.snappedPoint)
			//$rootScope.d1 = Element.last();
		}
	}

	Circle.doubleClick = null;

	Circle.hover = function($event) {
		Snap.hover($event);
		
	}

	Circle.keydown = function($event) { 
		SelectElement.keydown($event);
	}

	return Circle;

}]);


/*

function sketch_circle () {
	init_sketchevents(circle_render, circle_click);
}

function add_circle(location, name) {
	clickPoints.vertices[1] = new THREE.Vector3 ( snapX, snapY, 0 );
	var circleShape = new THREE.Shape();	
	var circleRadius = clickPoints.vertices[0].distanceTo(clickPoints.vertices[1]);
	circleShape.moveTo( clickPoints.vertices[0].x + circleRadius, clickPoints.vertices[0].y);
	circleShape.arc(-circleRadius,0, circleRadius, 0, 2.0*Math.PI, false);
	var segmentsLength = 10+circleRadius/10;
	var circlePoints = circleShape.createPointsGeometry(segmentsLength);
	var circle = new THREE.Line( circlePoints, lineMaterial );
	circle.name = name;
	tube_mesh(circle, circlePoints.vertices, 0.25*sceneScale);
	location.add(circle);
}

function circle_render(e) {
	clear_renders();
	mouseIntersect(e);//recalled to preserve refLine creation
	add_point(sketchRenders, snapX, snapY, []);
	if (clickPoints.vertices.length > 0){//if first click event has fired
	add_circle(sketchRenders,'render-circle');
	//circle_dimention();
	}
}

function circle_click() {
	if ( intersects.length > 0 ) {
	if (clickPoints.vertices.length == 0){	
	clickPoints.vertices[0] = new THREE.Vector3 ( snapX, snapY, 0 );
		}
	if (clickPoints.vertices.length == 2){
	clear_renders();
	add_circle(sketchLines, 'circle-'+sketchLines.children.length);
	clickPoints = new THREE.Geometry();//clears points
}
	var i = clickPoints.vertices.length;
	if(i==1){add_point(sketchPoints, snapX, snapY, [['circle', sketchLines.children.length]]);}
	} //end of if ( intersects.length > 0 )
}

*/