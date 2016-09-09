app.service('SelectSurface', ['$rootScope', 'Projector', 'Plane', function($rootScope, Projector, Plane) {

	var SelectSurface = {}

	SelectSurface.cursor = 'select';

	SelectSurface.leftClick = function($event) {
		Projector.unproject($event);
		var clickedName = Projector.select(referencesObject.children);
		if(clickedName && $event.button == 0) {
			var treeItems = $rootScope.cell.data[0].items;
			for (var j=0; j<treeItems.length; j++){
				var item = treeItems[j];
				if(item.class == 'Sketch' && item.state == 'pending') {
					item.options[0].val = clickedName;
					item.state = 'creating';
				}
			}	
		}
	}

	SelectSurface.doubleClick = function($event) {

	}

	SelectSurface.hover = function($event) {
		Projector.unproject($event);
		Projector.hover(referencesObject.children);
		//clear hovered when leaving sceneEvent
	}

	return SelectSurface;

}]);