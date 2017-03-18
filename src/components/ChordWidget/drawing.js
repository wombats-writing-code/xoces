import * as d3 from 'd3';
import {arcEnterTween, arcExitTween, ARC_TRANSITION_DURATION} from './animation'
import {getScheme} from './style'
import {computeDimensions} from './layout'

export const ARC_CLASS_NAME = 'ARC_CLASS_NAME'
export const SUB_ARC_CLASS_NAME = 'SUB_ARC_CLASS_NAME'
export const ARC_LABEL_CLASS_NAME = 'ARC_LABEL_CLASS_NAME'
export const SUB_ARC_LABEL_CLASS_NAME = "SUB_ARC_LABEL_CLASS_NAME"


export const init = (chordVis, props) => {
  let scheme = getScheme(props.colorScheme)

  chordVis
  .style('height', props.height)
  .style('width', props.width)
  .style('background', scheme.background);

  let w = parseFloat(chordVis.style('width'), 10);
  let h = parseFloat(chordVis.style('height'), 10);

  let {innerRadius, outerRadius} = computeDimensions(w, h);

  let d3Arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  // console.log('arc', innerRadius, outerRadius)

  let drawingGroup = chordVis.append('g')
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  return {drawingGroup, w, h, d3Arc}
}

export const drawArcs = (props) => {
  let data = props.data;
  let arc = props.arc;

  let arcGroup = props.selection
    .selectAll(`path.${props.className}`)
    .data(data, d => d.id);

  arcGroup.exit()
    // .transition()
    // .duration( ARC_TRANSITION_DURATION )
    // .ease('cubic-in-out')
    // .attrTween('d', arcExitTween)
    .remove();


  arcGroup.enter()
    .append('path')
    .attr('d', arc)
    .attr('class', d => props.className)
    .style('fill', d => d.fill)
    .style('stroke', d => d.stroke);

  // let arcClassName = data.className;



  // arcGroup.attr('d', arc)
  //   .style('fill', (d, i) => d.fill.default)
  //   .transition()
  //   .duration(ARC_TRANSITION_DURATION)
  //   .ease('cubic-in-out')
  //   .attrTween('d', arcEnterTween)
  //
  // arcGroup.enter()
  //   .append('svg:path')
  //   .attr('transform', (d,i) =>  `translate(${d.translation.x}, ${d.translation.y})`)
  //   .style('fill', (d,i) => d.fill.default)
  //   .style('stroke', (d,i) => d.stroke.default)
  //   .style('opacity', (d,i) => d.opacity.default)
  //   .attr('class', (d,i) => d.className)
  //   .attr('data-model-id', (d,i) => d.model.id)
  //   .attr('d', arc)
  //   .transition()
  //   .duration( ARC_TRANSITION_DURATION )
  //   .ease('cubic-in-out')
  //   .attrTween('d', arcEnterTween)

  return arcGroup;
}

export const drawLabels = (props) => {
  // console.log('drawLabels props', props);

	let text = props.selection.selectAll(`text.${props.className}`)
		.data(props.data, d => d.id);

  // console.log('label exit', text.exit())

  text.exit()
    .remove();

	text.enter()
    .append('svg:text')
		// .transition()
    // .duration(3000)
		// .duration(TEXT_TRANSITION_DURATION)
		// .ease('cubic-in-out')
		// .style('opacity', function(d,i) { return d.label.opacity.default; })
    .attr( 'class', d => props.className)
    .attr( 'fill', d => d.fill)
		.attr('x', (d, i) => d.position.x)
		.attr('y', (d, i) => d.position.y)
		.attr('text-anchor', (d, i) => d.textAnchor)
		.attr('transform', (d, i) => 'translate(' + d.translation.x + ',' + d.translation.y + ') rotate(' + d.rotation + ',' + d.position.x + ',' + d.position.y + ')')
    .style( 'font-size', d => d.fontSize)
    .style('opacity', d => d.opacity)
		.text( d => d.text )


    return text
}

//
// return arcGroup;
//
// if (arcClassName == 'sub-arc') {
//   arcGroup
//   .on( "mouseover", Events.mouseoverHandler)
//   .on( "mouseout", Events.mouseoutHandler)
//   .on( "click", Events.clickHandler)
// }
