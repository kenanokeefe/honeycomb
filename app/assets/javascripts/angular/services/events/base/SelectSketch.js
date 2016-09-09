app.service('SelectSketch', ['$rootScope', 'Projector', function($rootScope, Projector) {

	var SelectSketch = {}

	SelectSketch.cursor = 'select';

	SelectSketch.leftClick = function($event) {
		//IDEA: create a bounding box plane over active sketch elements

/*		Projector.unproject($event);
		var clickedName = Projector.select(sketchesObject.children);
		if(clickedName) {
			var treeItems = $rootScope.cell.data[0].items;
			for (var j=0; j<treeItems.length; j++){
				var item = treeItems[j];
				if(item.class == 'Extrude' && item.state == 'pending') {
					item.children.push(clickedName);
					//item.state = 'creating';
				}
			}	
		}*/
	}

	SelectSketch.doubleClick = function($event) {

	}

	SelectSketch.hover = function($event) {
		//Projector.unproject($event);
		//Projector.hover(sketchesObject.children);
		//clear hovered when leaving sceneEvent
	}

	return SelectSketch;

}]);