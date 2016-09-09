app.service('Material', ['$rootScope', function($rootScope) {

	var Material = {}

	Material.element = function(model) {
		if (model.selected) {
			switch (model.state) {
				case 'ok': //blue
				var m = new THREE.MeshBasicMaterial({color:  0x0000FF});
				break;
				case 'construction': //light blue
				var m = new THREE.MeshBasicMaterial({color:  0xCCCCFF});
				break;
			}
		}
		else {
			switch (model.state) {
				case 'orgin':
				var m = new THREE.MeshBasicMaterial({color:  0x686868});
				break;
				case 'pending':
				case 'ok':
				var m = new THREE.MeshBasicMaterial({color:  0x009245});
				break;
				case 'construction': //light green
				var m = new THREE.MeshBasicMaterial({color:  0xFFD699});
				break;
				case 'complete': //black
				case 'locked': //black
				var m = new THREE.MeshBasicMaterial({color:  0x00FFFF});
				break;
				case 'error': //red
				var m = new THREE.MeshBasicMaterial({color:  0xFF0000});
				break;
				case 'external': //purple
				var m = new THREE.MeshBasicMaterial({color:  0xFF00FF});
				break;
				case 'hidden':
				var m = new THREE.MeshBasicMaterial({opacity:  0});
				break;
			}
		}
		return m;	
	}

	Material.dimension = function(model) {
		if(model.selected) {
			switch (model.state) {
				case 'pending':
				case 'driven':		
				var m = new THREE.LineDashedMaterial( { color: 0x0000FF, opacity: 0.25, dashSize: 1, gapSize:0.5 } ); //change on camera zoom 
				break;
				case 'driving':
				case 'editing':
				var m = new THREE.LineBasicMaterial( { color: 0x0000FF, opacity: 0.25 } );
				break;
			}	
		}
		else {
			switch (model.state) {
				case 'pending':
				case 'driven':		
				var m = new THREE.LineDashedMaterial( { color: 0x000000, opacity: 0.25, dashSize: 1, gapSize:0.5 } ); //change on camera zoom 
				break;
				case 'driving':
				case 'editing':
				var m = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.25 } );
				break;
			}			
		}
		return m;
	}

	return Material;
	
}]);

