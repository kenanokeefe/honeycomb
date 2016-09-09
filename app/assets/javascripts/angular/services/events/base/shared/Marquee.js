app.service('Marquee', ['$rootScope', 'Projector', function($rootScope, Projector) {

	var Marquee = {}

	Marquee.cursor = 'default';

	Marquee.leftClick = function($event) {
		if ( $event.button === 0 ) {
			$('#Scene').append('<div id="Marquee"></div>');
			$rootScope.marquee = {x: $event.clientX, y: $event.clientY }
			var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
			$rootScope.marqueeSnapStart = Projector.snap(sketchObject);
		}
	}

	Marquee.doubleClick = function($event) {
	}

	Marquee.hover = function($event) { 
		if($rootScope.marquee && !$rootScope.pointBeingDragged && !$rootScope.larcBeingDragged) {
			var start = $rootScope.marquee;
			var end = {x: $event.clientX, y: $event.clientY };
			if (start.x < end.x) {
				var left = start.x; 
				var width = end.x - start.x;
			}
			else {
				var left = end.x; 
				var width = start.x - end.x;
			}
			if (start.y < end.y) {
				var top = start.y; 
				var height = end.y - start.y;
			}
			else {
				var top = end.y; 
				var height = start.y - end.y;
			}
			$('#Marquee').css('left',left);
			$('#Marquee').css('top',top);
			$('#Marquee').css('width',width);
			$('#Marquee').css('height',height);

			//FIX: bug when hovering back onto Marquee div

			var snapStart = $rootScope.marqueeSnapStart;
			var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
			var snapEnd = Projector.snap(sketchObject);
			
			var min = {
				x: snapStart.x < snapEnd.x ? snapStart.x : snapEnd.x,
				y: snapStart.y < snapEnd.y ? snapStart.y : snapEnd.y
			}
			var max = {
				x: snapStart.x > snapEnd.x ? snapStart.x : snapEnd.x,
				y: snapStart.y > snapEnd.y ? snapStart.y : snapEnd.y
			}
			//TODO: one direction just need one part of element to highlight
			//how?
			//DONE:other direction need to be covering whole element
			var elements = $rootScope.sketch.elements;
			for (var i=0; i<elements.length; i++){ 
				var sketchObject = scene.getObjectByName($rootScope.sketch.name, true);
				var elementObject = sketchObject.getObjectByName(elements[i].name, true);
				var test = []; 
				if(elementObject.name.match(/Point/)) {
					test.push({ x: elementObject.position.x, y: elementObject.position.y });
				} 
				if(elementObject.name.match(/Line|Arc|Dimension/)) {
					//var points = elementObject.geometry.path.points;
					var points = elementObject.geometry.vertices
					for (var j=0; j<points.length; j++){
						test.push({ x: points[j].x, y: points[j].y });
					}
				}
				var covered = test.length > 0 ? true : false;
				for (var j=0; j<test.length; j++){
					covered = (covered == true && min.x < test[j].x && test[j].x < max.x
											&& min.y < test[j].y && test[j].y < max.y) ? true : false;
					//TODO: partial select
				}
				//BUG: just projects a rect on sketchplane, if rotate doesn't take into account
				 if(covered === true) {
				 	elements[i].selected = true;
				 }
				 else {
				 	if( elements[i].selected === true && $event.ctrlKey === true ) {
			 			elements[i].selected = true;
				 	}
				 	else {
				 		elements[i].selected = false;
				 	}
				 }
			}			
		}
		else {
			$rootScope.marquee = null;
		}	
	}

	Marquee.mouseUp = function($event) {
		if($rootScope.marquee) {
			$rootScope.marquee = null;
			$("#Marquee").remove();
		}
	}

	return Marquee;

}]);