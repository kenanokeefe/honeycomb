app.service('Shape', ['$rootScope', 'Element', function($rootScope, Element) {

	var Shape = {}

	///NOTE: have to pass the sketch model in functions b/c running these scripts when the sketch scope is changing 

	Shape.pathFinder = function(model) {
		var paths = [];

		var points = Element.getByClass(model, 'Point');
		var lines = Element.getByClass(model, 'Line');
		var arcs = Element.getByClass(model, 'Arc');
		var larcs = lines.concat(arcs);

		//TODO: remove any duplicate positioned elements

		//remove construction larcs
/*		var larcsClone = larcs.slice(0); 
		for (var i=larcsClone.length-1; i>=0; i--){
			if(larcsClone[i].state === 'construction') {
				larcsClone.splice(i, 1);
			}
		}
		var larcs = larcsClone.slice(0);*/

		///finds many paths per point
		for (var i=0; i<points.length; i++){      
			firstP = points[i].name;
			var temps = [[firstP]];
			while ( temps.length > 0 ) {
				for (var j=temps.length-1; j>=0; j--){	
					var temp = temps[j];		
					lastL = temp[temp.length-2] || null;
					lastP = temp[temp.length-1];
					for (var k=0; k<larcs.length; k++){
						var index = larcs[k].values.indexOf(lastP);
						if(larcs[k].name != lastL && index > -1){            //if found connection
																										//TODO: find a single circle
							var clone = temp.slice(0);                 
							clone.push(larcs[k].name);
							index = +!index;                                               // 0 or 1
							var point = larcs[k].values[index];                       
							clone.push(point)	
							if(temp.indexOf(point) == 0) {                         //if closing path
								paths.push(clone); 				
							}
							else if(temp.indexOf(point) == -1) {               //if not short circuiting
								temps.push(clone);                                      //add all new connections
							}				
						}
					}
					temps.splice(j, 1);                                                //remove original connection
				}
			}
		}

		//console.log('paths: '+paths.length)
		//console.log($rootScope.sketch.elements)

		var remove_points = function(array) {
			for (var i=array.length-1; i>=0; i--) {					
				array[i].match(/Point/) ? array.splice(i, 1) : '';
			}
			return array.sort();			
		}

		//// Delete Matching Paths ////
		for (var i=paths.length-1; i>=0; i--){
			var path = remove_points(paths[i].slice(0));  
			for (var j=paths.length-1; j>=0; j--){
				if (j == i) { break }
				var match = remove_points(paths[j].slice(0));
				if(match.length == path.length && path.diff(match).length == 0) {
					paths.splice(j, 1);					
				}
			}
		}

		//// Delete Parent Paths ////
		for (var i=paths.length-1; i>=0; i--){
			var path = remove_points(paths[i].slice(0));  
			for (var j=paths.length-1; j>=0; j--){
				if (j == i) { break }
				var sibling = remove_points(paths[j].slice(0));
				var compare = sibling.concat(path);
				compare.sort();
				var sharedLarcs = [];
				for (var k=0; k<compare.length-1; k++) {					
					if (compare[k + 1] == compare[k]) {
						sharedLarcs.push(compare[k]);
					}
				}
				for (var k=sharedLarcs.length-1; k>=0; k--) {
					var index = compare.indexOf(sharedLarcs[k])
					compare.splice(index+1, 1);
					compare.splice(index, 1);
				}
				if(sharedLarcs.length>0) {				
					for (var k=paths.length-1; k>=0; k--){
						var parent = remove_points(paths[k].slice(0));
						if(parent.length == compare.length && compare.diff(parent).length == 0) {
							console.log(i+' and '+j+' share larcs: '+sharedLarcs.toString())
							console.log(compare.slice(0))
							paths.splice(k, 1);
							console.log('delete parent: '+parent.toString())
						}
					}
				}
			}
		}	

		/*
		child 1: Line 1, Line 2, Line 3
		child 2: Line 3, Line 4, Line 5
		parent: Line 1, Line 2, Line 4, Line 5

		check if any two paths share same Larcs
		two children share Line 3
		subtract those from child 1 and child 2 then:
		child 1 + child 2 = parent

		//BUG: also works as parent + child 1 = child 2

		*/	

		//have to find chained paths
		

		//SCHEDULE: as long as all shapes are found, they will be csg'ed in the end, doing holes should be priority in shapes right now

		return(paths);

		///TODO: 
		/// hidden points on intersections
		/// what to do with bisected lines? -need locatedOn property for points? -associated with trim stuff...
		/// generate arc vertices

	}

	Shape.create = function(model, path){
		model.shapes.push(
			{
				name: $rootScope.next_name(model.shapes, 'Shape '),
				type: 'hidden', /// put type in the features model
				path: path,
				parent: model.name,
				holeOf: null  
			}
		); //console.log(model)
	}

	Shape.read = function(model) { //console.log(model)
		var sketchObject = scene.getObjectByName(model.parent, true);
		var sketchItem = $rootScope.getItemByName(model.parent);

		var vertices = [];
		for (var i=0; i<model.path.length; i++){
			if(model.path[i].indexOf('Point') > -1) {
				var element = Element.getByName(sketchItem, model.path[i]);
				var vector = new THREE.Vector3(element.values[0], element.values[1], 0)
				vertices.push(vector);
			}
			if(model.path[i].indexOf('Arc') > -1) {
				var object = sketchObject.getObjectByName(model.path[i]);
				object.geometry.path.points.shift(); //deletes end points
				object.geometry.path.points.pop();
				for (var j=0; j<object.geometry.path.points.length; j++){
					vertices.push(object.geometry.path.points[j]);
				}
			}
		}

		var shape = new THREE.Shape();
		shape.fromPoints(vertices);
		var shapeGeometry = new THREE.ShapeGeometry( shape );
		var shapeMesh = new THREE.Mesh(shapeGeometry);
		shapeMesh.name = model.name;
		shapeMesh.type = model.type;
		if(shapeMesh.type == 'hidden') {
			shapeMesh.material = new THREE.MeshBasicMaterial({ color: 0x804923, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false});
		}
		if(shapeMesh.type == 'solid') {
			shapeMesh.material = new THREE.MeshBasicMaterial({ color: 0x804923, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false});
		}
		//add as a child of the sketch

		//// Detect Hole Paths ////  use point in polygon algorithm for each vertice

		//if has holeOf: do a csg cut
		
		sketchObject.add(shapeMesh); //console.log(shapeMesh);
	}

	Shape.update = function(model){
		Shape.delete(model);
		Shape.read(model);
	}

	Shape.delete = function(model){  //console.log(model)
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
		var object = sketchObject.getObjectByName(model.name, true);
		sketchObject.remove(object);
	}

	return Shape;

}]);



			//shape meshes are children of the sketch, determine way to find default shapes, determine holes
			//have to guarantee same shapes are generated
			//have to have shapes generated when file is loaded
			//if sketch is changed at all, have to create and select new shapes
			//







			/*






		////WORKS ///finds one path per point

		for (var i=0; i<points.length; i++){      
			firstP = points[i].name;
			var temps = [[firstP]];
			var foundPath = false;
			while ( !foundPath ) {
				for (var j=0; j<temps.length; j++){       ///find new line for each temp		
					var temp = temps[j];		
					lastL = temp[temp.length-2] || null;
					lastP = temp[temp.length-1];
					for (var k=0; k<larcs.length; k++){ 
						var index = larcs[k].values.indexOf(lastP);
						if(!foundPath && larcs[k].name != lastL && index > -1){ 
							var clone = temp.slice(0);                         ///create a new temp for each
							clone.push(larcs[k].name);                       
							index == 0 ? clone.push(larcs[k].values[1]) : '';
							index == 1 ? clone.push(larcs[k].values[0]) : '';  //find other point, push
							if(firstP == clone[clone.length-1]) {
								paths.push(clone); //console.log(firstP)
								foundPath = true; 								
							}
							else {
								temps.push(clone);
							}
						}
					}
				}
			}
		}



			*/