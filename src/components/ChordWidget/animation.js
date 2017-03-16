import d3 from 'd3'

export const ARC_TRANSITION_DURATION = 750;
export const CHORD_TRANSITION_DURATION = 3000;


export const arcExitTween = (d, i, a) => {
  let interpolate = d3.interpolate(d.startAngle, d.endAngle);
  return function(t) {
    d.startAngle = interpolate(t);
    return arc(d);
  };
}

export const arcEnterTween = (d, i, a) => {
  let interpolate = d3.interpolate(d.startAngle, d.endAngle);
  return function(t) {
    d.endAngle = interpolate(t);
    return arc(d);
  }
}
