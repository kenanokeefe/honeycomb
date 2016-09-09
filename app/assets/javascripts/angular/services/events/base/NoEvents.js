app.service('NoEvents', ['$rootScope', 'Projector', function($rootScope, Projector) {

	var NoEvents = {}

	return NoEvents;

}]);

/*

need services for:
normal - can select meshes/edges/whatever
sketch - can select sketch elements, external references
selectLine - select valid lines, for mirror and others....
selectSurface - select valid Surfaces, for sketch creation and others...
selectPoint - select valid Points, for sketch circularPatterns and others....
selectAxis - select valid Axes, for revolve and others....
selectShape - select valid Shapes, for mesh creation and others.....
orbit
pan
look
trim
measure
paint
copySelected
rotateSelected
scaleSelected
moveSelected

*/