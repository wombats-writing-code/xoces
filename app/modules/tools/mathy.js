'use strict';

module.exports = function() {
	return {
		log: function(x, optBase) {
			if (optBase) {
				return Math.log(optBase) / Math.log(x);
			}
			return Math.log(x);
		},
		random: function(min, max) {
			return Math.random()*(max-min)+min;
		},
		deg2rad: function(angle) {
			return angle * (Math.PI)/180;
		},
		rad2deg: function(angle) {
			return angle * 180/(Math.PI);
		}
	}


}
