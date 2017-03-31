
export function arcCentroid(arc) {
  return arc.startAngle + (arc.endAngle - arc.startAngle) / 2;
}

export function arcStart(arc) {
  return arc.startAngle + (arc.endAngle - arc.startAngle) / 3;
}

/***
  theta is in radians, relative to 12'oclock
 note that SVG coors is x -> positive and y going down is positive
*/
export function polarToRectangular(coors) {
  return {
    x: coors.r * Math.sin(coors.theta),
    y: -coors.r * Math.cos(coors.theta)
  }
}

export function radiansToDegrees(rad) {
  return rad * 180 / Math.PI;
}

export function degreesToRadians(deg) {
  return deg *  Math.PI / 180;
}

export function textAnchor(centroid) {
  // console.log('arc', arc.model.name, 'start', _radiansToDegrees(arc.startAngle), 'end', _radiansToDegrees(arc.endAngle), 'degrees');
  // console.log('arc', arc.model.name, 'start', (arc.startAngle), 'end', (arc.endAngle), 'rad');

  if (centroid < Math.PI) {
    return 'start'

  } else {
    return 'end'
  }
}

export function rotation(centroid) {
  if (centroid < Math.PI) {
    return -1 * radiansToDegrees(Math.PI / 2 - centroid)

  } else {
    return radiansToDegrees(centroid) - 90 - 180;
  }
}
