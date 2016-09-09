app.service('Measure', ['$rootScope', 'Projector', 'Element', 'Dimension', 'SelectElement', function($rootScope, Projector, Element, Dimension, SelectElement) {

	var Measure = {}

	Measure.cursor = 'copy';

	Measure.leftClick = function($event) {
		Projector.unproject($event);
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var clickedName = Projector.select(sketchObject.children); //global
		if(clickedName) {
			var element = Element.getByName($rootScope.sketch, clickedName);
			measureElements.push(element); console.log(measureElements)
			if(measureElements[0].class === 'Line') {
				var p1 = Element.getByName($rootScope.sketch, measureElements[0].values[0]);
				var p2 = Element.getByName($rootScope.sketch, measureElements[0].values[1]); 
				var dim = Dimension.Distance.create(p1, p2);
				$rootScope.sketch.dimensions.push(dim);
				dim.state = 'driven';
				measureElements = [];	
			}
			if(measureElements.length === 2) {
				var dim = Dimension.Distance.create('Distance', measureElements[0], measureElements[1]);
				$rootScope.sketch.dimensions.push(dim);
				dim.state = 'driven';
				measureElements = [];			
			}
		}
	}

	Measure.hover = function($event) { 
		//console.log('measure') 
	}

	Measure.keydown = function($event) { 
		SelectElement.keydown($event);
	}

	return Measure;

}]);

/*

sketch measure tool:
determine constraint based on elements selected:
two points - distance
two lines (not parellel) - angle
two parellel lines - distance
point and line - distance (perpendicular to line)
arc - radius(es)

*/

/*	
(element1, element2) constraint is picked based on element classes:
two points - distance
two lines (not parellel) - angle
two lines (parellel) - distance
point and line - distance (perpendicular to line)
point and arc - distance
arc - radius
*/