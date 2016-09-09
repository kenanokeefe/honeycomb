app.service('Rectangle2pt', ['$rootScope', 'Projector', 'Snap', 'Element', 'SelectElement', 'Dimension', 'Coincident', function($rootScope, Projector, Snap, Element, SelectElement, Dimension, Coincident) {

	var Rectangle2pt = {}

	Rectangle2pt.cursor = 'none';

	Rectangle2pt.leftClick = function($event) {
		Snap.click($event);
		if($rootScope.pendingElements[0]) {
			for (var i=0; i<$rootScope.pendingElements.length; i++){
				var element = $rootScope.pendingElements[i];
				if(element.class === 'Line') {
					Coincident.createHorizontalAndVertical(element);
				}
				element.state = 'ok';
			}
			$rootScope.pendingElements = [];
			Dimension.clearPending();
			return;
		}
		for (var i=0; i<2; i++){
			Element.Point.create($rootScope.previousPoint.values[0], $rootScope.previousPoint.values[1]);
			$rootScope.pendingElements.push(Element.last());
		}

		var lines = [
			{
				p1: $rootScope.previousPoint,
				p2: $rootScope.pendingElements[0]
			},
			{
				p1: $rootScope.pendingElements[0],
				p2: $rootScope.snappedPoint
			},
			{
				p1: $rootScope.snappedPoint,
				p2: $rootScope.pendingElements[1]
			},
			{
				p1: $rootScope.pendingElements[1],
				p2: $rootScope.previousPoint
			},
		]
		for (var i=0; i<lines.length; i++){
			Element.Line.create( lines[i].p1, lines[i].p2 );
			$rootScope.pendingElements.push(Element.last());
		}
		//var distanceDim = Dimension.Distance.create($rootScope.pendingElements[0], $rootScope.snappedPoint)
		//$rootScope.sketch.dimensions.push(distanceDim);
/*		var distanceDim = Dimension.Distance.create($rootScope.pendingElements[1], $rootScope.snappedPoint)
		$rootScope.sketch.dimensions.push(distanceDim);*/
	}

	Rectangle2pt.doubleClick = null;


	Rectangle2pt.hover = function($event) {
		Snap.hover($event);
		if($rootScope.pendingElements[0]) {
			$rootScope.pendingElements[0].values[0] = $rootScope.previousPoint.values[0];
			$rootScope.pendingElements[0].values[1] = $rootScope.snappedPoint.values[1];
			$rootScope.pendingElements[1].values[0] = $rootScope.snappedPoint.values[0];
			$rootScope.pendingElements[1].values[1] = $rootScope.previousPoint.values[1];
		}
	}

	Rectangle2pt.keydown = function($event) { 
		SelectElement.keydown($event);
	}

	return Rectangle2pt;

}]);


		/*

			switch(i) {
				case 0:
				lines[i].p2.values[0] = lines[i].p1.values[0];
				//var dim = Dimension.Vertical.create(lines[i].p2, lines[i].p1);
				break;
				case 1:
				lines[i].p1.values[1] = lines[i].p2.values[1];
				//var dim = Dimension.Horizontal.create(lines[i].p1, lines[i].p2);
				break;
				case 2:
				//var dim = Dimension.Vertical.create(lines[i].p2, lines[i].p1);
				break;
				case 3:
				//var dim = Dimension.Horizontal.create(lines[i].p1, lines[i].p2);
				break;
			}
			//$rootScope.sketch.dimensions.push(dim); console.log(dim)

		Element.Line.create( $rootScope.previousPoint, $rootScope.pendingElements[0] );
		$rootScope.pendingElements.push(Element.last());
		var dim = Dimension.Vertical.create($rootScope.previousPoint, $rootScope.pendingElements[0]);
		$rootScope.sketch.dimensions.push(dim);

		Element.Line.create( $rootScope.pendingElements[0], $rootScope.snappedPoint );
		$rootScope.pendingElements.push(Element.last());
		var dim = Dimension.Horizontal.create($rootScope.snappedPoint, $rootScope.pendingElements[0]);
		$rootScope.sketch.dimensions.push(dim);

		Element.Line.create( $rootScope.snappedPoint, $rootScope.pendingElements[1] );
		$rootScope.pendingElements.push(Element.last());
		var dim = Dimension.Vertical.create($rootScope.snappedPoint, $rootScope.pendingElements[1]);
		$rootScope.sketch.dimensions.push(dim);

		Element.Line.create( $rootScope.pendingElements[1], $rootScope.previousPoint );
		$rootScope.pendingElements.push(Element.last());
		var dim = Dimension.Horizontal.create($rootScope.previousPoint, $rootScope.pendingElements[1]);
		$rootScope.sketch.dimensions.push(dim);


		//TODO: create rectangle by creating to 90deg angle constraints

		P.create(snap.x, snap.y);  ///////UPDATE with Element.Point etc......
		var pTopLeft = Element.last();
		D.create(pTopLeft, $rootScope.previousPoint, 'x');
		$rootScope.pendingRect.push(Element.last());
		D.create(pTopLeft, $rootScope.snappedPoint, 'y');
		$rootScope.pendingRect.push(Element.last());

		$rootScope.pendingRect.push(pTopLeft);

		P.create(snap.x, snap.y);
		var pBotRight = Element.last();
		D.create(pBotRight, $rootScope.snappedPoint, 'x');
		$rootScope.pendingRect.push(Element.last());
		D.create(pBotRight, $rootScope.previousPoint, 'y');
		$rootScope.pendingRect.push(Element.last());
		$rootScope.pendingRect.push(pBotRight);

		L.create($rootScope.previousPoint, pTopLeft);
		$rootScope.pendingRect.push(Element.last());

		L.create(pTopLeft, $rootScope.snappedPoint);
		$rootScope.pendingRect.push(Element.last());

		L.create($rootScope.snappedPoint, pBotRight);
		$rootScope.pendingRect.push(Element.last());

		L.create(pBotRight, $rootScope.previousPoint);
		$rootScope.pendingRect.push(Element.last());
		works, but ultimately want to be doing dimensions/relationships
		or does this work b/c lines are joined by points
		what happens when you drag a point of a rectangle?
		->do lines break from 90deg relation or no? -> solution, create two perpendicular dimensions that can be deleted by the maker afterwards


				for (var i=0; i<pendings.length; i++){
			var element = pendings[i];
			element.points[1] = 
				{
					state: 'ok',
					class: 'P',
					name: 'render'
				};
			switch (pendings.indexOf(element)) {
				case 0:
					element.points[1].x = element.points[0].x;
					element.points[1].y = snap.y;		
					break;
				case 1:
					element.points[1].x = 	snap.x;
					element.points[1].y = 	element.points[0].y;		
					break;
				case 2:
					element.points[0].y = 	snap.y;
					element.points[1].x = 	snap.x;
					element.points[1].y = 	snap.y;			
					break;
				case 3:
					element.points[0].x = 	snap.x;
					element.points[1].x = 	snap.x;
					element.points[1].y = 	snap.y;	
					break;
			}
		}	
		*/