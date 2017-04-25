import _ from 'lodash'
import chroma from 'chroma-js'

export const stylize = (data, scheme, props) => {
  if (!scheme) {
    throw new TypeError('stylize must be provided the style scheme')
  }

  let styled = _.assign({}, data, {
    nodes: _.map(data.nodes, n => _.assign({}, n, scheme.node)),
    edges: _.map(data.edges, e => _.assign({}, e, scheme.edge))
  })

  if (props.nodeColor) {
    styled.nodes = _.map(styled.nodes, (node) => {
      return _.assign(node, {
        fill: _.isFunction(props.nodeColor) ? props.nodeColor(node.model) : props.nodeColor
      })
    })
  }

  return styled;
}

export const getScheme = (name) => {
  return schemes[name];
}

const schemes = {
  'dark': {
    name: 'dark',
    background: '#333',
    node: {
      fill: '#fff',
      opacity: 1,
      nonActiveOpacity: .25,
      activeOpacity: 1,
      nodeLabelColor: '#333',
      nodeLabelFontSize: 11,
      // node Tag
      nodeTagColor: '#fff',
      nodeTagFontSize: 11,
      nodeTagOpacity: 0,
    },
    edge: {
      stroke: '#d0d0d0',
      opacity: .8,
      nonActiveOpacity: .1,
      activeOpacity: 1,
      strokeWidth: 1
    }
  },
  'light': {
    name: 'light',
    background: 'transparent',
    node: {
      fill: '#333',
      opacity: 1,
      nonActiveOpacity: .25,
      activeOpacity: 1,
      nodeLabelColor: '#fff',
      nodeLabelFontSize: 11,
      // node Tag
      nodeTagColor: '#333',
      nodeTagFontSize: 11,
      nodeTagOpacity: 0,
    },
    edge: {
      stroke: '#a0a0a0',
      opacity: .8,
      nonActiveOpacity: .1,
      activeOpacity: 1,
      strokeWidth: 1
    }
  }
}
