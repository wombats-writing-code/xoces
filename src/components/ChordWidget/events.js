import * as d3 from 'd3'
// import {}

export function attachEvent(props) {
  props.selection
  .on('mouseover', function(d, i, g) {
    // console.log('mouseovered!', d, i, g, this)
    // console.log('event', d3.event)

    d3.select(this)
    .style('fill', d => d.activeFill)

    if (props.onMouseOverCallback) {
      props.onMouseOverCallback(d);
    }
  })
  .on('mouseout', function(d,i, g) {
    // console.log('mouse out!', d, i, g)

    d3.select(this)
    .style('fill', d => d.fill)

    if (props.onMouseOutCallback) {
      props.onMouseOutCallback(d);
    }
  })
  .on('click', function(d, i, g) {
    // console.log('clicked!', d, this)
    props.onClick(d);
  })
}

export function detachEvent(props) {

}
