app.service('Dimension', ['$rootScope', 'Distance', 'Angle', 'Horizontal', 'Vertical', 'Radius', function($rootScope, Distance, Angle, Horizontal, Vertical, Radius) { 

	var Dimension = {}

	Dimension.Distance = Distance;
	Dimension.Angle = Angle;
	Dimension.Horizontal = Horizontal;
	Dimension.Vertical = Vertical;
	Dimension.Radius = Radius;

	Dimension.getByName = function(sketch, name) { //returns single dim
		for (var i=0; i<sketch.dimensions.length; i++){
			var dim = sketch.dimensions[i];
			if(dim.name === name) {
				return dim;
			}
		}
	}

	Dimension.getByState = function(sketch, state) {
		var dimensions = [];
		for (var i=0; i<sketch.dimensions.length; i++){
			var dim = sketch.dimensions[i]; 
			if(dim.state === state) { 
				dimensions.push(dim);
			}
		} 
		return dimensions;
	}

	Dimension.getByClass = function(sketch, dimClass) {
		var dimensions = [];
		for (var i=0; i<sketch.dimensions.length; i++){
			var dim = sketch.dimensions[i]; 
			if(dim.class === dimClass) { 
				dimensions.push(dim);
			}
		} 
		return dimensions;
	}

	Dimension.getBySelected = function(sketch) {
		var dimensions = [];
		for (var i=0; i<sketch.dimensions.length; i++){
			var dim = sketch.dimensions[i]; 
			if(dim.selected === true) { 
				dimensions.push(dim);
			}
		} 
		return dimensions;
	}

	Dimension.clearPending = function() {
		var dims = $rootScope.sketch.dimensions;
		for (var i=dims.length-1; i>=0; i--){
			if(dims[i].state == 'pending') {
 				dims.splice(dims.indexOf(dims[i]), 1);
			}
		}	
	}

	return Dimension;

}]);



/*

determine a scope of what should be referenced, when to:
reference mesh edges/faces/vertices
reference other sketches
references planes and axis
only reference this sketch....

*/