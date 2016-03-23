'use strict';

module.exports = function($window) {

        return {
                link: function(scope, element, attrs, controller) {

			scope.isVisShown = true;

                        var isMinWidth = function() {
                                var minWidth = 980;
                                return $window.innerWidth > minWidth || $window.clientWidth > minWidth;
                        }

			if (isMinWidth()) {
//				console.log('window size ok');
			} else {
//				console.log('window size too small');
				scope.isVisShown = false;
			}
		}
	}
}

