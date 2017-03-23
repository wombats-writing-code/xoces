import _ from 'lodash'
import chroma from 'chroma-js'

export const stylize = (data, scheme) => {
  if (!scheme) {
    throw new TypeError('stylize must be provided the style scheme')
  }

  let colorScale = chroma.scale(scheme.subArc.fillRange)
    .domain([0, data.arcs.length-1]);

  let styled = _.assign({}, data, {
    arcs: _.map(data.arcs, (a, idx) => {
      return _.assign({}, a, scheme.arc);
    }),
    subArcs: _.map(data.subArcs, a => {
      return _.assign({}, a, scheme.subArc, {
        fill: colorScale(a.arcIndex).hex()
      })
    }),
    arcLabels: _.map(data.arcLabels, l => {
      return _.assign({}, l, scheme.arcLabel)
    }),
    subArcLabels: _.map(data.subArcLabels, l => {
      return _.assign({}, l, scheme.subArcLabel)
    }),
    chords: _.map(data.chords, c => _.assign({}, c, scheme.chord))
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
        fillRange: ['#D58C47', '#8049BD', '#609733'],
        stroke: '#e0e0e0',
        activeFill: '#fff',
        nonActiveOpacity: .3
      },
      arcLabel: {
        fill: '#fff',
        fontSize: 13,
        opacity: 1,
        nonActiveOpacity: .3
      },
      subArcLabel: {
        fill: '#fff',
        fontSize: 11,
        opacity: 0,
        activeOpacity: 1
      },
      chord: {
        stroke: '#fff',
        opacity: .7,
        activeOpacity: 1,
        nonActiveOpacity: .1
      }
    }
  }
}
