'use strict';

module.exports = function (ModelParams) {

	var bankName, outcomes, modules, subjects, courses;

	// functions to get the children for each model type -- differs for each data set
	var getChildrenFns = {
		'eXample': function(argModel) {
			switch (argModel.modelType) {
			case ModelParams.ROOT:
				return courses;
				break;
			case ModelParams.COURSE:
				return subjects.filter( function(model) {
					return model.courses.indexOf(argModel) > -1;
				});
				break;
			case ModelParams.SUBJECT:
				return modules.filter( function(model) {
					return model.subjects.indexOf(argModel) > -1;
				});
				break;
			case ModelParams.MODULE:
				return outcomes.filter( function(model) {
					return model.modules.indexOf(argModel) > -1;
				});
				break;
			case ModelParams.OUTCOME:
				return [argModel];
				break;
			default:
				return [argModel];
				break;
			}
		},		
	};		

	// functions to get the parents for each model type -- different for each data set
	var getParentsFns = {
		'eXample': function(model) {
			switch(model.modelType) {
				case ModelParams.COURSE:
					return [ModelParams.ROOT];
					break;
				case ModelParams.SUBJECT:
					return model.courses;
					break;
				case ModelParams.MODULE:
					return model.subjects;
					break;
				case ModelParams.OUTCOME:
					return model.modules;
					break;
			}
		},
	};

	// functions to get the outcomes for a given model, for each data set
	var getOutcomesOfFns = {
		'eXample': function(argModel) {
			var results = [];
			switch (argModel.modelType) {
				case ModelParams.ROOT:
					results = outcomes;
					break;
				case ModelParams.COURSE:
					var ownSubjects = getChildrenFns[bankName](argModel);
					var ownModules = _.uniq(_.flatten(_.map( ownSubjects, function(m) {
						return getChildrenFns[bankName](m);
					})));
					var ownOutcomes = _.uniq(_.flatten(_.map( ownModules, function(m) {
						return getChildrenFns[bankName](m);
					})));
					results = ownOutcomes;
					break;

				case ModelParams.SUBJECT:
					var ownModules = getChildrenFns[bankName](argModel);
					var ownOutcomes = _.uniq(_.flatten(_.map( ownModules, function(m) {
						return getChildrenFns[bankName](m);
					})));
					results = ownOutcomes;
					break;
				case ModelParams.MODULE:
					results = getChildrenFns[bankName](argModel);
					break;
				case ModelParams.OUTCOME:
					results = [argModel];
					break;
			}

			return results;
		},
	};

	// functions to get the requisites of the given model, of the same type
	var getRequisitesOfSameTypeFns = {
		'eXample': function (argModel) {
			var results = {};

			switch(argModel.modelType) {	
				case ModelParams.COURSE:
					var ownOutcomes = getOutcomesOfFns[bankName](argModel);
					var requisites = _.uniq(_.flatten( _.pluck(ownOutcomes, 'requisites')));
					var requisiteCourses = _.uniq(_.flatten( _.pluck(requisites, 'courses')))
					.filter( function(s) {
						return s.id != argModel.id;
					});

					results.typeModels = requisiteCourses;
					results.outcomeModels = requisites;

					break;

				// return the first level of subject prerequisites
				case ModelParams.SUBJECT:
					var ownOutcomes = getOutcomesOfFns[bankName](argModel);
					var requisites = _.uniq(_.flatten( _.pluck(ownOutcomes, 'requisites')));
					var requisiteSubjects = _.uniq(_.flatten( _.pluck(requisites, 'subjects')))
					.filter( function(s) {
						return s.id != argModel.id;
					});

					results.typeModels = requisiteSubjects;
					results.outcomeModels = requisites;

					break;

				case ModelParams.MODULE:
					var ownOutcomes = getChildrenFns[bankName](argModel);
					var requisites = _.uniq(_.flatten( _.pluck(ownOutcomes, 'requisites')));
					var requisiteModules = _.uniq(_.flatten( _.pluck(requisites, 'modules')))
					.filter( function(s) {
						return s.id != argModel.id;
					});

					results.typeModels = requisiteModules;
					results.outcomeModels = requisites;

					break;

				// return the entire chain of outcome prereqs
				case ModelParams.OUTCOME:
					results.typeModels = argModel.requisites;
					results.outcomeModels = argModel.requisites;
					break;
			}	
			return results;
		},
	};

	return {
		init: function(bN, o, m, s, c) {
			bankName = bN; 
			outcomes = o; 
			modules = m; 
			subjects = s; 
			courses = c; 
		},
		getChildren: function() {
			return getChildrenFns[bankName];
		},
		getParents: function() {
			return getParentsFns[bankName];
		},
		getRequisitesOfSameType: function() {
			return getRequisitesOfSameTypeFns[bankName];
		},
		getOutcomesOf: function() {
			return getOutcomesOfFns[bankName];
		},
	}

}
