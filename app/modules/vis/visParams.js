'use strict';

module.exports = {
	canvas: {
		height: 1000
	},
	vis: {
		outerRadius: 260, 
		innerRadius: 235,
		marginRight: 20, 
		marginTop: 210, 
		marginLeft: 80,
		layerHeight: 150,
		nodeWidth: 40,
		nodeHeight: 40,
	},
	ARC: {
		name: 'ARC',
	},
	SUBARC: {
		name: 'SUBARC',
	},
	CHORD: {
		name: 'CHORD',
	},
	shading: {
		arc: {
			fill: [ '#96CA2D', '#D8D830', '#4BB5C1', '#FFF0A5'],
			stroke: { default: 'none', inFocus: 'none', outFocus: 'none'},
			opacity: { default: '1', inFocus: '1', outFocus: '.25'}
		},
		sub_arc: {
			fill: { default: 'transparent', inFocus: 'transparent', outFocus: '#ddd'},
			stroke: { default: '#ddd', inFocus: '#ddd', outFocus: '#ddd'},
			opacity: { default: '1', inFocus: '1', outFocus: '.75'}
		},
		chord: {
			strokeWidth: .6,
			fill: { default: 'none', inFocus: 'none', outFocus: 'none'},
			stroke: { default: '#fff', inFocus: '#fff', outFocus: '#fff'},	// light-on-dark
//			stroke: { default: '#555', inFocus: '#333', outFocus: '#aaa'},
			opacity: {
				default: '.8',
				inFocus: '1',
				outFocus: '.1',
			},
		},
		arrow: {
			strokeWidth: 1, 
			fill: { default: '#fff', inFocus: '#fff', outFocus: '#fff'},
			opacity: {
				default: '.5',
				inFocus: '1',
				outFocus: '.1',
			}
		},
		arc_text: {
			fill: {
				default: '#ddd',		
				inFocus: '#fff',
				outFocus: '#ccc',
//				default: '#555',
			},
			opacity: {
				default: '1',
				inFocus: '1',
				outFocus: '.25',
			},
		},
		sub_arc_text: {
			fill: {
				default: '#ccc',
				inFocus: '#fff',
				outFocus: '#ccc',
			},
			opacity: {
				default: '0',
				inFocus: '1',
				outFocus: '0',
			},
		},
		chord_text: {
			fill: {
				default: '#fff',
				inFocus: '#fff',
				outFocus: '#fff',
			},
		},
		opacity: {
			default: '0',
			inFocus: '1',
			outFocus: '0',
		},
	},
	link: {
		strokeWidth: 2,
		strokeDashArray: '2,2',
		stroke: {default: '#aaa', inFocus: '#A31F34', outFocus: '#888'},	// light-on-dark
		fill: {default: '#aaa', inFocus: '#A31F34', outFocus: '#888'},	
		opacity: {default: '.45', inFocus: '1', outFocus: '.05'},	
	},
	text: {
		title: {
			fill: {default: '#fff', inFocus: '#a31f34', outFocus: '#fff'},	
			opacity: {default: '1', inFocus: '1', outFocus: '.2'},	
		},
		body: {
			fill: {default: '#888', inFocus: '#888', outFocus: '#888'},	
			opacity: {default: '0', inFocus: '1', outFocus: '.2'},	
		},
	},
	print: {
		node: {
			fill: '#a31f34'
		},
		link: {
			stroke: '#aaa'
		},
		text: {
			fill: '#343434'
		}
	}
};
