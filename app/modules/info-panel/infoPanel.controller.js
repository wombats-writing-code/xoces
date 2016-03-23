'use strict';

module.exports = function ($rootScope, $scope, ModelCollection) {

	var allModels;
	$scope.showCurrentChildren = true;

	this.update = function(viewSpec) {
		if (viewSpec) {
			allModels = ModelCollection.getModelsAll();
			$scope.currentModel = _.findWhere(allModels, {'id': viewSpec.modelId});

			if (!$scope.currentModel) {
				$scope.currentModel = ModelCollection.getRoot();
			}
			$scope.currentModel.children = ModelCollection.getChildren($scope.currentModel)
				.filter( function(child) {
					var gc = ModelCollection.getChildren(child);
					return (gc && gc.length > 0);
				}) || [];
//			console.log(viewSpec.levelName, $scope.currentModel);
		} 
	}

	$scope.getChildren = function(model) {
		return ModelCollection.getChildren(model);
	}

	$scope.getOutcomesOf = function(model) {
		return ModelCollection.getOutcomesOf(model);
	}


	var id_requisites_dict = {};
	$scope.getRequisitesOfType = function(model, optArg) {
		if (model) {
			if (!id_requisites_dict[model.id]) {	
				id_requisites_dict[model.id] = ModelCollection.getRequisitesOfSameType(model).typeModels;
			}
			return id_requisites_dict[model.id];
		} 
		return [];
	}

	$scope.toggleModelDrawn = function(model) {
		// we toggle the model's own properties here, and broadcast an event
		model.isDrawn = !model.isDrawn;	
		$rootScope.$broadcast('toggledModel', model);
	}

}
