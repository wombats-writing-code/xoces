'use strict';

module.exports = function(ModelParams) {

		function Model(data) {
			if (data) {
				var modelType = _.find(ModelParams, function(modelType) {
					return modelType.name == data.modelTypeName; 
				});
				this.id = data.id;
				this.displayName = data.displayName;
				this.description = data.description;
				this.modelType = data.modelType || modelType;
			}
		}

		Model.prototype.getParentsOfType = function(modelType) {
			switch(modelType) {
				case ModelParams.COURSE:
					return this.courses;
					break;
				case ModelParams.SUBJECT:
					return this.subjects;
					break;
				default:
					try {
						throw {
							error: 'Model.prototype.getParentsOfType()',
							message: modelType.name + ' modelType is not a parent'
						}
					} catch (e) {
						console.error(e);
					}
					break;
			}
		}

		Model.prototype.getDisplayName = function() {
			switch(this.modelType) {
				case ModelParams.COURSE:
					return 'Course ' + this.displayName;
					break;
				case ModelParams.SUBJECT:
					return this.displayName;
					break;

				case ModelParams.OUTCOME:
					return this.displayName;
					break;
			}
		}

		Model.prototype.getShortName = function() {
			switch(this.modelType) {
				case ModelParams.COURSE:
					return this.displayName;
					break;

				case ModelParams.SUBJECT:
					return this.displayName.substring(this.displayName.indexOf(' ')+1);
					//return this.displayName.split(' ')[0];
					break;

				case ModelParams.MODULE:
					return this.displayName;
					break;

				case ModelParams.OUTCOME:
					if (this.displayName.indexOf('[M') == 0) {
//						return this.displayName.split(' ')[0].split('-')[1].substring(1,3);
						return this.displayName.split(' ')[0];
					}
					return this.displayName.substring(0,5) + '...';
					break;
			}
		}

		Model.prototype.getDisplayNameDetailed = function() {
			switch(this.modelType) {
				case ModelParams.COURSE:
					return 'Course ' + this.displayName + ' (' + this.description + ')';
					break;
				case ModelParams.OUTCOME:
					var subjectNumber = this.subjects && this.subjects.length > 0 ? this.subjects[0].displayName.split(' ')[0] : '';
					return '(' + subjectNumber + ') ' + this.displayName;
					break;
			}
		}

		Model.prototype.getRequisitesOnce = function() {
			return this.requisites;
		}

		Model.prototype.withinSameSubject = function(outcome) {
			var self = this;
			return _.some( self.subjects, function(subject) {
				return outcome.subjects.indexOf(subject) > -1;
			});
		}

		Model.prototype.withinSameModule = function(outcome) {
			var self = this;
			return _.some( self.modules, function(m) {
				return outcome.modules.indexOf(m) > -1;
			});
		}

		Model.prototype.getRequisitesFromExternalOfType = function(modelType) {
			var filtered = [];
			switch(modelType) {
				case ModelParams.COURSE:
					for (var i=this.requisites.length; i--;) {
//						console.log(this, this.requisites[i]);	
						for (var j=this.requisites[i].courses.length; j--;) {
							var reqCourse = this.requisites[i].courses[j];
							var isInSameCourse = _.contains( this.courses, reqCourse );
							if (!isInSameCourse) {
								filtered.push(this.requisites[i]);
								break;
							}
						}
					}
					break;
				case ModelParams.SUBJECT:
					for (var i=this.requisites.length; i--;) {
						for (var j=this.requisites[i].subjects.length; j--;) {
							var reqSubject = this.requisites[i].subjects[j];

							var isInSameSubject = _.contains( this.subjects, reqSubject );
							if (!isInSameSubject) {
								filtered.push(this.requisites[i]);
								break;
							}
						}
					}
					break;
				case ModelParams.OUTCOME:
					return this.requisites;
					break;
				default: 
					throw {
						name: 'Model.getRequisitesFromExternalOfType()',
						error: 'invalid modelType of ' + modelType.name + ' specified'
					}
					break;
			}
			return filtered;
		};

		Model.prototype.getDependentsFromExternalOfType = function(modelType) {
			var filtered = [];
			switch(modelType) {
				case ModelParams.COURSE:
					for (var i=this.dependents.length; i--;) {
						for (var j=this.dependents[i].courses.length; j--;) {
							var model = this.dependents[i].courses[j];

							var isInSameCourse = _.contains( this.courses, model );
							if (!isInSameCourse) {
								filtered.push(this.dependents[i]);
								break;
							}
						}
					}
					break;
				case ModelParams.SUBJECT:
					for (var i=this.dependents.length; i--;) {
						for (var j=this.dependents[i].subjects.length; j--;) {
							var model = this.dependents[i].subjects[j];

							var isInSameSubject = _.contains( this.subjects, model );
							if (!isInSameSubject) {
								filtered.push(this.dependents[i]);
								break;
							}
						}
					}
					break;
				case ModelParams.OUTCOME:
					return this.dependents;
					break;
				default: 
					throw {
						name: 'Model.getDependentsFromExternalOfType()',
						error: 'invalid modelType of ' + modelType.name + ' specified'
					}
					break;
			}
			return filtered;
		};

		// ========
	return {
		create: function(data) {
			var newModel = new Model(data);
			return newModel;
		}
	}
}
