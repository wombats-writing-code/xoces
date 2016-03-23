'use strict';

module.exports = function(Events, Params, Mathy) {

	return {
		render: function(data, treeVis) {
			var linkData = data.links,
				nodeData = data.nodes.reverse();

			var linkGroup = treeVis.selectAll('.tree-link-group')
				.data(linkData);

			linkGroup.enter()
				.append('g')
				.attr('class', 'tree-link-group')

			var link = linkGroup
				.append('line')
				.attr('class', 'tree-link__link')
				.attr('fill', 'none')
				.attr('stroke', Params.link.stroke.default)
				.attr('stroke-dasharray', function(d,i) {
					if (d.isGhost) {
						return Params.link.strokeDashArray;
					}
				})
				.attr('stroke-width', Params.link.strokeWidth)
				.attr('opacity', Params.link.opacity.default)
				.attr("x1", function(d) { return d.sourceShifted.x; })
				.attr("y1", function(d) { return d.sourceShifted.y; })
				.attr("x2", function(d) { return d.targetShifted.x; })
				.attr("y2", function(d) { return d.targetShifted.y; });

			var linkArrow = linkGroup
                                .append('svg:use')
                                .attr('class', 'tree-link__arrow')
                                .attr('xlink:href', '#tree-arrow--default')
				.style('fill', '#888' )
                                .attr('x', function(d) { 
					d.arrow_x = ((d.sourceShifted.x + d.targetShifted.x) / 2) * 1;
					if (d.isGhost) {
						d.arrow_x = d.targetShifted.x;
					}
                                        return d.arrow_x;
                                })
                                .attr('y', function(d) {  
					d.arrow_y = ((d.sourceShifted.y + d.targetShifted.y) / 2) * 1;
					if (d.isGhost) {
						d.arrow_y = d.targetShifted.y;
					}
                                        return d.arrow_y;
                                })                                                                                   
				.attr('opacity', 0.8)
                                .attr('transform', function(d) {
					var angleWithHorizon = Math.atan( (d.targetShifted.x - d.sourceShifted.x) / Math.abs(d.targetShifted.y - d.sourceShifted.y) );
					var rotationAngle = Mathy.rad2deg(angleWithHorizon) + 180;
					var rotationAngle = -Mathy.rad2deg(angleWithHorizon) - 180;
					if (d.isGhost) {
						rotationAngle = Mathy.rad2deg(angleWithHorizon) + 180;
					}

                                        return 'translate(' + 0 + ',' + 0 + ')' + ' rotate(' + -rotationAngle + ',' + d.arrow_x + ',' + d.arrow_y + ')';
                                });


			var node = treeVis.selectAll('.tree-node')
			.data(nodeData);

			// Enter the nodes.
			var nodeEnter = node.enter()
				.append('g')
				.attr('class', 'tree-node')
				.on( 'mouseover', Events.mouseoverHandler)
				.on( 'mouseout', Events.mouseoutHandler);

			var nodeTitle = nodeEnter.append("foreignObject")
				.attr('class', 'foreignObject')
				.attr('x', function(d) { return d.x - d.width/2})
				.attr('y', function(d) { return d.y; })
				.attr("width", function(d) { return d.width })
				.attr("height", function(d) { return d.width });

			nodeTitle
				.append("xhtml:p")
				.attr('class', "tree-vis__text tree-vis__text-title")
				.style('color', '#343434')
				.text(function(d) { return d.label.title; });

			var nodeDescription = nodeEnter.append("foreignObject")
				.attr('class', 'foreignObject')
				.attr('x', function(d,i) { return d.label.description.x })
				.attr('y', function(d,i) { return d.label.description.y })
				.attr("width", function(d) { return 3*d.width })
				.attr("height", function(d) { return d.width })
				.append("xhtml:p")
				.attr('class', "tree-vis__text tree-vis__text-description")
				.style('opacity', 0)
				.text(function(d) { return d.label.description.text; });
		}
	}
}
