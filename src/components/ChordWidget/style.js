

export const stylize = (data, scheme) => {
  if (!scheme) {
    throw new TypeError('stylize must be provided the style scheme')
  }

  let styled = _.assign({}, data, {
    arcs: _.map(data.arcs, a => {
      return _.assign({}, a, scheme.arc)
    }),
    subArcs: _.map(data.subArcs, a => {
      return _.assign({}, a, scheme.subArc)
    }),
    arcLabels: _.map(data.arcLabels, l => {
      return _.assign({}, l, scheme.arcLabel)
    }),
    subArcLabels: _.map(data.subArcLabels, l => {
      return _.assign({}, l, scheme.subArcLabel)
    }),
  })

  return styled;
}

export const getScheme = (name) => {

  if (name === 'dark') {
    return {
      background: '#333',
      arc: {
        fill: '#555',
      },
      subArc: {
        fill: '#AC6C82',
        stroke: '#e0e0e0',
        activeFill: '#fff',
        nonActiveOpacity: .5
      },
      arcLabel: {
        fill: '#fff',
        fontSize: 13,
        opacity: 1,
        nonActiveOpacity: .5
      },
      subArcLabel: {
        fill: '#fff',
        fontSize: 11,
        opacity: 0,
        activeOpacity: 1
      },
    }
  }
}
