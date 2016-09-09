app.service('Event', ['$rootScope', 'NoEvents', 'SelectElement', 'SelectFace', 'SelectShape', 'SelectSketch', 'SelectSurface', 'Look', 'Marquee', 'Snap', 'Transform', 'ArcEvent', 'Circle', 'Line', 'Measure', 'MirrorEvent', 'Polygon', 'Rectangle2pt', 'Spline', function($rootScope, NoEvents, SelectElement, SelectFace, SelectShape, SelectSketch, SelectSurface, Look, Marquee, Snap, Transform, ArcEvent, Circle, Line, Measure, MirrorEvent, Polygon, Rectangle2pt, Spline) {

	var Event = {};

	Event.NoEvents = NoEvents;
	Event.SelectElement = SelectElement;
	Event.SelectFace = SelectFace;
	Event.SelectShape = SelectShape;
	Event.SelectSketch = SelectSketch;
	Event.SelectSurface = SelectSurface;
	Event.Look = Look;
	Event.Marquee = Marquee;
	Event.Snap = Snap;
	Event.Transform = Transform;
	Event.Arc = ArcEvent;
	Event.Circle = Circle;
	Event.Line = Line;
	Event.Measure = Measure;
	Event.Mirror = MirrorEvent;
	Event.Polygon = Polygon;
	Event.Rectangle2pt = Rectangle2pt;
	Event.Spline = Spline;

	return Event;

}]);

/*

base file for event creation

type of possible events:
blur
change
focus
select
submit
reset
keydown
keypress
keyup
mouseover
mousedown
mouseout
mouseenter
mouseup
click
dblclick
load
error
unload
resize

console.log($event):
jQuery.Event {
	
	keyCode: ------- key number
	altKey: false, ------useful
	shiftKey: false, ------useful
	ctrlKey: false; ------useful

	button:    ---- 0 if left click, 1 if middle, 2 if right
	timeStamp:  ----- count be useful to determine event order	
	type: 'mousedown'  ----couse use this to cycle through events	
	which: ----same thing as keyCode or button+1

	clientX/clientY:
	offsetX/offsetY:
	pageX/pageY:
	screenX/screenY:

	bubbles: --- for event heiarchy?
	eventPhase: --- for event heiarchy?
	
	
	cancelable: ---false, then that means you cannot prevent default behavior
	isDefaultPrevented:
	currentTarget:
	delegateTarget:
	view:
	relatedTarget:
	target:
	buttons:
	data:  ---- shows the index of event in the html DOM?
	toElement:	
	fromElement:
	handleObj:	
	metaKey:
	originalEvent:
}

*/