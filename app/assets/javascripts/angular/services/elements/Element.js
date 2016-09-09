app.service('Element', ['$rootScope', 'ArcElement', 'LineElement', 'PointElement', function($rootScope, ArcElement, LineElement, PointElement) {
	
	//NOTE: Elements live in sketches

	var Element = {};

	Element.Arc = ArcElement;
	Element.Line = LineElement;
	Element.Point = PointElement;

	Element.getByName = function(sketch, name) { //returns single element
		for (var i=0; i<sketch.elements.length; i++){
			var element = sketch.elements[i];
			if(element.name === name) {
				return element;
			}
		}
	}

	Element.getByState = function(sketch, state) {
		var elements = [];
		for (var i=0; i<sketch.elements.length; i++){
			var element = sketch.elements[i]; 
			if(element.state === state) { 
				elements.push(element);
			}
		} 
		return elements;
	}

	Element.getByClass = function(sketch, elementClass) {
		var elements = [];
		for (var i=0; i<sketch.elements.length; i++){
			var element = sketch.elements[i]; 
			if(element.class === elementClass) { 
				elements.push(element);
			}
		} 
		return elements;
	}

	Element.getBySelected = function(sketch) {
		var elements = [];
		for (var i=0; i<sketch.elements.length; i++){
			var element = sketch.elements[i]; 
			if(element.selected === true) { 
				elements.push(element);
			}
		} 
		return elements;
	}

	Element.getByValue = function(sketch, name) {
	}

	//ORG: set up so Line.create = an object, not a push function
	Element.last = function() {
		return $rootScope.sketch.elements[$rootScope.sketch.elements.length-1];
	}

	Element.deleteSelected = function() {
		var elements = $rootScope.sketch.elements;
		var selected = Element.getBySelected($rootScope.sketch);
		for (var i=selected.length-1; i>=0; i--){
			if(selected[i].name.match(/Line|Arc/)) {
				Element[selected[i].class].delete(selected[i]); //included b/c doesn't delete till mousemove
				elements.splice(elements.indexOf(selected[i]), 1);					
			}
		}
		var selected = Element.getBySelected($rootScope.sketch);
		for (var i=selected.length-1; i>=0; i--){
			var used = false; 
			for (var j=0; j<elements.length; j++){ 
				if(elements[j].values.indexOf(selected[i].name) > -1) {
					var used = true;
				};
			};
			if(used == true) {continue};
			Element[selected[i].class].delete(selected[i]);
			elements.splice(elements.indexOf(selected[i]), 1);					 
		}
		Element.deleteFloatingPoints();		
	}

	Element.deleteFloatingPoints = function() {
		var points = Element.getByClass($rootScope.sketch, 'Point');
		var elements = $rootScope.sketch.elements;
		for (var i=points.length-1; i>=0; i--){
			var used = false; 
			for (var j=0; j<elements.length; j++){ 
				if(elements[j].values.indexOf(points[i].name) > -1) {
					var used = true;
				};
			};
			if(used == true) {continue};
			Element.Point.delete(points[i]);
			elements.splice(elements.indexOf(points[i]), 1);					 
		}			
	}

	Element.clearRenders = function() {
		$rootScope.pendingElements = [];
		$rootScope.previousPoint = null;
		$rootScope.snappedPoint = null;
		$rootScope.previousLine = null; //temp solution
		var elements = $rootScope.sketch.elements; 
		for (var i=elements.length-1; i>=0; i--){
			if(elements[i].state == 'pending') { //FIX: don't delete until i move cursor
 				elements.splice(elements.indexOf(elements[i]), 1);
			}
		}
		Element.deleteFloatingPoints();
	}

	Element.clearSelected = function() {
		var selected = Element.getBySelected($rootScope.sketch);
		for (var i=0; i<selected.length; i++){
			selected[i].selected = false;
		}
	}

	Element.copySelected = function(selected) {
		//used in cut, copy, paste, mirror, radial, linear, offset
	}

	Element.findMerge = function(point) {
		var points = Element.getByClass($rootScope.sketch, 'Point');
		for (var i=0; i<points.length; i++) {
			if(points[i].name === point.name) {continue;}
			if(points[i].state == 'ok') {
				if(points[i].values[0] == point.values[0] && points[i].values[1] == point.values[1]) {  //console.log('merge point')
					var elements = $rootScope.sketch.elements;
					for (var j=0; j<elements.length; j++) {
						var index = elements[j].values.indexOf(point.name);
						if(index > -1) {
							elements[j].values[index] = points[i].name;
						}
					}
					elements.splice(elements.indexOf(point), 1);
					Element.sanitize();
					return points[i];
				}
			}
		}
	}

	Element.sanitize = function() {
		var elements = $rootScope.sketch.elements;
		for (var j=elements.length-1; j>=0; j--) { //if line has same start and end point
			if(elements[j].values[0] === elements[j].values[1]) {
				elements.splice(elements.indexOf(elements[j]), 1);
			}
		}
		for (var j=elements.length-1; j>=0; j--) { //if two lines have same two points
			for (var k=0; k<elements.length; k++) {
				if(elements[j].name === elements[k].name) {continue;}
				if(elements[j].values[0] == elements[k].values[0] && elements[j].values[1] == elements[k].values[1]) {
					elements.splice(elements.indexOf(elements[j]), 1);
				}
			}
		}
	}

	Element.pointToVector = function(point) {
		var position = new THREE.Vector3(point.values[0], point.values[1], 0);
		return position;
	}

	return Element;

}]);