'use strict';

module.exports = function Renderer(Mathy, Params, Events, Animation) {

	return {
		drawArcs: function(arcData, chordVis) {
			var arc = d3.svg.arc()
				.innerRadius(Params.vis.innerRadius)
				.outerRadius(Params.vis.outerRadius);

			var chord = d3.svg.chord()
				.radius(Params.vis.outerRadius);

			var diagonal = d3.svg.diagonal();
			var arcClassName = arcData[0].className;			
			var arcGroup;

			if (arcClassName == 'sub-arc') {
				arcGroup = chordVis.select('.sub-arcs-container').selectAll('path.' + arcClassName)
				.data( arcData );
			} else if (arcClassName == 'arc') {
				arcGroup = chordVis.select('.arcs-container').selectAll('path.' + arcClassName)
				.data( arcData );
			}

			arcGroup.exit()
				.transition()
				.duration( Animation.arcTransitionDuration )
				.ease('cubic-in-out')
				.attrTween('d', Animation.arcExitTween)
				.remove();

			arcGroup.attr('d', arc)
				.style('fill', function(d, i) { return d.fill.default;})
				.transition()
				.duration(Animation.arcTransitionDuration)
				.ease('cubic-in-out')
				.attrTween('d', Animation.arcEnterTween)

			arcGroup.enter()
				.append('svg:path')
				.attr('transform', function(d,i) { return 'translate(' + d.translation.x + ',' + d.translation.y + ')'; })
				.style('fill', function(d, i) { return d.fill.default;})
				.style('stroke', function(d, i) { return d.stroke.default;})
				.style('opacity', function(d, i) { return d.opacity.default;})
				.attr('class', function(d, i) { return d.className; })
				.attr('data-model-id', function(d) { return d.model.id; })
				.attr('d', arc)
				.transition()
				.duration( Animation.arcTransitionDuration )
				.ease('cubic-in-out')
				.attrTween('d', Animation.arcEnterTween)


			if (arcClassName == 'sub-arc') {
				arcGroup
				.on( "mouseover", Events.mouseoverHandler)
				.on( "mouseout", Events.mouseoutHandler)
				.on( "click", Events.clickHandler)
			}

			return arcGroup;
		},
		drawChords: function(data, chordVis) {
			var chordPath = chordVis.select('.chords-container').selectAll('.chord__path')
				.data(data);
			var chordArrow = chordVis.select('.chords-container').selectAll('.chord__arrow')
				.data(data);

			// update
			chordPath
				.transition()
				.duration( Animation.chordTransitionDuration )
				.attrTween('d', Animation.chordTween)

			chordArrow
				.attr('x', function(d) { 
					return Params.vis.innerRadius * Math.sin(d.target.startAngle);
				})
				.attr('y', function(d) { 
					return -Params.vis.innerRadius * Math.cos(d.target.startAngle);
				})
				.attr('transform', function(d) {
					var rotationAngle = Mathy.rad2deg( 2*Math.PI - d.target.startAngle );
//					console.log( Mathy.rad2deg(d.target.startAngle) + ', rotation: ' + rotationAngle );
					var posX = Params.vis.innerRadius * Math.sin(d.target.startAngle);
					var posY = -Params.vis.innerRadius * Math.cos(d.target.startAngle);
					return 'translate(' + d.target.translation.x + ',' + d.target.translation.y + ')' + ' rotate(' + -rotationAngle + ',' + posX + ',' + posY + ')';
				});

			// enter
			chordPath.enter()
				.append('svg:path')
				.attr('class', 'chord__path')
				.attr('transform', function(d, i) { return 'translate(' + d.source.translation.x + ',' + d.source.translation.y + ')'; })
				.style('stroke-width', function(d) { return d.strokeWidth; })
				.style('fill', function(d) { return d.fill.default; })
				.style('stroke', function(d) { return d.stroke.default; })
				.style('opacity', function(d) { return d.opacity.default; })
				.transition()
				.duration( Animation.chordTransitionDuration )
				.attrTween('d', Animation.chordTween)

			chordArrow.enter()
				.append('svg:use')
				.attr('class', 'chord__arrow')
				.attr('xlink:href', '#arrow')
				.attr('x', function(d) { 
					return Params.vis.innerRadius * Math.sin(d.target.startAngle);
				})
				.attr('y', function(d) { 
					return -Params.vis.innerRadius * Math.cos(d.target.startAngle);
				})
				.style('fill', function(d) { return d.stroke.default; })
				.attr('transform', function(d) {
					var rotationAngle = Mathy.rad2deg( 2*Math.PI - d.target.startAngle );
//					console.log( Mathy.rad2deg(d.target.startAngle) + ', rotation: ' + rotationAngle );
					var posX = Params.vis.innerRadius * Math.sin(d.target.startAngle);
					var posY = -Params.vis.innerRadius * Math.cos(d.target.startAngle);
					return 'translate(' + d.target.translation.x + ',' + d.target.translation.y + ')' + ' rotate(' + -rotationAngle + ',' + posX + ',' + posY + ')';
				});

			chordPath.exit().remove();
			chordArrow.exit().remove();
		},
		drawText: function(data, chordVis) {
			var textClassName = data[0].className + '-text';
			var text = chordVis.selectAll('.' + textClassName)
				.data(data);

			text
				.transition()
				.duration(Animation.textTransitionDuration)
				.ease('cubic-in-out')
				.style('opacity', function(d,i) { return d.label.opacity.default; })
				.attr('x', function(d, i) { return d.label.position.x; })
				.attr('y', function(d, i) { return d.label.position.y; })
				.attr('text-anchor', function(d, i) { return d.label.textAnchor; })
				.attr('transform', function(d, i) { return 'translate(' + d.translation.x + ',' + d.translation.y + ') rotate(' + d.label.rotation + ',' + d.label.position.x + ',' + d.label.position.y + ')'; })
				.text( function(d, i) { return d.label.text; })

			text.enter()
				.append('svg:text')
				.attr('class', function(d, i) { return d.className + '-text'; })
				.attr('x', function(d, i) { return d.label.position.x; })
				.attr('y', function(d, i) { return d.label.position.y; })
				.attr('transform', function(d, i) { return 'translate(' + d.translation.x + ',' + d.translation.y + ') rotate(' + d.label.rotation + ',' + d.label.position.x + ',' + d.label.position.y + ')'; })
				.attr('text-anchor', function(d, i) { return d.label.textAnchor; })
				.style('opacity', function(d, i) { return d.label.opacity.default; })
				.style('fill', function(d, i) { return d.label.fill.default; })
				.text( function(d, i) { return d.label.text; })
				.transition()
				.duration(Animation.textTransitionDuration)
				.ease('cubic-in-out')
				.style('opacity', function(d,i) { return d.label.opacity.default; });

			text.exit()
				.transition()
				.duration( Animation.textTransitionDuration )
				.ease('cubic-in-out')
				.style('opacity', 0)
				.remove();

			if (textClassName == 'arc-text') {
				text
				.on( "mouseover", Events.mouseoverHandler)
				.on( "mouseout", Events.mouseoutHandler)
				.on( "click", Events.clickHandler)
			}
		}
	}
};
