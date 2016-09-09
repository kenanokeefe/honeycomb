EditorController = function($scope, $rootScope, $http, $routeParams, $location, Element, Dimension, Event, Sketch, Plane, Projector, Tween, Extrude, Folder, Shape) {

	if (!window.WebGLRenderingContext || window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		window.location = "http://get.webgl.org";
	} //blocks safari and ie

	var ua = navigator.userAgent.toLowerCase(); 
	if (ua.indexOf('safari') != -1) { 
		if (ua.indexOf('chrome') > -1) {
			//console.log("1") // Chrome
		} else {
			window.location = "http://get.webgl.org"; // Safari
		}
	}

	$rootScope.showSidebar = true;
	$scope.maker = localStorage.maker;
	

	if(!$scope.maker ) {
		document.location.href = '/'; //cheap cancan, have to be logged in
	}
	else { //also check and see if var is in database
		$http.get('/waitlists.json', {params: {email: $scope.maker}}).success(function(data){
			if(data.length === 0) {
				document.location.href = '/';
			}
		});
	}



/*
//ALL SERVICE NAMES
(NoEvents, SelectElement, SelectSurface, Extrude, Revolve, Shell, Fillet, Mirror, LinearPattern, Chamfer, RadialPattern, Axis, Plane, Background, Bed, Camera, Controls, Coordinates, Lights, Materials, Projector, Renderer, Stats, Tween, Sketch, Line, Rectangle2pt, Circle, Polygon, Text, Fillet, Mirror, RadialPattern, Spline, Arc, RectangleCenter, Rectangle3pt, Circle3pt, Ellipse, Chamfer, Offset, LinearPattern, A, D, L, P, S, T)
*/

	/////// CLEARING WHEN SWITCHING PAGES ///////
	//clears and loads current cell in $rootScope.cell when a cell is opened
	$rootScope.cell = {}
	$rootScope.load_cells($routeParams.cellId, true);
	$rootScope.sceneEvent = 'NoEvents';


	//clears old $watchers
	for (var i=$rootScope.$$watchers.length-1; i>=0; i--){
		var watchedVals = ['cell', 'sketch.elements', 'sketch.dimensions', 'sceneEvent'];
		if(watchedVals.indexOf($rootScope.$$watchers[i].exp) > -1) {
			//console.log($rootScope.$$watchers[i].exp+' deleted')
			$rootScope.$$watchers.splice(i, 1);
		}		
	}

	/////// EVENT MANAGER ///////
	//Events are in exsisting services, if unique event is in events folder
	//$rootScope.sceneEvent is updated when items are clicked or states are changed
	//create a heigharchy of events, (i.e. orbit and pan exsists if not overrided)
	$rootScope.$watch('sceneEvent', function(newValue, oldValue) { 
		if(newValue && oldValue) { //console.log(newValue)
			var service = newValue;
			var events = ['cursor', 'leftClick', 'doubleClick', 'hover', 'mouseUp', 'keydown'];
			//TODO: add ['middleClick', 'rightClick', 'keyboard']
			for (var i=0; i<events.length; i++){
				if(Event[service][events[i]]) {
					if(events[i] === 'keydown') {
						$(document).unbind().on('keydown', function(e) {
							Event[service].keydown(e);
						});						
					}
					$rootScope[events[i]] = Event[service][events[i]];
				}
				else {
					(events[i] === 'keydown') && $(document).unbind();					
					$rootScope[events[i]] = null;
				}
			}
			//c
		}
	}, true);


	Array.prototype.diff = function(a) {
	    return this.filter(function(i) {return a.indexOf(i) < 0;});
	};

		$rootScope.undoManager = []; //give max length?
		$rootScope.undoIndex = 0;

	$rootScope.$watch('cell', function(newValue, oldValue) { //console.log('cell watch')
/*		if(newValue && $rootScope.undoIndex == $rootScope.undoManager.length) {
			var undos = $rootScope.undoManager;
			//undos.splice($rootScope.undoIndex+1, undos.length - $rootScope.undoIndex+1)
			if(undos.length < 20) {
				$rootScope.undoIndex++;
				undos.push(angular.copy(newValue));
			} else {
				undos.shift();
				undos.push(angular.copy(newValue));		
			}
		}*/
		///FIX: extrude and possibly other tree items are being updated on each mousemove
		///// Tree-Item CRUD /////
		if(oldValue.data && newValue.data) {
			var newItems = newValue.data[0].items;
			var oldItems = oldValue.data[0].items;
			var newNames = [];
			for (var i=0; i<newItems.length; i++){
				newNames.push(newItems[i].name);
			}
			var oldNames = [];
			for (var i=0; i<oldItems.length; i++){
				oldNames.push(oldItems[i].name);
			}
			//if detect new item ---> READ
			if(newItems.length > oldItems.length) {
				for (var i=0; i<newNames.diff(oldNames).length; i++){
					for (var j=0; j<newItems.length; j++){
						var newItem = newItems[j];
						if(newItem.name == newNames.diff(oldNames)[i]) {
							if(newItem.state != 'pending') {
								eval(newItem.class).read(newItem);
							}
							else {
								eval(newItem.class).pending(newItem);
							}
							eval(newItem.class)[newItem.state](newItem);
						}	
					}
				}
			}
			//if detect item changed ---> UPDATE
			if(newItems.length == oldItems.length) {
				for (var i=0; i<newItems.length; i++){
					var newItem = newItems[i];
					var oldItem = oldItems[i];
					//if detect item option change ---> UPDATE
					var newVals = [];
					for (var j=0; j<newItem.options.length; j++){
						newVals.push(newItem.options[j].val)
					}
					var oldVals = [];
					for (var j=0; j<oldItem.options.length; j++){
						oldVals.push(oldItem.options[j].val)
					}
					if(newVals.diff(oldVals).length > 0) { //TODO: detect more than one change
						eval(newItem.class).update(newItem); //console.log(newItem.name)
						for (var j=i+1; j<newItems.length; j++){
							eval(newItems[j].class).update(newItems[j]);
						}
					}
					//if detect item state changed ---> UPDATE
					if(newItem.state != oldItem.state) {
						eval(newItem.class)[newItem.state](newItem);						
					}
				}
			}
			//if detect missing item ---> DELETE
			if(newItems.length < oldItems.length) {
				for (var i=0; i<oldNames.diff(newNames).length; i++){
					for (var j=0; j<oldItems.length; j++){
						var oldItem = oldItems[j];
						if(oldItem.name == oldNames.diff(newNames)[i]) {
							//TODO: for all following items -= 1;
							if(oldItem.children.length > 0) {
								for (var k=0; k<oldItem.children.length; k++){ 
									var child = $rootScope.getItemByName(oldItem.children[k]);
									child.parent = null;
									child.index -= 2; //console.log(child)
								}
							}
							//oldItem.children = [];
							if(oldItem.parent) { //console.log('has a parent')
								var parent = $rootScope.getItemByName(oldItem.parent);
								var childIndex = parent.children.indexOf(oldItem.name);
								parent.children.splice(childIndex, 1);
							}
							//oldItem.parent = null;
							eval(oldItem.class).delete(oldItem); //console.log($rootScope.cell)
							$rootScope.sceneEvent = 'NoEvents';
						}	
					}
				}
				$rootScope.save_cell($rootScope.cell);
			}
			//////  Toolbar ///////
			$rootScope.toolbarClass = 'feature';
			$rootScope.toolbarFeatureState = null;
			for (var j=0; j<newItems.length; j++){
				var newItem = newItems[j];
				if(['pending','creating','editing'].indexOf(newItem.state) > -1) {
					$rootScope.toolbarFeatureState = 'disabled';
					if(newItem.class == 'Sketch' && newItem.state != 'pending') {
						$rootScope.toolbarClass = 'sketch';
					}
				}
			}	
			/////// Materials /////////
			//Materials.watch(newItems, oldItems);		
		}
		///// items rake init /////
		//FIX: this is running when you change the name of the cell
		if(oldValue && newValue && oldValue.name != newValue.name) {
			for (i=referencesObject.children.length-1; i>=0; i--) {
				referencesObject.remove(referencesObject.children[i]);
			}
			for (i=sketchesObject.children.length-1; i>=0; i--) {
				sketchesObject.remove(sketchesObject.children[i]);			
			}
			for (i=meshesObject.children.length-1; i>=0; i--) {
				meshesObject.remove(meshesObject.children[i]);			
			}
			resultMeshObject.remove(resultMeshObject.children[0]);
			var newItems = newValue.data[0].items;
			for(var i=0; i<newItems.length; i++) {
				eval(newItems[i].class).read(newItems[i]);
				if(newItems[i].class == 'Sketch') {
					$rootScope.sketch = newItems[i];
					var sketchObject = scene.getObjectByName(newItems[i].name, true);
					var elements = $rootScope.sketch.elements;
					for(var j=0; j<elements.length; j++) {
						Element[elements[j].class].read(elements[j]);
					}
					var shapes = $rootScope.sketch.shapes; //console.log(shapes)
					for(var j=0; j<shapes.length; j++) {
						Shape.read(shapes[j]);
					}
					$rootScope.sketch = null;
					//sketchObject.traverse(function(child) { child.visible = false });
				}
			}
			intersected = null;
			hoveredElement = null;
			clickedElement = null;
			clickedName = null;
			measureElements = [];
			updateA = null;
			updateB = null;
			horizontalDim = null;
			verticalDim = null;
		}
		console.log(resultMeshObject)
	}, true);

	//when creating new scope, oldValue doesn't exist....
	//when canceling scope, newValue doesn't exist...

	//TODO: create an object compare script... if new to array - READ, if same - check properties and if any dif - UPDATE, if missing from array - DELETE
	updateSketch = true;
	$rootScope.$watch('sketch.elements', function(newValue, oldValue) {  
		///////////////// SKETCH.ELEMENTS ///////////////
		if(updateSketch) {
			if(newValue && oldValue) {
				newElements = newValue;
				oldElements = oldValue;
				var oldNames = [];
				for (var i=0; i<oldElements.length; i++){
					oldNames.push(oldElements[i].name);
				}
				var newNames = [];
				for (var i=0; i<newElements.length; i++){
					newNames.push(newElements[i].name);
				}
				//if detect new elements ---> READ
				if(newElements.length > oldElements.length) {
					for (var i=0; i<newNames.diff(oldNames).length; i++){
						for (var j=0; j<newElements.length; j++){
							if(newElements[j].name == newNames.diff(oldNames)[i]) {
								Element[newElements[j].class].read(newElements[j]);
							}		
						}
					}
				}
				if(newElements.length == oldElements.length) {
					for (var i=0; i<newElements.length; i++){
						var newItem = newElements[i];
						var oldItem = oldElements[i];															
						//if detect change in point x/y ---> UPDATE
						if(newItem.values.diff(oldItem.values).length > 0 && newItem.class == 'Point') {
							Element.Point.update(newItem);
							for (var j=0; j<newElements.length; j++){
								if(newElements[j].values.indexOf(newItem.name) > -1){
									Element[newElements[j].class].update(newElements[j]); 						
								}
							}
							var dims = $rootScope.sketch.dimensions;
							for (var j=0; j<dims.length; j++){
								if(dims[j].values.indexOf(newItem.name) > -1) {
									dims[j].update = newItem.name; //pass point name
								}
							}
						}	
						//if detect selected or state changed ---> UPDATE
						if(newItem.selected != oldItem.selected || newItem.state != oldItem.state) {
							Element[newItem.class].update(newItem);
						}
					}
				}
				//if detect missing elements ---> DELETE
				if(newElements.length < oldElements.length) {
					for (var i=0; i<oldNames.diff(newNames).length; i++){
						for (var j=0; j<oldElements.length; j++){
							if(oldElements[j].name == oldNames.diff(newNames)[i]) {
								Element[oldElements[j].class].delete(oldElements[j]);
								var dims = $rootScope.sketch.dimensions;
								for (var k=0; k<dims.length; k++){
									if(dims[k].values.indexOf(oldElements[j].name) > -1) {
										dims.splice(dims.indexOf(dims[k]), 1);
									}
								}
							}	
						}
					}
				}
			}
		}
		else {
			updateSketch = true;
		}
	}, true);
	$rootScope.$watch('sketch.dimensions', function(newValue, oldValue) { 
		///////////////// SKETCH.DIMENSIONS ///////////////
			///watch function error is due to what point is being updated
			///TODO: system for updating dimensions, what is the chain of updating?, system for determining fully defined elements
		if(newValue && oldValue) {
			newDims = newValue;
			oldDims = oldValue;
			var oldNames = [];
			for (var i=0; i<oldDims.length; i++){
				oldNames.push(oldDims[i].name);
			}
			var newNames = [];
			for (var i=0; i<newDims.length; i++){
				newNames.push(newDims[i].name);
			}
			//if detect new dimension ---> READ
			if(newDims.length > oldDims.length) {
				for (var i=0; i<newNames.diff(oldNames).length; i++){
					for (var j=0; j<newDims.length; j++){
						if(newDims[j].name == newNames.diff(oldNames)[i]) {
							Dimension[newDims[j].class].read(newDims[j])
						}		
					}
				}
			}
			if(newDims.length == oldDims.length) {
				for (var i=0; i<newDims.length; i++){
					var newDim = newDims[i];
					var oldDim = newDims[i];
					if(newDim.update) {
						if(newDim.update === newDim.values[0]) {
							newDim.reverse = true;
						}										
						Dimension[newDim.class].update(newDim);
						newDim.update = null;
						newDim.reverse = false;
						if(newDim.state === 'driving') {
							for (var j=0; j<newDims.length; j++){
								if(newDims[j].state === 'driving') {
									//Dimension[newDims[j].class].update(newDims[j]);
									//TODO: understand dimension resolve pattern
									for (var k=0; k<newDims[j].values.length; k++){
										var element = Element.getByName($rootScope.sketch, newDims[j].values[k]);
										if(element) {
											Element[element.class].update(element);
											var elements = $rootScope.sketch.elements;
											for (var l=0; l<elements.length; l++){
												if(elements[l].values.indexOf(element.name) > -1) {
													Element[elements[l].class].update(elements[l]);
												}
											}
										}
									}
								}
							}
							updateSketch = false;
						}
					}
					//if detect selected or state changed ---> UPDATE
					if(newDim.selected != oldDim.selected || newDim.state != oldDim.state) {
						Dimension[newDim.class].update(newDim);
					}
				}
			}
			//if detect missing old dimensions ---> DELETE
			if(newDims.length < oldDims.length) {
				for (var i=0; i<oldNames.diff(newNames).length; i++){
					for (var j=0; j<oldDims.length; j++){
						if(oldDims[j].name == oldNames.diff(newNames)[i]) {
							Dimension[oldDims[j].class].delete(oldDims[j]); 
						}	
					}
				}
			}
		}
		//console.log(updateSketch)
	}, true);



};

EditorController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'Element', 'Dimension', 'Event', 'Sketch', 'Plane', 'Projector', 'Tween', 'Extrude', 'Folder', 'Shape'];
app.controller('EditorController', EditorController);


/*
	$rootScope.camera = {
		zoom: 
		rotation:
	}
	$rootScope.$watch('camera', function(newValue, oldValue) {
		if detect camera change, rotate points ---> UPDATE
		if detect zoom change, scale points, change line radius ---> UPDATE	
	}, true);
*/


/*	
//consider also making local(or service)


///// Undo/Redo Manager /////
/// push for every 1s
$rootScope.$watch('cell', function(newValue, oldValue) {
			//fix: meshes not updating
			//fix: disable function not working

}, true);
*/