/*

function LinearPattern_activate() {
	//disable command bar buttons
	$('.tree-item').remove('.sketch.new');//remove .tree-item.sketch.new
	$.ajax({ 	
    url: "_includes/LinearPatternAppend.html",
    success: function (data) { 
	$('#tree').append(data); //add new .tree-item.linear-pattern.add.active
	$(".tree-item.active #XLinearPatternCount").val("3"); //put in html?
	$(".tree-item.active #YLinearPatternCount").val("3");	
	$(".tree-item.active #ZLinearPatternCount").val("1");
	$(".tree-item.active #XLinearPatternGap").val("50"); //base off of current mesh dimension
	$(".tree-item.active #YLinearPatternGap").val("50");	
	$(".tree-item.active #ZLinearPatternGap").val("50");
	XLinearPatternDirection = 1;
	YLinearPatternDirection = -1;
	ZLinearPatternDirection = 1;
	LinearPattern_preview();
	 },
    dataType: 'html'
});}
	
function LinearPattern_preview() {
	XLinearPatternCount = parseInt($(".active #XLinearPatternCount").val())-1; 
	XLinearPatternCountArray = [];
	for (var i = 0; i <= XLinearPatternCount; i++) {XLinearPatternCountArray.push(i);}
	YLinearPatternCount = parseInt($(".active #YLinearPatternCount").val())-1;
		YLinearPatternCountArray = [];
	for (var i = 0; i <= YLinearPatternCount; i++) {YLinearPatternCountArray.push(i);}
	ZLinearPatternCount = parseInt($(".active #ZLinearPatternCount").val())-1;
		ZLinearPatternCountArray = [];
	for (var i = 0; i <= ZLinearPatternCount; i++) {ZLinearPatternCountArray.push(i);}
	XLinearPatternGap = parseInt($(".active #XLinearPatternGap").val())*XLinearPatternDirection; 
	YLinearPatternGap = parseInt($(".active #YLinearPatternGap").val())*YLinearPatternDirection;
	ZLinearPatternGap = parseInt($(".active #ZLinearPatternGap").val())*ZLinearPatternDirection;

	if(typeof LinearPatternMeshArray!='undefined'){
for (var i = 0; i < LinearPatternMeshArray.length; i++) {
scene.remove(LinearPatternMeshArray[i]);}} //removes previous meshes
LinearPatternMeshArray = []; //creates and clears the array

	for (var x = 0; x < XLinearPatternCountArray.length; x++) {
		for (var y = 0; y < YLinearPatternCountArray.length; y++) {
			for (var z = 0; z < ZLinearPatternCountArray.length; z++) {
				if(x==0 && y==0 && z==0){}else{ //skips 000
	LinearPatternMesh = newMesh.clone(); //uses its orgin i guess...
	LinearPatternMesh.material = new THREE.MeshBasicMaterial( {color:  0x33CC33, transparent: true, opacity: 0.5, depthWrite: false  } )
	LinearPatternMesh.position.set (XLinearPatternCountArray[x]*XLinearPatternGap, YLinearPatternCountArray[y]*YLinearPatternGap, ZLinearPatternCountArray[z]*ZLinearPatternGap);
	LinearPatternMeshArray.push(LinearPatternMesh);
}}}}

for (var i = 0; i < LinearPatternMeshArray.length; i++) {
scene.add(LinearPatternMeshArray[i]);}
}
	
	//if count = 1 then deselect left and right buttons	

function LinearPattern_execute() {
	for (var i = 0; i < LinearPatternMeshArray.length; i++) {
LinearPatternMeshArray[i].material = new THREE.MeshNormalMaterial();}
	//if green is active, add
	//if red is active, subtract
	
$(".tree-item.active").addClass("delete"); //deactivates item
$(".tree-item.active").removeClass("active"); //deactivates item
}

*/