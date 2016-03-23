'use strict';

module.exports = function(Params) {

	var paintTransitionDuration = 300;
	var arc = d3.svg.arc()
		.innerRadius(Params.vis.innerRadius)
		.outerRadius(Params.vis.outerRadius);
	var chord = d3.svg.chord()
		.radius(Params.vis.outerRadius);

	var FillStrategy = {
		path: function(d) {
			return d.fill;
		},
		text: function(d) {
			return d.label.fill;
		},
		use: function(d) {
			return d.stroke;		// TODO: not a very good hack
		}
	};

	var StrokeStrategy = {
		path: function(d) {
			return d.stroke;
		},
		text: function(d) {
			return null;
		},
		use: function(d) {
			return d.fill;
		}
	};

	var OpacityStrategy = {
		path: function(d) {
			return d.opacity;
		},
		text: function(d) {
			return d.label.opacity;
		},
		use: function(d) {
			return d.opacity;
		}
	};

	// =========

	var Animation = {};

	Animation.paintOutFocus = function(selection) {

		selection
	//	.transition()
	//	.duration(paintTransitionDuration)
		.style( "stroke", function(d) { 
			var result  = StrokeStrategy[this.tagName](d);
			return  result ? result.outFocus : '';
		})
		.style( "fill", function(d) { 
			var result = FillStrategy[this.tagName](d);
			return  result ? result.outFocus : '';
		})
		.style( "opacity", function(d) { 
			var result = OpacityStrategy[this.tagName](d);
			return  result ? result.outFocus : '';
		});
	}

	Animation.paintDefault = function(selection) {

		selection
//		.transition()
//		.duration(paintTransitionDuration)
		.style( "stroke", function(d) { 
			var result  = StrokeStrategy[this.tagName](d);
			return  result ? result.default : '';
		})
		.style( "fill", function(d) { 
			var result = FillStrategy[this.tagName](d);
			return  result ? result.default : '';
		})
		.style( "opacity", function(d) { 
			var result = OpacityStrategy[this.tagName](d);
			return  result ? result.default : '';
		});

	}

	Animation.paintInFocus = function(selection) {
		selection
		.style("fill", function(d) {
			return FillStrategy[this.tagName](d).inFocus;
		})
		.style( "stroke", function(d) { 
			var result  = StrokeStrategy[this.tagName](d);
			return  result ? result.inFocus : '';
		})
		.style( "opacity", function(d) { 
			var result = OpacityStrategy[this.tagName](d);
			return  result ? result.inFocus : '';
		});
/*
		.transition()
		.duration(5)
		.styleTween("fill", function(d) {
			var endColor = FillStrategy[this.tagName](d).inFocus;
			var i = d3.interpolate(d.fill.default, endColor);
			return function(t) {
				return i(t);
			}
		})
		.transition()
		.duration(paintTransitionDuration)
		.style( "stroke", function(d) { 
			var result  = StrokeStrategy[this.tagName](d);
			return  result ? result.inFocus : '';
		})
		.style( "opacity", function(d) { 
			var result = OpacityStrategy[this.tagName](d);
			return  result ? result.inFocus : '';
		});
*/

		return selection;
	}

	Animation.arcTransitionDuration = 750;
	Animation.arcExitTween = function(d, i, a) {
		var interpolate = d3.interpolate(d.startAngle, d.endAngle);
		return function(t) {
			d.startAngle = interpolate(t);
//			console.log('start: ' + d.startAngle + ', end: ' + d.endAngle);
			return arc(d);
		};
	}

	Animation.arcEnterTween = function(d, i, a) {
		var interpolate = d3.interpolate(d.startAngle, d.endAngle);
		return function(t) {
			d.endAngle = interpolate(t);
	//		console.log('start: ' + d.startAngle + ', end: ' + d.endAngle);
			return arc(d);
		}
	}

	Animation.chordTransitionDuration = 3000;
	Animation.chordTween = function(d) {
		var self = this;
		var startPoint = this.getPointAtLength(0);
		var endPoint = this.getPointAtLength(100);
		var totalLength = this.getTotalLength();

		return function(t) {
/*
			console.log(self);
			console.log(d.model.displayName);
			console.log(interpolate(t) );
*/
			var p0 = self.getPointAtLength( t*totalLength );
			var p1 = self.getPointAtLength( t*totalLength );

			var interpolate = d3.interpolate(startPoint, chord(d) );

		//	self.setAttribute("d", interpolate(t));
			return interpolate(t);
		}
	}

	Animation.textTransitionDuration = 300;
	Animation.textTween = function(d) {
	}

	return Animation;

}

