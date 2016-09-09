app.service('Coincident', ['$rootScope', 'Element', 'Dimension', function($rootScope, Element, Dimension) {

	var Coincident = {}

	Coincident.check = function(pItem1, pItem2) {
		var hasDim = false;
		for (var i=0; i<$rootScope.sketch.dimensions.length; i++){
			var dim = $rootScope.sketch.dimensions[i]; 
			if(dim.values.indexOf(pItem1.name) > -1 && dim.values.indexOf(pItem2.name) > -1 && dim.class != 'Distance' && dim.class != 'Angle') {
				hasDim = true;
			}
		}
		return hasDim;
	}

	Coincident.createHorizontalAndVertical = function(line) {
		var nameA = line.values[0];
		var nameB = line.values[1];
		var sketch = $rootScope.getItemByName($rootScope.sketch.name);
		var p1 = Element.getByName(sketch, nameA); //console.log(p1.values)
		var p2 = Element.getByName(sketch, nameB); //console.log(p2.values)
		if(p1.values[0] === p2.values[0] && !Coincident.check(p1,p2)) {
			var dim = Dimension.Vertical.create(p1, p2); //console.log('create vertical')
			$rootScope.sketch.dimensions.push(dim);
		}
		if(p1.values[1] === p2.values[1] && !Coincident.check(p1,p2)) {
			var dim = Dimension.Horizontal.create(p1, p2); //console.log('create horizontal')
			$rootScope.sketch.dimensions.push(dim);
		}
	}



	Coincident.findHorizontal = function(pointToUpdate, snap) {
		var ref = {item: null, distance: null};
		var points = Element.getByClass($rootScope.sketch, 'Point');
		for (var i=0; i<points.length; i++) {
			if(points[i].name === pointToUpdate.name) {continue;}	
			if(points[i].state == 'ok') {
				var pY = points[i].values[1];
				if(snap.y < pY + 1 && snap.y > pY - 1) { //TODO: base range on zoom
					var start = Element.pointToVector(points[i]);
					var end = Element.pointToVector(pointToUpdate);
					var distance = start.distanceTo(end);
					if(!ref.distance || distance < ref.distance) {
						ref = {item: points[i], distance: distance};
					}
				}
			}
		}
		if(ref.item) {
			pointToUpdate.values[1] = ref.item.values[1];
			//add dotted line
		}
	}

	Coincident.findVertical = function(pointToUpdate, snap) {
		var ref = {item: null, distance: null};
		var points = Element.getByClass($rootScope.sketch, 'Point');
		for (var i=0; i<points.length; i++) {
			if(points[i].name === pointToUpdate.name) {continue;}	
			if(points[i].state == 'ok') {
				var pX = points[i].values[0];
				if(snap.x < pX + 1 && snap.x > pX - 1) { //TODO: base range on zoom
					var start = Element.pointToVector(points[i]);
					var end = Element.pointToVector(pointToUpdate);
					var distance = start.distanceTo(end);
					if(!ref.distance || distance < ref.distance) {
						ref = {item: points[i], distance: distance};
					}
				}
			}
		}
		if(ref.item) {
			pointToUpdate.values[0] = ref.item.values[0];
			//add dotted line
		}
	}

	return Coincident;

}]);






/*

	FindVertical.click = function(point) {
		//TODO: get closest - vector.distanceTo(vector)
		var refX = null;
		var points = Element.getByClass($rootScope.sketch, 'Point');
		for (var i=0; i<points.length; i++) {
			if(points[i].name === pointToUpdate.name) {continue;}		
			if(points[i].state == 'ok') {
				var pX = points[i].values[0];
				if(snap.x < pX + 1 && snap.x > pX - 1) {
				}
			}
		}
	}

*/



/*			for (var i=0; i<$rootScope.sketch.dimensions.length; i++){
				var dim = $rootScope.sketch.dimensions[i]; 
				if(dim.values.indexOf(ref.item) > -1 && dim.values.indexOf(pointToUpdate) > -1) {
					verticalDim = dim; // if these two points already have a vertical dim
				}
			}			
			if(!verticalDim) {
				verticalDim = Dimension.Vertical.create(ref.item, pointToUpdate);
				$rootScope.sketch.dimensions.push(verticalDim);
			}
			else {
				Dimension.Vertical.update(verticalDim);
				if(finish) {verticalDim = null; console.log('finish')}
			}
		}
		else {
			if(verticalDim) {
				var dimensions = $rootScope.sketch.dimensions;
				dimensions.splice(dimensions.indexOf(verticalDim), 1);
				verticalDim = null;
			}*/




/*					if(!verticalDim) {
						if(pointToUpdate.state === 'pending') {
							verticalDim = Dimension.Vertical.create(refX, $rootScope.snappedPoint);
						}
						else {
							verticalDim = Dimension.Vertical.create(refX, pointToUpdate);
						}
						$rootScope.sketch.dimensions.push(verticalDim);
						refX = null;
						return;
					}
					else {
						Dimension.Vertical.update(verticalDim);
						if(finish) {verticalDim = null; console.log('finish')}
						refX = null;
						return;
					}*/

/*		if(verticalDim) {
			var dimensions = $rootScope.sketch.dimensions;
			dimensions.splice(dimensions.indexOf(verticalDim), 1);
		}*/