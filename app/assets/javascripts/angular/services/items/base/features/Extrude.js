app.service('Extrude', ['$rootScope', function($rootScope) {

	var Extrude = {}

	Extrude.create = function() {
		$rootScope.cellItems.push(
			{
				state: 'pending',
				class: 'Extrude',
				name: $rootScope.next_name($rootScope.cellItems, 'Extrude '),
				index: $rootScope.next_index(),
				options: [
					{
						id: 'shape',
						type: 'select',
						string: 'Shapes',       ////DESIGN: add way to clear selected?
						val: null,
						shapes:[]
					},
					{
						id: 'height', 
						type: 'number', 
						val: 30,
					},					
					{
						id: 'direction', 
						type: 'switch', 
						val: 'left',
						cases: ['left','middle','right']
					},
					{
						id: 'csg', 
						type: 'switch', 
						val: 'join',
						cases: ['cut','join']
					},
					//Future features: offset, second direction, new body, up to surface, taper
				],
				children: [],
				parent: null,
				previous: null
			} 
		);

		//TODO: sketch selector
		/// Sketch Finder ///// --put in a service
		var extrude = $rootScope.last_item();
		var sketches = $rootScope.getItemsByClass('Sketch');
		for (var i=sketches.length-1; i>=0; i--){
			if(sketches[i].parent){ //if sketch has a parent delete from array
				var index = sketches.indexOf(sketches[i]);
  				sketches.splice(index, 1); 				
			}
		} //console.log(sketches.length)
		if(sketches.length == 0) { 
			//console.log('no sketches available')
		}
		else if(sketches.length == 1) {  //console.log('sketch found')
			extrude.children[0] = sketches[0].name;
			extrude.state = 'creating';
			var sketch = $rootScope.getItemByName(extrude.children[0]);
			sketch.parent = extrude.name;
			sketch.index = extrude.index + 1;
		}
		else if(sketches.length > 1) { //console.log('multiple sketches available')
			//select sketch event
		}

		//// Shape Finder //////
		if(sketch) {
			if(sketch.shapes.length > 0) {
				for (var i=0; i<sketch.shapes.length; i++){
					//if hole don't include right away
					//sketch.shapes[i].type = 'solid';  
					extrude.options[0].shapes.push(sketch.shapes[i].name)
				}
			}
			else if(sketch.shapes.length == 0) {
				///make shape select option say 'no shapes found' with a none icon for the cursor
			}
		}

		//// Previous Mesh Finder /////
		if(meshesObject.children.length > 0) { 
			var previousMesh = meshesObject.children[meshesObject.children.length-1];
			extrude.previous = previousMesh.name;
		}		


		//TODO: error detection, if previous feature or sketch is deleted
		//TODO: update extrude when close sketch
		//BUG: on sketch update then extrude cancel
	}

	Extrude.read = function(model) {
		if(model.children[0] && model.options[0].shapes.length > 0) { 

			var sketchName = model.children[0]; 
			var sketchObject = scene.getObjectByName(sketchName, true);

			var extrudeGeometrys = [];
			var shapes = model.options[0].shapes; 
			for (var i=0; i<shapes.length; i++){
				var shapeObject = sketchObject.getObjectByName(shapes[i], true);
				var shapeItem = $rootScope.getItemByName(shapes[i]);
				var shape = new THREE.Shape();
				shape.fromPoints(shapeObject.geometry.vertices);

				var height = model.options[1].val;
				var extrusionSettings = {bevelEnabled: false, material: 0, extrudeMaterial: 1, amount: height, curveSegments: 100};
				var extrudeGeometry = new THREE.ExtrudeGeometry( shape, extrusionSettings );		
				extrudeGeometrys.push(extrudeGeometry);
			}
			var previousBSP = new ThreeBSP( extrudeGeometrys[0] );
			for (var i=1; i<extrudeGeometrys.length; i++){ 
				var currentBSP = new ThreeBSP( extrudeGeometrys[i] );
				var previousBSP = previousBSP.union( currentBSP );
				//if has hole, csg cut hole....
			}
			var extrudeMesh = previousBSP.toMesh();
			extrudeMesh.name = model.name;

			switch (model.options[2].val) {
				case 'left':
				var direction = 0;
					break;
				case 'middle':
				var direction = -height/2;
					break;
				case 'right':
				var direction = -height;
					break;
			}		

			//NOTE: in three.js moving the geometry also moves the mesh, moving mesh does not move geometry, the CSG uses the geometries, therefor need to apply matrixes to the geometries
			
			var sketchMatrix = sketchObject.matrix;

			extrudeMesh.geometry.applyMatrix(sketchMatrix);
			
			var PositionVector = new THREE.Vector4( 0, 0,direction,0).applyMatrix4(sketchMatrix); 
			extrudeMesh.geometry.applyMatrix(new THREE.Matrix4().setPosition(PositionVector));	

			extrudeMesh.material = new THREE.MeshPhongMaterial( { opacity: 0.5, ambient: 0x000000, specular: 0x555555, shininess: 30, transparent: true, side: THREE.DoubleSide, depthWrite: false} );

			meshesObject.add( extrudeMesh );	

			if(model.previous){
				var previousMesh = resultMeshObject.getObjectByName(model.previous, true);		
				var previousBSP = new ThreeBSP( previousMesh.geometry );
				var currentBSP = new ThreeBSP( extrudeMesh.geometry );
				switch (model.options[3].val) {
					case 'join': var newBSP = previousBSP.union( currentBSP ); break;
					case 'cut': var newBSP = previousBSP.subtract( currentBSP ); break;
				}
				var resultMesh = newBSP.toMesh();
				resultMesh.name = extrudeMesh.name;
				//TODO: if not connecting, indicate seperate bodies in folder
			}
			else {
				var resultMesh = extrudeMesh.clone();
				resultMesh.remove(resultMesh.children[0]); //NOTE: removes cloned shapeMesh
			}
			resultMesh.material = new THREE.MeshPhongMaterial( { color: 0xffaa00, ambient: 0x000000, specular: 0x555555, shininess: 30, transparent: true, side: THREE.DoubleSide, depthWrite: true} ); 
			//vertexColors: THREE.VertexColors, needed to color faces, causing error though right now
			resultMeshObject.add ( resultMesh );		//console.log(resultMesh)
		}
		else {
			model.state = 'pending';
		}
	}

	Extrude.update = function(model) {
		Extrude.delete(model);
		Extrude.read(model);
	}

	Extrude.delete = function(model) {
		var object = meshesObject.getObjectByName(model.name, true);
		meshesObject.remove(object);
		var object = resultMeshObject.getObjectByName(model.name, true);
		resultMeshObject.remove(object);
		
	}

	//// States ////  ---- going to be deleting after fixing sketch service
	Extrude.closed = function(model) {
		$rootScope.save_cell($rootScope.cell);
	}
	Extrude.pending = function(model) {}
	Extrude.creating = function(model) {}
	Extrude.editing = function(model) {}	

	return Extrude;

}]);