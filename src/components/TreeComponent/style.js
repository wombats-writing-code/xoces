import _ from 'lodash'
import chroma from 'chroma-js'

export const stylize = (data, scheme) => {
  if (!scheme) {
    throw new TypeError('stylize must be provided the style scheme')
  }

  let colorScale = chroma.scale(scheme.subArc.fillRange)
    .domain([0, data.arcs.length-1]);

  let styled = _.assign({}, data, {

  })

  return styled;
}

export const getScheme = (name) => {

  if (name === 'dark') {
    return {
      background: '#333',
      
    }
  }
}
