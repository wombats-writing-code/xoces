'use strict';

module.exports = function xploreController($rootScope, $scope, $timeout, ModelCollection) {

	$scope.isLoading = true;
	$scope.viewHistory = [];

	// ===== initialization
	var init = function(dataName) {
		$scope.isLoading = true;
		ModelCollection.getModels(dataName)
		.then( function() {
			$scope.isLoading = false;

			var outcomes = ModelCollection.getOutcomes();
			var courses = ModelCollection.getUniqueCourses();
			var subjects = ModelCollection.getUniqueSubjects();

			// we make a dummy ROOT object here
			$scope.viewSpec = {
				dataName: dataName,
				levelName: 'ROOT',
				modelId: 'ALL',
				modelName: dataName,
				visType: 'CHORD'
			};

			// log for sanity check
			// console.log(dataName + ': ' + outcomes.length + ' outcomes. ' + courses.length + ' courses. ' + subjects.length + ' subjects.');

			// for breadcrumb navigation
			$scope.viewHistory.push($scope.viewSpec);	
			$scope.saveCanvas = false;
		});
	}

	$scope.chosenData = {};
	$scope.chosenData.name = 'eXample';

	init($scope.chosenData.name);

	$scope.drawLevel = function(level) {
		var index = _.findIndex($scope.viewHistory, level);
		$scope.viewHistory.splice(index+1);
		$scope.viewSpec = level;
	}

	// this logic needs to be refactored
	// this controls the button that says 'Tree'. every data set is going to have a different 'bottom level'
	$scope.showTreeView = function() {
		if ($scope.viewSpec) {
			switch($scope.chosenData.name) {
				case 'eXample':
					return $scope.viewSpec.levelName == 'MODULE';
					break;
			}
		}
	}
	// ---

	$scope.$on('selectedModel', function(event, data) {
		$scope.viewSpec = {
			dataName: $scope.chosenData.name,
			levelName: data.model.modelType.name,
			modelId: data.model.id,
			modelName: data.model.displayName,
			visType: 'CHORD'
		};	
		$scope.viewHistory.push($scope.viewSpec);
		$scope.$apply();
	});

	$scope.$on('mouseoveredModel', function(event, data) {
		$scope.mouseoverSpec = {
			levelName: data.model.modelType.name,
			modelId: data.model.id
		};	
		$scope.$apply();
	});

	$scope.$on('mouseoutModel', function(event, data) {
		$scope.mouseoverSpec = {
			levelName: '',
			modelId: ''
		};	
	});

	// broadcasted from infoPanel
	$scope.$on('toggledModel', function(event, data) {
		$scope.viewSpec.changed = !$scope.viewSpec.changed;
	});

	// broadcasted from chooseData
	// load chosen data set and rerun vis
	$scope.$on('switchedData', function(event, data) {
		if ($scope.chosenData.name != data) {
			$scope.chosenData.name = data;
			$scope.viewHistory = [];
			init($scope.chosenData.name);
		}
	});


}
