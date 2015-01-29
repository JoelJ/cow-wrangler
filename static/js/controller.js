angular.module('cow-wrangler', [])
	.controller('MainController', ['$scope', '$http', function($scope, $http) {
		$scope.pathStack = [];
		$scope.path = '';

		$scope.ephemeral = false;
		$scope.sequence = false;
		$scope.createContent = '';

		$scope.pushPathItem = function(newItem) {
			$scope.pathStack.push(newItem);
			$scope.path = '';
			displayPath($scope.pathStack);
		};

		$scope.pushPathItemKeyPress = function(newItem, event) {
			if(event.which === 13) {
				newItem = newItem.replace(/[/]+/g, '/');
				if(newItem.indexOf('/') == 0) {
					newItem = newItem.substring(1);
				}
				if(newItem.lastIndexOf('/') == newItem.length-1) {
					newItem = newItem.substring(0, newItem.length-1);
				}

				if(newItem != '' && newItem != '/') {
					$scope.pathStack = $scope.pathStack.concat(newItem.split('/'));
					$scope.path = '';
					displayPath($scope.pathStack);
				}
			}

		};

		$scope.clearPath = function() {
			$scope.pathStack = [];
			displayPath($scope.pathStack);
		};

		$scope.trimPathTo = function(newSize) {
			$scope.pathStack = $scope.pathStack.slice(0, newSize+1);
			displayPath($scope.pathStack);
		};

		$scope.createPath = function(pathToCreate, ephemeral, sequence, content) {
			$http({
				method: 'POST',
				url: '/api/path/new',
				data: $.param({
					path: pathToCreate,
					ephemeral: ephemeral,
					sequence: sequence,
					content: content
				}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(path) {
					//var newPathStack = $scope.pathStack.slice(0, $scope.pathStack.length - 1);
					//newPathStack.push(path);
					//$scope.pathStack = newPathStack;

				if(path.indexOf('/') == 0) {
					path = path.substring(1);
				}
				$scope.pathStack = path.split('/');

				displayPath($scope.pathStack);
			});
		};

		$scope.deletePath = function(pathToDelete) {
			if(confirm('Delete ' + pathToDelete + '?')) {
				$http.delete('/api/path?path='+pathToDelete)
					.success(function() {
						$scope.pathStack = $scope.pathStack.slice(0, $scope.pathStack.length - 1);
						displayPath($scope.pathStack);
					});
			}
		};

		function displayPath(pathStack) {
			var path = '';
			for(var i = 0; i < pathStack.length; i++) {
				path = path + '/' + pathStack[i];
			}

			if(path === '') {
				path = '/';
			}

			$http.get('/api/path?path=' + path)
				.success(function(result) {
					for(var key in result) {
						if (result.hasOwnProperty(key)) {
							var node = result[key];
							node['exists'] = true;
							if (node['data']) {
								try {
									var parsed = JSON.parse(node['data']);
									node['data'] = JSON.stringify(parsed, null, 2);
								} catch (ignore) {
									//	ignore
								}
							}
						}
					}

					$scope.paths = result;
				})
				.error(function(error) {
					$scope.paths = {};
					$scope.paths[path] = {
						exists: false
					}
				});
		}
		displayPath($scope.pathStack);
	}]);