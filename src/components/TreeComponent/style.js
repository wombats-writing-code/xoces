import _ from 'lodash'
import chroma from 'chroma-js'

export const stylize = (data, scheme) => {
  if (!scheme) {
    throw new TypeError('stylize must be provided the style scheme')
  }

  let styled = _.assign({}, data, {
    nodes: _.map(data.nodes, n => _.assign({}, n, scheme.node)),
    edges: _.map(data.edges, e => _.assign({}, e, scheme.edge))
  })

  return styled;
}

export const getScheme = (name) => {

  if (name === 'dark') {
    return {
      background: '#333',
      node: {
        fill: '#fff',
        nodeLabelColor: '#333',
        nodeLabelFontSize: 11,
        nodeTagColor: '#fff',
        nodeTagFontSize: 11
      },
      edge: {
        stroke: '#aaa',
        strokeWidth: 1
      }
    }
  }
}
