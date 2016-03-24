'use strict';

module.exports = function($http, $q, DataParams) {

	// fill in your mc3 endpoints here
	var endpoints = {
		'eXample': {
			objective: '',
			relationship: '',
		},
	};

	var types = {
		COURSE: 'mc3-objective%3Amc3.learning.department%40MIT-OEIT',
		SUBJECT: 'mc3-objective%3Amc3.learning.subject%40MIT-OEIT',
		MODULE: 'mc3-objective%3Amc3.learning.topic%40MIT-OEIT',
		OUTCOME: 'mc3-objective%3Amc3.learning.outcome%40MIT-OEIT',
		relationships_parent_child: 'mc3-relationship:mc3.lo.2.lo.parent.child@MIT-OEIT',
		relationships_requisite: 'mc3-relationship:mc3.lo.2.lo.requisite@MIT-OEIT',
	};

	var unpack = function(item) {
		var modelTypeName = _.findKey(types, function(val) {
			return val == item.genusTypeId
		});

		return {
			id: item.id,
			modelTypeName: modelTypeName,
			displayName: item.displayName.text,
			description: item.description.text,
		}
	}

	return {
		getObjectives: function(bankName) {
			return $http.get( endpoints[bankName].objective )
			.then( function(res) {
				return res.data.map(unpack);
			});
		},

		getRelationships: function(bankName) {
			return $http.get( endpoints[bankName].relationship)
			.then( function(res) {
				return res.data.map(unpack);
			});
		},

		getParentChilds: function(bankName) {
			return $http.get( endpoints[bankName].relationship + '?genustypeid=' + types.relationships_parent_child)
			.then( function(res) {
				return res.data;
			});
		},

		getRequisites: function(bankName) {
			return $http.get( endpoints[bankName].relationship + '?genustypeid=' + types.relationships_requisite)
			.then( function(res) {
				return res.data;
			});
		}

	}

}
