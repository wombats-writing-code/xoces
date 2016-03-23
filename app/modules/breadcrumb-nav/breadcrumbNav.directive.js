'use strict';

module.exports = function() {
	return {
		restrict: 'E',
		templateUrl: 'breadcrumbNav.html',
		scope: {
			'showTree': '&',
			'breadcrumbs': '=',
			'clickBreadcrumb': '&'
		},
		link: function(scope, element, attrs, controller, transclude) {
		}
	}
}
