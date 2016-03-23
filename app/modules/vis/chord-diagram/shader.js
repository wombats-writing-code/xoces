'use strict';

module.exports = function Shader(Params) {

	var shadings = {};

	var FillStrategy = {
		COURSE: function courseShader(collection) {
			return function(model, index) {
				var color = Color(Params.shading.arc.fill[0]);
				return color.rotate(80*index).hexString();
//				return Params.shading.arc.fill[0];
			}
		},
		SUBJECT: function subjectShader(collection) {
			return function(model, index) {
				var color = Color(Params.shading.arc.fill[1]);
				return color.rotate(30*index).hexString();
//				return Params.shading.arc.fill[1];
			}
		},
		MODULE: function moduleShader(collection) {
			return function(model, index) {
				var color = Color(Params.shading.arc.fill[2]);
				return color.rotate(30*index).hexString();
//				return Params.shading.arc.fill[2];
			}
		},
		OUTCOME: function outcomeShader(collection) {
			return function(model, index) {
				var color = Color(Params.shading.arc.fill[3]);
				return color.rotate(50*index).hexString();
//				return Params.shading.arc.fill[3];
			}
		}
	};

	return {
		shadeArc: function(layout) {
			var collection = layout.getCollection();
			var initShader = FillStrategy[ collection[0].model.modelType.name];
			var shader = initShader(collection);

			for (var i=0; i<collection.length; i++) {
				var fillColor = shader( collection[i].model, i );

				collection[i].fill = {
						default: fillColor,
						inFocus: fillColor,
						outFocus: fillColor,
				};
				collection[i].stroke = Params.shading.arc.stroke;
				collection[i].opacity = Params.shading.arc.opacity;
				collection[i].label.opacity = Params.shading.arc_text.opacity;
				collection[i].label.fill = Params.shading.arc_text.fill;
//				console.log(collection[i]);
			}
			return layout;
		},
		shadeSubArc: function(layout) {
			var collection = layout.getCollection();
			var initShader = FillStrategy[ collection[0].model.modelType.name];
			var shader = initShader(collection);

			for (var i=0; i<collection.length; i++) {
				var model = collection[i].model;
				var fillColor = shader( collection[i].model, i);

				collection[i].fill = {
					default: 'transparent',
//					inFocus: fillColor,
					inFocus: Params.shading.arc.fill[0],
					outFocus: '#fafafa'
				};
				collection[i].stroke = Params.shading.sub_arc.stroke;
				collection[i].opacity = Params.shading.sub_arc.opacity;
				collection[i].label.opacity = Params.shading.sub_arc_text.opacity;
				collection[i].label.fill = Params.shading.sub_arc_text.fill;
			}
			return layout;
		},
		shadeChord: function(layout) {
			var collection = layout.getCollection();

			for (var i=0; i<collection.length; i++) {
				collection[i].strokeWidth = Params.shading.chord.strokeWidth;
				collection[i].fill = Params.shading.chord.fill;
				collection[i].stroke = Params.shading.chord.stroke;
				collection[i].opacity = Params.shading.chord.opacity;
			}
			return layout;
		},
		shadeChordText: function(layout) {
			var collection = layout.collection;

			for (var i=0; i<collection.length; i++) {
				collection[i].stroke = Params.shading.chord_text.stroke;
				collection[i].opacity = Params.shading.chord_text.opacity;
			}
			return layout;
		}
	}
}
