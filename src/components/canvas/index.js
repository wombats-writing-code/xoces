
export const init = (visCanvas, backgroundColor, props) => {
  visCanvas
  .style('height', props.height)
  .style('width', props.width)
  .style('background', backgroundColor);

  let w = parseFloat(visCanvas.style('width'), 10);
  let h = parseFloat(visCanvas.style('height'), 10);

  // console.log('arc', innerRadius, outerRadius)

  let drawingGroup = visCanvas.append('g')
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  return {drawingGroup, w, h}
}
