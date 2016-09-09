app.service('ArcEvent', ['$rootScope', 'Element', function($rootScope, Element) {

	var ArcEvent = {}

	ArcEvent.leftClick = function(snap) {
	}

	ArcEvent.hover = function($event) { 
	}

	return ArcEvent;

}]);
/*

function sketch_arc () {
	init_sketchevents(arc_render, arc_click);
}

function add_arc(location, name) {
	if(arcClickCount == 1){
	clickPoints.vertices[1] = new THREE.Vector3 ( snapX, snapY, 0 );
	} 
	if(arcClickCount == 2){
	clickPoints.vertices[2] = new THREE.Vector3 ( snapX, snapY, 0 );
	var p3 = clickPoints.vertices[2];
	}
	var p1 =clickPoints.vertices[0];
	var p2 = clickPoints.vertices[1];
	var midLine = new THREE.Vector3().subVectors(p2, p1);//points p1 to p2
	var midAngle = midLine.angleTo(new THREE.Vector3(1,0,0));
	if(p1.y > p2.y){midAngle = Math.PI+(Math.PI-midAngle)+0.5*Math.PI} else {midAngle = midAngle+0.5*Math.PI};
	var midLength = new THREE.Vector3().lerp(midLine, 0.5);
	var midP = new THREE.Vector3().addVectors(p1, midLength);
	if(arcClickCount == 1){
	var arcRadius = (midLine.length()/2)*1.2;
	} 
	if(arcClickCount == 2){
	var arcRadius = Math.sqrt((Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2))*(Math.pow(p2.x-p3.x,2)+Math.pow(p2.y-p3.y,2))*(Math.pow(p3.x-p1.x,2)+Math.pow(p3.y-p1.y,2)))/(2*Math.abs((p1.x*p2.y)+(p2.x*p3.y)+(p3.x*p1.y)-(p1.x*p3.y)-(p2.x*p1.y)-(p3.x*p2.y)));
	}
	var centerLength = Math.sqrt(Math.pow(arcRadius,2)-midLength.lengthSq());
	var centerLine = new THREE.Vector3(centerLength,0,0).applyAxisAngle(new THREE.Vector3(0,0,1),midAngle);
	var center = new THREE.Vector3().addVectors(midP, centerLine);
	var line1 = new THREE.Vector3().subVectors(p1, center);//points center to p1
	var line2 = new THREE.Vector3().subVectors(p2, center);//points center to p2
	var startAngle = line1.angleTo(new THREE.Vector3(1,0,0));
	if(center.y > p1.y){startAngle = Math.PI+(Math.PI-startAngle)};
	var endAngle = line2.angleTo(new THREE.Vector3(1,0,0));
	if(center.y > p2.y){endAngle = Math.PI+(Math.PI-endAngle)};
	
	var arcShape = new THREE.Shape();	
	arcShape.absarc(center.x, center.y, arcRadius, startAngle, endAngle, true);
	
	var segmentsLength = 10;
	var arcPoints = arcShape.createPointsGeometry(segmentsLength);
	arcPoints.vertices.pop();//removes vertex end at center
	arcPoints.vertices.shift();//removes vertex start at center
	arcPoints.vertices.unshift(p1); //connects gap create at beginning of arc
	var arc = new THREE.Line( arcPoints, lineMaterial );
	arc.name = name;
	tube_mesh(arc, arcPoints.vertices, 0.25*sceneScale);
	location.add(arc);
}

function arc_render(e) {
	clear_renders();
	mouseIntersect(e);//recalled to preserve refLine creation
	add_point(sketchRenders, snapX, snapY);
	if (clickPoints.vertices.length > 0){//if first click event has fired
	add_arc(sketchRenders,'render-arc');
	}
}

function arc_click() {
	if ( intersects.length > 0 ) {
	if (clickPoints.vertices.length == 0){	
	clickPoints.vertices[0] = new THREE.Vector3 ( snapX, snapY, 0 );
	add_point(sketchPoints, snapX, snapY);
	arcClickCount = 1;
		}
	if (clickPoints.vertices.length == 2){
	add_point(sketchPoints, snapX, snapY);
	arcClickCount = 2;
	}
	if (clickPoints.vertices.length == 3){
	clear_renders();
	add_arc(sketchLines, 'arc-'+sketchLines.children.length);
	clickPoints = new THREE.Geometry();//clears points
	}
	} //end of if ( intersects.length > 0 )
}

*/