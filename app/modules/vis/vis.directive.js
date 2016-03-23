'use strict';

module.exports = function($window) {

	return {
		restrict: 'E',
		scope: {
			viewData: '=',
		},
		templateUrl: 'vis.html',
		controller: 'visController',
		link: function(scope, element, attrs, controller) {

			scope.$watch( 'viewData', function(val) {
				if (val) {
					controller.update(val, element);
				}
			}, true);
		}
	}

}
