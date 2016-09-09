app.service('Snap', ['$rootScope', 'Projector', 'Element', 'Coincident', function($rootScope, Projector, Element, Coincident) {

	var Snap = {}

	Snap.find = function($event) {
		Projector.unproject($event);
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		return Projector.snap(sketchObject);	
	}

	Snap.click = function($event) {
		var snap = Snap.find($event);
		Coincident.findHorizontal($rootScope.snappedPoint, snap);
		Coincident.findVertical($rootScope.snappedPoint, snap);
		var merge = Element.findMerge($rootScope.snappedPoint);
		if(merge) {$rootScope.snappedPoint = merge;}
		$rootScope.snappedPoint.state = 'ok';
		$rootScope.previousPoint = $rootScope.snappedPoint;
		Element.Point.create(snap.x, snap.y);
		$rootScope.snappedPoint = Element.last();		
	}

	Snap.hover = function($event) {    
		if($rootScope.sceneEvent != 'SelectElement') { ///FIX: snap.hover still running after ESC
			var snap = Snap.find($event);  
			$("#SnappedCursor").remove();
			if(snap) {
				$rootScope.cursor = 'none';
				var screen = Projector.project(snap.x, snap.y);  //{x:0, y:0}//
				$('#Scene').append('<div id="SnappedCursor" class='+$rootScope.sceneEvent+' style="left:'+(screen.x-15)+'px; top:'+(screen.y-15)+'px;"></div>');
				if($rootScope.snappedPoint) {  //console.log($rootScope.snappedPoint)
					$rootScope.snappedPoint.values[0] = snap.x;
					$rootScope.snappedPoint.values[1] = snap.y;
					Coincident.findHorizontal($rootScope.snappedPoint, snap);
					Coincident.findVertical($rootScope.snappedPoint, snap);
					//if hovering on line, snap to interpolation
					//if hover on arc, interpolate snap between path points
				} 
				else {
					Element.Point.create(snap.x, snap.y); 
					$rootScope.snappedPoint = Element.last();
				}
			}
			else {
				$rootScope.cursor = 'default';
			}
		}
	}

	return Snap;

}]);