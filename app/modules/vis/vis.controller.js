'use strict';

module.exports = function ($scope, $window, $timeout, VisParams, ChordMaster, TreeMaster) {

	var svg, chordVis, treeVis;

	var lastVisType = 'CHORD';
	var lastData = '';

	this.update = function(data, el) {
		if (data) {
			// select the svg el and enforce its size
			var svgWidth = angular.element('.vis').width();
			var svgHeight = Math.max(VisParams.canvas.height, angular.element('.info-panel').height());

			svg = d3.select('.vis')
				.attr('width', svgWidth)                                                  
				.attr('height', svgHeight);

			chordVis = svg.select('.chord-vis');    
			treeVis = svg.select('.tree-vis');    

			// make sure the mouse doesn't interfere with animations
			svg.attr('pointer-events', 'none');
                        $timeout( function() {
				var svgHeight = Math.max(VisParams.canvas.height, angular.element('.info-panel').height() + 100);
                                svg.attr('pointer-events', 'all')
				.attr('height', svgHeight);
                        }, 1000);

			if (lastData != data.dataName) {
				chordVis.selectAll('use, path, text').remove();
				treeVis.selectAll('g, line, use, foreignObject').remove();

			} else if (lastVisType != data.visType) {
				if (lastVisType == 'CHORD') {
					chordVis.selectAll('use, path, text').remove();
				} else {
					treeVis.selectAll('g, line, use, foreignObject').remove();
				}
			}

			lastVisType = data.visType;
			if (data.visType == 'CHORD') {
				ChordMaster.draw(data, chordVis);

			} else if (data.visType == 'TREE') {
				TreeMaster.draw(data, treeVis);
			}

		}

	}
}
