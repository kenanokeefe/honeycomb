RootController = function($scope, $rootScope, $http, $routeParams, $location, Element, Sketch, Plane, Projector, Tween, Extrude, Folder, Dimension) {

	$rootScope.cells = [];
	$scope.maker = localStorage.maker;
	//BUG - if switch users, doesn't refresh cells

	$rootScope.newLog = function(maker, action, cell) {
		$http.post('/logs.json', {maker: maker, action_name: action, cell: cell}).success(function(data){
			//console.log(data)
		});	
	}

	function firfox_alert() {
		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
		{
			setTimeout(function(){
				alert('For best testing preformance, please use the Chrome browser:\n\nhttps://www.google.com/chrome');
			}, 1000);
		}
	}

	$rootScope.load_cells = function(cellId, load_cell) {
		$http.get('/cells.json', {params: {email: $scope.maker}}).success(function(data){
			$rootScope.cells = data;
			if($rootScope.cells.length === 0) {
				$rootScope.new_cell_link();	
				setTimeout(function(){$rootScope.help = true;}, 1000);
				firfox_alert();
			}
			if(load_cell == true) {
				$rootScope.cell = null;
				for(var i=0; i<$rootScope.cells.length; i++) {
					if($rootScope.cells[i].id == cellId) {
						$rootScope.cell =  $rootScope.cells[i];
						$rootScope.cell.data = JSON.parse($rootScope.cell.data);
						$rootScope.cellItems = $rootScope.cell.data[0].items;
					}
				}
				if(!$rootScope.cell && !$scope.maker.admin) { // 
					document.location.href = '/'; //cheap cancan, can't url inject to view other cells
				}
			}
		});
	}

	$rootScope.save_cell = function(model) {
		$http.put('/cells/'+(model.id), {name: model.name, dataString: angular.toJson(model.data), opened: model.opened}).success(function(){
			//$rootScope.load_cells($routeParams.cellId, true);
			$rootScope.newLog($scope.maker, 'saved', model.id+' / '+model.name+' / '+model.maker);
		});
	}

	$rootScope.open = function(cellId) {
		for(var i=0; i<$rootScope.cells.length; i++) {
			if($rootScope.cells[i].id == cellId) {
				var model = $rootScope.cells[i];
				model.opened = true;
				$http.put('/cells/'+cellId, {name: model.name, dataString: model.data, opened: model.opened}).success(function(){
					//console.log('opened cell');
					$location.url('/cells/'+cellId)
				});
				//$rootScope.save_cell($rootScope.cells[i]);
				//causes extra '/' in data json string, might be b/c it doesn't http put cuz nothing is new and it still loads and parses cell
			}
		}
	}

	$rootScope.close = function(cellId) {
		for(var i=0; i<$rootScope.cells.length; i++) {
			if($rootScope.cells[i].id == cellId) {
				var model = $rootScope.cells[i];
				model.opened = false;
				//console.log(model)
				//$location.url('/home');
				$http.put('/cells/'+model.id, {name: model.name, dataString: model.data, opened: model.opened}).success(function(){
					//console.log('closed cell');
				});
				//TODO: is a json parse error here
			}
		}
		
	}

	$rootScope.home_link = function() {
		$location.url('/home');
	}

	$rootScope.new_cell_link = function() {
		var nextName = $rootScope.next_name($rootScope.cells, 'Untitled Cell ');
		$http.post('/cells.json', {name: nextName, data: JSON.stringify($rootScope.initData), opened: true, maker:$scope.maker}).success(function(data){
  			$location.url('/cells/'+data.id)
  			$rootScope.open(data.id)
  			//console.log($scope.maker)
  			$rootScope.newLog($scope.maker, 'created', data.id+' / '+data.name+' / '+data.maker);
		});
	}

	$rootScope.open_cell_link = function(cellId) {
		$rootScope.open(cellId)
	}

	$rootScope.duplicate_cell = function(cell) {
		$http.post('/cells.json', {name: cell.name+' - Copy', data: JSON.stringify(cell.data)}).success(function(data){
  			$location.url('/cells/'+data.id)
  			$rootScope.open(data.id)
  			//highlight cell name for them to edit
		});
	}

	$rootScope.delete_cell = function(cell) {
		$rootScope.newLog($scope.maker, 'deleted', cell.id+' / '+cell.name+' / '+cell.maker);
		$rootScope.close(cell.id)
		$http.delete('/cells/'+cell.id).success(function(){
			$rootScope.load_cells($routeParams.cellId, false);
		});
	}

	$rootScope.next_name = function(searchArray, string) {
		var nameArray = [0];
		for (var i=0; i<searchArray.length; i++){
			var name = searchArray[i].name;
			if(name.substring(0, string.length) == string){
				nameArray.push(parseInt(name.substring(string.length, name.length)));
			}
		}
		nameArray.sort(function(a, b){return b-a});
		return string+(nameArray[0]+1).toString();	
	}

	$rootScope.next_index = function() {
		var indexArray = [0];
		for (var i=0; i<$rootScope.cellItems.length; i++){
			indexArray.push($rootScope.cellItems[i].index);
		}
		indexArray.sort(function(a, b){return b-a});
		return indexArray[0]+1;	
	}

	$rootScope.hide_snap = function($event) { //used to remove snap when exiting scene
		if($event.target.localName != "canvas") {
			$("#SnappedCursor").remove();
		}
	}

	$rootScope.no_spaces = function(string) {
		return string.replace(/\s/g, '');
	}

	$rootScope.update_tree = function(cell) { //console.log(cell)
		var items = cell.data[0].items;
		for (var i=0; i<items.length; i++){
			var item = items[i];
			eval(item.class).update(item);
		}		
	}

	$rootScope.update_sketch = function(sketch) { //console.log(cell)
		var dims = sketch.dimensions;
		for (var i=0; i<dims.length; i++){
			var dim = dims[i];
			Dimension[dim.class].update(dim);
		}	
		var elements = sketch.elements;
		for (var i=0; i<elements.length; i++){
			var element = elements[i];
			Element[element.class].update(element);
		}		
	}

	/////  Item Functions /////// -----ORG: put in Item service
	$rootScope.getItemByName = function(name) {
		var items = $rootScope.cell.data[0].items;
		for (var i=0; i<items.length; i++){
			var item = items[i];
			if(item.name == name) {
				return item;
			}
		}
	}

	$rootScope.getItemsByClass = function(itemClass) {
		var array = [];
		var items = $rootScope.cell.data[0].items;
		for (var i=0; i<items.length; i++){
			var item = items[i]; 
			if(item.class == itemClass) { 
				array.push(item);
			}
		} 
		return array;
	}

	$rootScope.getOptionById = function(name) {
		for (var i=0; i<items.length; i++){
			var item = items[i];
			if(item.name == name) {
				return item;
			}
		}
	}

	$rootScope.last_item = function() {
		return $rootScope.cellItems[$rootScope.cellItems.length-1];
	}


	//remember if references and history tabs are opened or not
	//do ng-repeat of ref and history panels
	$rootScope.initData = [
		{
			opened: true,
			name: 'Cell Name',
			items: [
				{
					state: 'opened',
					class: 'Folder',
					name: 'Origin',
					index: 0,
					options: [],
					children: ['XY Plane','XZ Plane','YZ Plane'],
					parent: null
				},
				{
					state: 'closed',
					class: 'Plane',
					name: 'XY Plane',
					index: 1,
					options: [
						{id: 'rX', type: 'number', val: 0},
						{id: 'rY', type: 'number', val: 0},
						{id: 'rZ', type: 'number', val: 0},
						{id: 'tX', type: 'number', val: 0},
						{id: 'tY', type: 'number', val: 0},
						{id: 'tZ', type: 'number', val: 0}
					],
					children: [],
					parent: 'Origin'
				},
				{
					state: 'closed',
					class: 'Plane',
					name: 'XZ Plane',
					index: 2,
					options: [
						{id: 'rX', type: 'number', val: -90},
						{id: 'rY', type: 'number', val: 0},
						{id: 'rZ', type: 'number', val: 0},
						{id: 'tX', type: 'number', val: 0},
						{id: 'tY', type: 'number', val: 0},
						{id: 'tZ', type: 'number', val: 0}
					],
					children: [],
					parent: 'Origin'
				},
				{
					state: 'closed',
					class: 'Plane',
					name: 'YZ Plane',
					index: 3,
					options: [
						{id: 'rX', type: 'number', val: 0},
						{id: 'rY', type: 'number', val: 90},
						{id: 'rZ', type: 'number', val: 0},
						{id: 'tX', type: 'number', val: 0},
						{id: 'tY', type: 'number', val: 0},
						{id: 'tZ', type: 'number', val: 0}
					],
					children: [],
					parent: 'Origin'
				},
/*				{
					state: 'closed',
					class: 'Folder',
					name: 'Bodies',
					index: 4,
					options: [],
					children: [],
					parent: ''
				},		*/			
			]
		}
	]

};

RootController.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'Element', 'Sketch', 'Plane', 'Projector', 'Tween', 'Extrude', 'Folder', 'Dimension'];
app.controller('RootController', RootController);