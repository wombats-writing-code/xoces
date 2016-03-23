'use strict';

module.exports = function ($q, ModelParams, Model, Proxy, ss) {

	var models, courses, subjects, modules, outcomes, root, parentChildRels, requisiteRels; 
	var getDataAsync = function(bankName) {
		return $q.all([
			Proxy.getObjectives(bankName),
			Proxy.getParentChilds(bankName), Proxy.getRequisites(bankName),
		])
		.then( function(res) {
			return res;
		});
	};

	// functions to help with building an outcome
	var findTaggedModules = function(outcome) {
		return _.where( parentChildRels, {destinationId: outcome.id})
		.map( function(rel) {
			return _.findWhere(modules, {id: rel.sourceId});
		})
		.filter( function(model) {
			if (model) return model;
		});
	};

	var findTaggedSubjects = function(outcome) {
		return _.where( parentChildRels, {destinationId: outcome.id})
		.map( function(rel) {
			var direct = _.findWhere(subjects, {id: rel.sourceId});
			return direct;
		})
		.filter( function(model) {
			if (model) return model;
		});
	};

	var findInferredSubjects = function(outcome, moduleIds) {
		return _.filter( parentChildRels, function(rel) {
			return moduleIds.indexOf( rel.destinationId ) > -1;
		})
		.map( function(relationship) {
			return _.findWhere(subjects, {id: relationship.sourceId});
		})
		.filter( function(model) {
			if (model) return model;
		});
	}

	var findInferredCourses = function(outcome, subjectIds) {
		return _.uniq( _.filter( parentChildRels, function(rel) {
				return subjectIds.indexOf( rel.destinationId ) > -1;
			})
			.map( function(relationship) {
				return _.findWhere(courses, {id: relationship.sourceId});
			})
			.filter( function(model) {
				if (model) return model;
			})
		);
	}

	var findDependents = function(outcome) {
		return _.where(requisiteRels, {destinationId: outcome.id})
		.map( function(rel) {
			return _.findWhere(outcomes, {id: rel.sourceId});
		});
	}

	var findRequisites = function(outcome) {
		return _.where(requisiteRels, {sourceId: outcome.id})
			.map( function(rel) {
				return _.findWhere(outcomes, {id: rel.destinationId});
			});
	}


	var buildOutcome = function(outcome) {
		outcome.modules = findTaggedModules(outcome); 
		var moduleIds = _.pluck(outcome.modules, 'id');	

		var inferred = findInferredSubjects(outcome, moduleIds);
		outcome.subjects = _.union( findTaggedSubjects(outcome), findInferredSubjects(outcome, moduleIds) );

		var subjectIds = _.pluck(outcome.subjects, 'id');
		outcome.courses = findInferredCourses(outcome, subjectIds);

		outcome.dependents = findDependents(outcome);
		outcome.requisites = findRequisites(outcome);

		return outcome;
	};

	// ========================= //
	var ModelCollection = {};

	// dependent upon the bank
	ModelCollection.getChildren = function(argModel) {
		var getChildrenFn = ss.getChildren();
		return getChildrenFn(argModel);
	}

	ModelCollection.getRequisitesOfSameType = function(argModel) {
		var fn = ss.getRequisitesOfSameType();
		return fn(argModel);
	}

	ModelCollection.getOutcomesOf = function(argModel) {
		var fn = ss.getOutcomesOf();
		return fn(argModel);
	}

	ModelCollection.getParents = function(model) {
		var getParentsFn = ss.getParents();
		return getParentsFn(model);
	}

	ModelCollection.getParentsOfType = function(model, modelType) {
		switch (modelType) {
			case ModelParams.COURSE:
				return model.courses;
				break;
			case ModelParams.SUBJECT:
				return model.subjects;
				break;
			case ModelParams.MODULE:
				return model.modules;
				break;
			case ModelParams.OUTCOME:
				return [model];
				break;
		}	
		
	}

	ModelCollection.getOutcomes = function() {
		return outcomes;
	}

	ModelCollection.getUniqueCourses = function() {
		return _.uniq( _.flatten( _.pluck(outcomes, 'courses') ) );
	}

	ModelCollection.getUniqueSubjects = function() {
		return _.uniq( _.flatten( _.pluck(outcomes, 'subjects') ) );
	}

	ModelCollection.getUniqueModules = function() {
		return _.uniq( _.flatten( _.pluck(outcomes, 'modules') ) );
	}

	ModelCollection.getModelsAll = function() {
		return models;
	}

	ModelCollection.getRoot = function() {
		return root;
	}

	ModelCollection.getModels = function(bankName) {
		return $q.when(false ? null: getDataAsync(bankName) )
		.then( function(res) {
			parentChildRels = res[1], requisiteRels = res[2];

			models = res[0].map(Model.create)
			.map( function(model) {
				model.isDrawn = true;
				return model;
			});

			root = Model.create({
				displayName: bankName,
				modelType: ModelParams.ROOT,
			});

			outcomes = _.where(models, {modelType: ModelParams.OUTCOME});
			modules = _.where(models, {modelType: ModelParams.MODULE});
			subjects = _.where(models, {modelType: ModelParams.SUBJECT}),
			courses = _.where(models, {modelType: ModelParams.COURSE});

			outcomes = outcomes.filter( function(outcome) {
				return outcome.displayName.indexOf('[L') == -1;
			})
			.map(buildOutcome)
			.filter( function(outcome) {
				return outcome.courses && outcome.subjects;
			});

			// --- build out modules ----
			modules = _.map( modules, function(module) {
				module.subjects = _.where( parentChildRels, {destinationId: module.id})
				.map( function(rel) {
					return _.find(subjects, {id: rel.sourceId});
				});
				return module;
			});

			// --- build out subjects ----
			subjects = _.map( subjects, function(subject) {
				subject.courses = _.where( parentChildRels, {destinationId: subject.id})
				.map( function(rel) {
					return _.find(courses, {id: rel.sourceId});
				});
				return subject;
			});

			// store these built variables in the helper library 
			ss.init(bankName, outcomes, modules, subjects, courses);

			return models;
		})
		.catch( function(err) {
			console.log('cannot get data from mc3');
			return err;
		});
	};

	return ModelCollection;

}
