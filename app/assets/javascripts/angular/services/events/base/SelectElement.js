app.service('SelectElement', ['$rootScope', 'Projector', 'Element', 'Dimension', 'Marquee', 'Snap', 'Coincident', function($rootScope, Projector, Element, Dimension, Marquee, Snap, Coincident) {

	var SelectElement = {}

	SelectElement.cursor = 'default';

	SelectElement.leftClick = function($event) {
		if($event.button == 0) {
			Marquee.leftClick($event);
			Projector.unproject($event);
			var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
			clickedName = Projector.select(sketchObject.children); //global
			if(clickedName && clickedName.indexOf('Axis') === -1) {
				if(clickedName.match(/Point/)){
					var element = Element.getByName($rootScope.sketch, clickedName);
					$rootScope.pointBeingDragged = clickedName;
					setTimeout(function(){
						if($rootScope.pointBeingDragged) {
							$rootScope.draggingPoint = true;
							
							Element.clearSelected();
							element.selected = true;
						}
					},100);
				}
				if(clickedName.match(/Line|Arc/)){
					var element = Element.getByName($rootScope.sketch, clickedName);
					$rootScope.larcBeingDragged = clickedName;
					$rootScope.larcStartPoint = Snap.find($event);	
					setTimeout(function(){
						if($rootScope.larcBeingDragged) {
							$rootScope.draggingLarc = true;
						}
					},100);
				}
				if(clickedName.match(/Distance|Angle|Horizontal|Vertical/)){
					var element = Dimension.getByName($rootScope.sketch, clickedName);
				}				
				var selected = Element.getBySelected($rootScope.sketch);
				if( selected.length > 0 && $event.ctrlKey === false) {
					setTimeout(function(){
						if(!$rootScope.draggingLarc) {
							Element.clearSelected();
							element.selected = true;
							$rootScope.$digest();
						}
					},100);
				}
				if($event.ctrlKey === true && element.selected === true) {
					element.selected = false;
				}
				else {
					element.selected = true;
				}
			}
			else if (!clickedName && $event.ctrlKey === false) {
				Element.clearSelected();
			}
		}
	}

	SelectElement.doubleClick = function($event) {
		//not working b/c need to break things into mousedown and click
		//things that also need a mouseUp need a mousedown
		//but dblclick only works properly with click function
/*		Element.clearRenders();
		$("#SnappedCursor").remove();
		$rootScope.sceneEvent = 'SelectElement';
		$rootScope.Marquee = null;*/
	}

	SelectElement.hover = function($event) {
		Projector.unproject($event);
		var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);

		Marquee.hover($event);

		var hoveredName = Projector.select(sketchObject.children);
		if(hoveredName  && hoveredName.indexOf('Axis') === -1) {
			var element = Element.getByName($rootScope.sketch, hoveredName);
			$rootScope.cursor = 'copy'; //(element.selected === true) ? 'move' :
		}
		else { 
			$rootScope.cursor = 'default';
		}
	
		if($rootScope.draggingPoint == true) {
			$rootScope.cursor = 'move';
			var snap = Snap.find($event);
			var element = Element.getByName($rootScope.sketch, $rootScope.pointBeingDragged);
			element.values[0] = snap.x;
			element.values[1] = snap.y;
			Coincident.findHorizontal(element, snap);
			Coincident.findVertical(element, snap);	
		}
		if($rootScope.draggingLarc == true) {
			$rootScope.cursor = 'move';
			var snap1 = $rootScope.larcStartPoint;
			var snap = Snap.find($event);
			var dif = { x: snap.x - snap1.x, y: snap.y - snap1.y }

			var selected = Element.getBySelected($rootScope.sketch);
			var movedPoints = [];
			for (var i=0; i<selected.length; i++){
				if(selected[i].name.match(/Line|Arc/)) { //console.log(selected[i].name)
					var larc = Element.getByName($rootScope.sketch, selected[i].name);
					var p1 = Element.getByName($rootScope.sketch, larc.values[0]);
					if (movedPoints.indexOf(p1) === -1) {
						p1.values[0] += dif.x;
						p1.values[1] += dif.y;						
						movedPoints.push(p1);
					}
					var p2 = Element.getByName($rootScope.sketch, larc.values[1]);
					if (movedPoints.indexOf(p2) === -1) {
						p2.values[0] += dif.x;
						p2.values[1] += dif.y;						
						movedPoints.push(p2);
					}
				}
			}

			$rootScope.larcStartPoint = snap;	
			movedPoints = [];

			//TODO: multi-larc drag (drag all selected), use Transform box?, only use transform box when complete loop or a complete object is selected?
			//TODO: copy selected, atl+drag and ctrl+c
		}

	}

	SelectElement.mouseUp = function($event) {
		if($rootScope.pointBeingDragged) {
			var element = Element.getByName($rootScope.sketch, $rootScope.pointBeingDragged);
			var lines = Element.getByClass($rootScope.sketch, 'Line');
			for (var i=0; i<lines.length; i++){
				if(lines[i].values.indexOf(element.name) > -1) {
					Coincident.createHorizontalAndVertical(lines[i]);
				}
			}	
			Element.findMerge(element);
		}
		$rootScope.draggingPoint = false;
		$rootScope.pointBeingDragged = null;
		$rootScope.draggingLarc = false;
		$rootScope.larcBeingDragged = null;
		$rootScope.larcStartPoint = null;
		Marquee.mouseUp($event);		
	}

	SelectElement.keydown = function($event) {
		switch ($event.keyCode) { //shared in sketch-tools
			case 27: //ESC
			Element.clearRenders();
			Dimension.clearPending();
			Element.clearSelected();
			$("#SnappedCursor").remove();
			$rootScope.sceneEvent = 'SelectElement';
			break;

			case 46: //DEL
			Element.deleteSelected();	
			break;	
		}
		if($rootScope.sceneEvent == 'SelectElement') {
			var shortcuts = [ //make array in toolbar.js $rootScope, use here
			{key: 'L', event: 'Line'},
			{key: 'C', event: 'Circle'},
			{key: 'R', event: 'Rectangle2pt'},
			{key: '', event: 'Mirror'},
			{key: '', event: 'Radial'},
			{key: '', event: 'Linear'},
			];
			for (var i=0; i<shortcuts.length; i++){
				if($event.keyCode === shortcuts[i].key.charCodeAt(0) && $event.ctrlKey === false && $event.shiftKey === false) {
					$rootScope.sceneEvent = shortcuts[i].event; 
				}
			}
/*			if($event.keyCode === 9) { //TAB
				var selected = Element.getBySelected($rootScope.sketch);
				var makeAllConstruction = false;
				for (var i=0; i<selected.length; i++){
					if(selected[i].name.match(/Line|Arc/)) {
						if(selected[i].state === 'ok'){
							selected[i].state = 'construction';
							var makeAllConstruction = true;
						}
						else if(selected[i].state === 'construction' && !makeAllConstruction){
							selected[i].state = 'ok';
						}
					}
				}
			}*/
			if($event.ctrlKey === true && $event.keyCode === 67) { //CTRL+C
				$rootScope.sceneEvent = 'SelectElement';
				var selected = Element.getBySelected($rootScope.sketch);
				larcCopies = [];
				for (var i=0; i<selected.length; i++){
					if(selected[i].name.match(/Line|Arc/)) {  //console.log(selected[i].name);
						larcCopies.push(selected[i]);
						var p1 = Element.getByName($rootScope.sketch, selected[i].values[0]);
						var p2 = Element.getByName($rootScope.sketch, selected[i].values[1]);
						(larcCopies.indexOf(p1) === -1) && larcCopies.push(p1);
						(larcCopies.indexOf(p2) === -1) && larcCopies.push(p2);
					}
				}
			}
			if(larcCopies && $event.ctrlKey === true && $event.keyCode === 86) { //PASTE		
				$rootScope.sceneEvent = 'SelectElement';
				var coords = { x: [], y: [] };
				for (var i=0; i<larcCopies.length; i++){
					if(larcCopies[i].name.match(/Point/)) {
						coords.x.push(larcCopies[i].values[0]);
						coords.y.push(larcCopies[i].values[1]);
					}
				}
				var center = { x: 0, y: 0 };
				for (var i=0; i<coords.x.length; i++){
				 	center.x += coords.x[i];
				 	center.y += coords.y[i];
				}
				center.x /= coords.x.length;
				center.y /= coords.y.length;
				var copiedNames = [];
				var newPoints = [];
				for (var i=0; i<larcCopies.length; i++){
					copiedNames.push(larcCopies[i].name);
					if(larcCopies[i].name.match(/Point/)) {
						var x = larcCopies[i].values[0] - center.x;
						var y = larcCopies[i].values[1] - center.y;
						Element.Point.create( x, y );
						var point = Element.last();
						point.state = larcCopies[i].state;
						newPoints.push(Element.last().name);
					}
					else {
						newPoints.push('foo');
					}
				} //console.log(copiedNames); console.log(newPoints)
				for (var i=0; i<larcCopies.length; i++) {
					if(larcCopies[i].name.match(/Line|Arc/)) {
						var name1 = newPoints[copiedNames.indexOf(larcCopies[i].values[0])]
						var p1 = Element.getByName($rootScope.sketch, name1);
						var name2 = newPoints[copiedNames.indexOf(larcCopies[i].values[1])]
						var p2 = Element.getByName($rootScope.sketch, name2);
						Element[larcCopies[i].class].create( p1, p2 );
						var larc = Element.last();
						larc.state = larcCopies[i].state; //only if 'ok' or 'construction'?
					}
				} console.log($rootScope.sketch.elements)
				//TODO: also copy dimensions
				//BUG: again, stuff doesn't generate till mousemove
				larcCopies = [];	
			}
		}
		$rootScope.$digest();   ////----yes! works great. Use to run watch functions
	}

	return SelectElement;

}]);