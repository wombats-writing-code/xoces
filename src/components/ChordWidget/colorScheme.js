

export const style = (data, scheme) => {
  let styled = _.assign({}, data, {
    arcs: _.map(data.arcs, a => {
      return _.assign({}, a, {
        fill: scheme.arc.fill,
      })
    }),
    subArcs: _.map(data.subArcs, a => {
      return _.assign({}, a, {
        fill: scheme.subArc.fill,
        stroke: scheme.subArc.stroke
      })
    }),
    labels: _.map(data.labels, l => {
      return _.assign({}, l, {
        fill: scheme.label.fill
      })
    })
  })

  return styled;
}

export const getScheme = (name) => {

  if (name === 'dark') {
    return {
      background: '#333',
      arc: {
        fill: '#fff',
      },
      subArc: {
        fill: '#AC6C82',
        stroke: '#e0e0e0'
      },
      label: {
        fill: '#fff'
      }
    }
  }
}
