app.service('Sketch', ['$rootScope', 'Projector', 'Tween', 'Shape', 'Element', function($rootScope, Projector, Tween, Shape, Element) {

/*
//disable orbit? keypad arrows - rotate 90deg?
(UI - dragging points edits that one spot, click on line/arc -> RST UI pops up)
marque selection is only selecting lines/arcs
cant multi select points but you can lines/arcs

ORG: really consider using directives for things and watches, I cant CRUD more than one model at a time... (multi state update is working, multi delete is not....)

ORG: model is the data - had CRUD to change three.js scene
two tiers of models: tree-items & sketch-elements
events - what happens on various user inputs
scene - base three.js stuff to get scene going, don't change
CORE: item, element, event

$rootScope.tree.add(new Sketch())

$rootScope.sketch.add(new Element.Arc())
Sketch.prototype= {
	add: function(element) {
		var object = element.read();
		sketchObject.add(object);
	}
	update: function(element) {
		var object = element.read();
	}
	delete: function(element) {
		sketchObject.remove(object);
	}
}
in watch:
for(i=0; $rootScope.sketch.elements.length>0; i++){
	$rootScope.sketch.elements[i].update();
}

DESIGN: give makers a turn external references on/off button, locate under sketch tree-item (only reference things that are visible)
-give makers a convert entries button for external references

DESIGN: if shape is available in sketch, it is created then, (i.e. when you draw a circle or rectangle a shape is created...)????

--really have to figure out dimensioning first
--creation should be element driven, not point driven
--how to make lines drive point & have points drive lines?

TODO List:
line/arc drag and delete
get two way dimensions working

TODO List:
element RST UI
element mirror/linearPattern/radialPattern

TODO:
snap cooincident x/y, merge/link point spots
snap to other points

TODO:
trim tool
measure tool

*/

	var Sketch = {}

	//// CRUD ////
	Sketch.create = function() {
		$rootScope.cellItems.push( //creates data model
			{
				state: 'pending',
				class: 'Sketch',
				name: $rootScope.next_name($rootScope.cellItems, 'Sketch '),
				index: $rootScope.next_index(),
				options: [				
					{
						id: 'sketchplane',
						type: 'select',
						string: 'Surface',
						val: null
					},
					//external references?
				],
				elements: [],
				dimensions: [],
				shapes: [],
				children: [],
				parent: null,
			}
		);
	}

	Sketch.read = function(model) { //console.log('sketch read')
		var width = 150;
		var height = 150;
		var sketchGeometry = new THREE.PlaneGeometry (width, height, 1, 1);
		var sketchPlaneMesh = new THREE.MeshBasicMaterial({ color: 0x999999, opacity: 0.1, wireframe: false, side: THREE.DoubleSide, transparent: true, depthWrite: false });
		var sketchAxesLine = new THREE.LineBasicMaterial({ color:  0xC0C0C0 });

		var sketch = new THREE.Mesh( sketchGeometry, sketchPlaneMesh);
		sketch.name = model.name;
		/*
		//make base construction
		var center = new WAX.Point(0, 0);
		var top = new WAX.Point(0, 150);
		var right = new WAX.Point(150, 0);
		var bottom = new WAX.Point(0, -150);
		var left = new WAX.Point(-150, 0);
		new WAX.Line(top, bottom);
		new WAX.Line(left, right);
		*/
		var pointsX = new THREE.Geometry();
		pointsX.vertices = [new THREE.Vector3(width/2, 0, 0), new THREE.Vector3(-width/2, 0, 0)];
		var sketchaxisX = new THREE.Line( pointsX, sketchAxesLine);
		sketchaxisX.material = sketchAxesLine;
		sketchaxisX.name = 'X Axis';
		sketch.add( sketchaxisX );

		var pointsY = new THREE.Geometry();
		pointsY.vertices = [new THREE.Vector3(0, height/2, 0), new THREE.Vector3(0, -height/2, 0)];
		var sketchaxisY = new THREE.Line( pointsY, sketchAxesLine);
		sketchaxisY.material = sketchAxesLine;
		sketchaxisY.name = 'Y Axis';
		sketch.add( sketchaxisY );
		//ORG: right now these two lines are children along with all of it's sketch elements

		var reference = scene.getObjectByName(model.options[0].val, true);
		
		//NOTE: sketch.applyMatrix(reference.matrix) was not working on load
		sketch.rotation = reference.rotation;
		sketch.position = reference.position;
		sketch.updateMatrix();
		
		sketch.traverse(function(child) { child.visible = false }); //so that it's hidden on load, change to a materials watch

		sketchesObject.add ( sketch ); //console.log(sketch.matrix)

/*		if (model.elements.length > 1 && model.shapes.length < 1) { console.log('shape init');
			var path = Sketch.shapeGenerator($rootScope.sketch);
			Shape.create(model, path); 
			//or just add shape to watch function under elements
			//Sketch.shapeGenerator(model);
			//console.log('run shapes generator'); //for when sketches are loaded
		} */
	}

	Sketch.update = function(model) {
/*		var object = scene.getObjectByName(model.options[0].val, true);
		sketch.applyMatrix( object.matrix );
		//would be to update sketchplane... don't know if I need this
		*/
	}

	Sketch.delete = function(model) {
		var object = scene.getObjectByName(model.name, true);
		sketchesObject.remove(object);

	}


	//// States //// ---really should be a watch for each below: sceneEvent, objectVisibility, tweening

	Sketch.closed = function(model) { //console.log(model)
		var paths = Shape.pathFinder(model); 
		if(paths.length > 0){ //console.log(paths); //console.log('path found'); 
			for (var i=0; i<paths.length; i++){  
				Shape.create(model, paths[i]);
			}
		}
		else {console.log('no path found');}
		var shapes = model.shapes; 
		for (var i=0; i<shapes.length; i++){ 
			Shape.read(shapes[i]);
		}
		$rootScope.sceneEvent = 'NoEvents';
		Tween.init( new THREE.Vector3(600, 600, 600));
		Element.clearRenders();
		var sketchObject = scene.getObjectByName(model.name, true);
		var xAxis = sketchObject.getObjectByName('X Axis', true);
		xAxis.visible = false;
		var yAxis = sketchObject.getObjectByName('Y Axis', true);
		yAxis.visible = false;

		$rootScope.update_tree($rootScope.cell) //updates parent, updates whole tree

		$rootScope.sketch = null;	
		coordinatesObject.traverse(function(child) { child.visible = true });

		$rootScope.save_cell($rootScope.cell);
	}

	Sketch.pending = function(model) {
		$rootScope.sceneEvent = 'SelectSurface';  ///auto detect event in options
		referencesObject.traverse(function(child) { child.visible = true });
	}

	Sketch.creating = function(model) {
		///TODO: hide options if surface is ok
		$rootScope.sceneEvent = 'SelectElement';
		$rootScope.sketch = model; //console.log($rootScope.sketch)
		$rootScope.pendingElements = [];
		larcCopies = null;

		if(model.state == 'creating') { //console.log('Sketch now creating')
			Sketch.read(model);
/*			Element.Point.create(0,0);
			var point = Element.last();
			point.state = 'orgin';
			Element.Point.read(point);*/
		}

		//// Shapes CRUD, here b/c only want to run on open & close ///////
		var shapes = $rootScope.sketch.shapes; 
		for (var i=shapes.length-1; i>=0; i--){  
			Shape.delete(shapes[i]); 
			var index = shapes.indexOf(shapes[i]);
			shapes.splice(index, 1); 
		}

		referencesObject.traverse(function(child) { child.visible = false });
		coordinatesObject.traverse(function(child) { child.visible = false });
		var sketchObject = scene.getObjectByName(model.name, true);
		var xAxis = sketchObject.getObjectByName('X Axis', true);
		xAxis.visible = true;
		var yAxis = sketchObject.getObjectByName('Y Axis', true);
		yAxis.visible = true;
		Tween.init(new THREE.Vector4( 0, 0, 600, 0 ).applyMatrix4(sketchObject.matrix));
		//console.log(sketchObject.matrix)
		//set up tween watch?
	}

	Sketch.editing = function(model) {
		Sketch.creating(model);
		$rootScope.update_sketch($rootScope.sketch);
	}	

	return Sketch;

}]);