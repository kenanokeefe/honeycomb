app.service('Item', ['Folder', 'Plane', 'Axis', 'Sketch', 'Extrude', 'Revolve', 'Shell', 'FilletItem', 'MirrorItem', 'LinearPatternItem', 'ChamferItem', 'RadialPatternItem', function(Folder, Plane, Axis, Sketch, Extrude, Revolve, Shell, FilletItem, MirrorItem, LinearPatternItem, ChamferItem, RadialPatternItem) {

	//new Item.Sketch(e)
	var Item = {}

	Item.watch = function(newItems, oldItems) {

	}

	Item.Plane = Plane;

	return Item;

}]);