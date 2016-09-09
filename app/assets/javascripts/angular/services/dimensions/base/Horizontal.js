app.service('Horizontal', ['$rootScope', 'Material', 'Element', function($rootScope, Material, Element) {
	//ORG: Dimensions are only CRUD in event services
	
	var Horizontal = {};

	Horizontal.create = function(element1, element2) {
		var model = {
			state: 'driving',
			class: 'Horizontal',
			selected: false,
			reverse: false,
			update: null,
			name: $rootScope.next_name($rootScope.sketch.dimensions, 'Horizontal '),
			values: [
			element1.name, 
			element2.name,
			null,                                 //the value
			{
				x: null,                          //coordinate for dim-box
				y: null
			}
			]
		}
		return model;
	}

	Horizontal.read = function(model) {
		var nameA = (!model.reverse) ? model.values[0] : model.values[1];
		var nameB = (!model.reverse) ? model.values[1] : model.values[0];

		var sketchItem = $rootScope.getItemByName($rootScope.sketch.name);
		var p1Item = Element.getByName(sketchItem, nameA);
		var p2Item = Element.getByName(sketchItem, nameB);

		if(model.state === 'driving') {
			p2Item.values[1] = p1Item.values[1];
		}

		var linePoints = new THREE.Geometry();
		var start = Element.pointToVector(p1Item);
		var end = Element.pointToVector(p2Item);
		linePoints.vertices = [start, end];

		linePoints.computeLineDistances();
		dimensionLine = new THREE.Line( linePoints );
		dimensionLine.name = model.name;
		dimensionLine.material = Material.dimension(model);
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		sketchObject.add(dimensionLine);
	}

	Horizontal.update = function(model) { 
		Horizontal.delete(model);
		Horizontal.read(model);
	}

	Horizontal.delete = function(model) {
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var object = sketchObject.getObjectByName(model.name, true);
		sketchObject.remove(object);
	}

	return Horizontal;

}]);


//if 90deg put a box in corner
//if 180deg put parallel indicator on

//dimension is a THREE.line, but on hover of area a cubeMesh pops up so it can be dragged, or a clear tubeMesh is over it...

//if creating a L, pending angle from last line...
//can create an angle from a line if that line is hovered over while L is pending

// tangent constraint??


/*

use for dimensioning and measuring


*/





//extended from line (collinear), requires parallel acitvated...

//if a parallel line is activated then X/Y relation is copied and rotated to line (so that you can get perpendicular from point&line)

//break into vertical, horizonal? or just make them parellel to x/y construction? -> another ways is that when drawing a vertical line, the second point X is the same as the first point X....

//if use coincident, dotted line in between stayed, maker can delete -> then relationship is unlocked

//can be both x/y coincident (i.e. two points at same spot...., will be used a lot)

//on line/arc....?
//midpoint on line?

//raidus?
//lock dimension?