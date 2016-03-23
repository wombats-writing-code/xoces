'use strict';

module.exports = function($timeout) {

	return {
		restrict: 'E',
		scope: {
			viewData: '=',
		},
		templateUrl: 'infoPanel.html',
		controller: 'infoPanelController',
		link: function(scope, element, attrs, controller) {
			
			scope.$watch( 'viewData', function(val) {
				controller.update(val, element);
			}, true);
		}
	}

}
