import * as d3 from 'd3';
import {arcEnterTween, arcExitTween, ARC_TRANSITION_DURATION} from './animation'

export const drawArcs = (props) => {
  let data = props.data;

  let arc = d3.arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius)
    // .startAngle(0)
    // .endAngle(2*Math.PI)
    // .padAngle(d => d.padding)
  // console.log('props', props)

  let arcGroup = props.selection
    .selectAll(`${props.className}`)
    .data(data);

  arcGroup
    .enter().append('path')
    .attr('d', arc)
    .attr('class', d => d.className)
    .style('fill', d => d.fill)
    .style('stroke', d => d.stroke);

  // let arcClassName = data.className;


  arcGroup.exit()
    // .transition()
    // .duration( ARC_TRANSITION_DURATION )
    // .ease('cubic-in-out')
    // .attrTween('d', arcExitTween)
    .remove();

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
	let text = props.selection.selectAll(props.className)
		.data(props.data);

	text.enter()
    .append('svg:text')
		// .transition()
    // .duration(3000)
		// .duration(TEXT_TRANSITION_DURATION)
		// .ease('cubic-in-out')
		// .style('opacity', function(d,i) { return d.label.opacity.default; })
    .attr( 'fill', d => d.fill)
		.attr('x', (d, i) => d.position.x)
		.attr('y', (d, i) => d.position.y)
    .style( 'font-size', d => d.fontSize)
		.attr('text-anchor', (d, i) => d.textAnchor)
		.attr('transform', (d, i) => 'translate(' + d.translation.x + ',' + d.translation.y + ') rotate(' + d.rotation + ',' + d.position.x + ',' + d.position.y + ')')
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
