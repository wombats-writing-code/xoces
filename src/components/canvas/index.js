
export const init = (visCanvas, backgroundColor, props) => {
  let setHeight = _.isNumber(props.height) ? `${props.height}px` : props.height;
  let setWidth = _.isNumber(props.width) ? `${props.width}px` : props.width;

  visCanvas
  .style('height', setHeight)
  .style('width', setWidth)
  .style('background', backgroundColor);

  let w = parseFloat(visCanvas.style('width'), 10);
  let h = parseFloat(visCanvas.style('height'), 10);

  // console.log('arc', innerRadius, outerRadius)

  let drawingGroup = visCanvas.append('g')
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  return {drawingGroup, w, h}
}
