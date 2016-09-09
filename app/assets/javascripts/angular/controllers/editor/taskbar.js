EditorTaskbarController = function($scope, $rootScope, $http, $routeParams, $location) {

	$scope.highlight = function() {
		//$('#Title input').select()
	}

	$scope.blur = function() {
		$rootScope.save_cell($rootScope.cell);
	}

    $scope.toggle_menu = function() {
    	$scope.menu = !$scope.menu;
		angular.element(document.body).bind('click', function(e){
			if (!e.target.classList.contains('menu')) {
				$scope.menu = false;
				$scope.$apply();
				angular.element(document.body).unbind();
			}
		});
    }

	$scope.menuItems = [
/*		{ 
			id: 'Undo', 
			name: 'Undo', 
			shortcut: '(Ctrl+Z)',  //detect windows vs apple for command hints
			action: function(foo) {
				if($rootScope.undoIndex > 1) {
					$rootScope.cell = $rootScope.undoManager[$rootScope.undoIndex-2]
					$rootScope.undoIndex--;
				}
				else if($rootScope.undoIndex = 1) {
					$rootScope.cell = $rootScope.undoManager[0];
				}
				//console.log($rootScope.undoIndex)
			}
		}, 
		{ 
			id: 'Redo', 
			name: 'Redo', 
			shortcut: '(Ctrl+Y)',
			action: function(foo) {
				//console.log($rootScope.undoIndex)
				if($rootScope.undoIndex >= 1 && $rootScope.undoIndex < $rootScope.undoManager.length) {
					$rootScope.cell = $rootScope.undoManager[$rootScope.undoIndex]
					$rootScope.undoIndex++;
				}
			}
		},*/
		{ 
			id: 'Download', 
			name: 'Download .STL',
			action: function(cell) { //console.log('download')
				//if downloading from home view, going to have to generate mesh...?!
				//get the latest resultMesh
				var results = resultMeshObject.children;
				var mesh = results[results.length-1];
				mesh.geometry.mergeVertices(); /// -- possible mesh fixer
				saveSTL( mesh.geometry, cell );
				setTimeout(function(){ //alert was causing inprog...?
					alert('Check out Netfabb for STL repair:\n\nhttps://netfabb.azurewebsites.net/');
				}, 500);
				
			}
		},
/*		{ 
			id: 'Duplicate', 
			name: 'Duplicate',
			action: function(cell) {
				$rootScope.duplicate_cell(cell);
			}
		},*/
/*		{ 
			id: 'Delete', 
			name: 'Delete',
			action: function(cell) {
				$rootScope.delete_cell(cell);
			}
		},
		{ 
			id: 'Close', 
			name: 'Close',
			action: function(cell) {
				$rootScope.close(cell.id);
			}
		}	*/	
	];
};


 function stringifyVector(vec){
  return ""+vec.x+" "+vec.y+" "+vec.z;
}

function stringifyVertex(vec){
  return "vertex "+vec.x+" "+vec.y+" "+vec.z+" \n";
}

function generateSTL(geometry, cell){
  var vertices = geometry.vertices;
  var tris     = geometry.faces; 
  var stl = ("solid pixel");
  for(var i = 0; i<tris.length; i++){
    stl += ("facet normal "+stringifyVector( tris[i].normal )+" \n");
    stl += ("outer loop \n");
    stl += stringifyVertex( vertices[ tris[i].a ]);
    stl += stringifyVertex( vertices[ tris[i].b ]);
    stl += stringifyVertex( vertices[ tris[i].c ]);
    stl += ("endloop \n");
    stl += ("endfacet \n");
  }
  stl += ("endsolid");
  stl += ("2014 Copyright, Honeycomb3d, Inc.")
  stl += ("generated at"+cell.updated_at)
  stl += ("author: pending")  ///create some sort of encrypter
  return stl
}
 
function saveSTL( geometry, cell ){  
  var stlString = generateSTL( geometry, cell );
  var blob = new Blob([stlString], {type: 'text/plain'}); 
  saveAs(blob, cell.name+'.stl'); // Use FileSaver.js 'saveAs' function to save the string
}

EditorTaskbarController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location'];
app.controller('EditorTaskbarController', EditorTaskbarController);