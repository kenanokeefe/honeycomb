app.service('Line', ['$rootScope', 'Projector', 'Snap', 'Element', 'Dimension', 'SelectElement', 'Coincident', function($rootScope, Projector, Snap, Element, Dimension, SelectElement, Coincident) {

	var Line = {}

	Line.cursor = 'none';

	Line.leftClick = function($event) {
		if($event.button == 0) {
			Snap.click($event); //FIX: first point is jumping, think this function is choppy
			if($rootScope.pendingElements[0]) {
				Coincident.createHorizontalAndVertical($rootScope.pendingElements[0]);
				$rootScope.pendingElements[0].state = 'ok';
				$rootScope.previousLine = $rootScope.pendingElements[0];
				$rootScope.pendingElements = [];
				Dimension.clearPending();
			}

			Element.Line.create($rootScope.previousPoint, $rootScope.snappedPoint);
			$rootScope.pendingElements.push(Element.last());

			//IDEA: let makers decide if they want dims to show, kids might not want them
			var distanceDim = Dimension.Distance.create($rootScope.previousPoint, $rootScope.snappedPoint)
			$rootScope.sketch.dimensions.push(distanceDim);

/*			if($rootScope.previousLine) {
				var angleDim = Dimension.Angle.create($rootScope.previousLine, $rootScope.pendingElements[0])
				$rootScope.sketch.dimensions.push(angleDim);
				$rootScope.pendingElements.push(angleDim);
			}*/
		}
	}

	Line.doubleClick = function($event) {
		SelectElement.doubleClick($event);
	}

	Line.hover = function($event) { 
		Snap.hover($event); 
	}

	Line.keydown = function($event) { 
		SelectElement.keydown($event);
	}

	return Line;

}]);