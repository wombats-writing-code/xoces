'use strict';

module.exports = function() {

	return {
		restrict: 'E',
		scope: {
			chosenData: '=',
		},
		templateUrl: 'loadingCurtain.html',
		link: function(scope, element, attrs, controller) {
		}
	}

}
