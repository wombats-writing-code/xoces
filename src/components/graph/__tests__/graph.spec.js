let chai = require('chai');
chai.should();

import graphProvider from '../graph'

describe('graph lib', () => {

  let graph;
  beforeEach(function() {
    graph = graphProvider({
      sourceRef: 'sourceId',
      targetRef: 'targetId',
      parentType: 'HAS_PARENT_OF'
    })
  })

  it('should get outgoing edges from a source entity of a given edge type ', () => {
    let rels = [
      {
        sourceId: 1,
        targetId: 2,
        type: 'HAS_PREREQUISITE_OF'
      },
      {
        sourceId: 1,
        targetId: 2,
        type: 'HAS_PARENT_OF'
      },
    ]
    let result = graph.getOutgoingEdges(1, 2, 'HAS_PREREQUISITE_OF', rels)

    result.should.be.a('array')
    result[0].should.be.eql(rels[0]);
  })

  it('should get parents ', () => {
    let rels = [
      {
        sourceId: 1,
        targetId: 2,
        type: 'HAS_PARENT_OF'
      },
      {
        sourceId: 1,
        targetId: 3,
        type: 'HAS_PARENT_OF'
      },
    ]

    let entities = [
      {
        id: 2,
      },
      {
        id: 3
      },
    ]
    let result = graph.getParents(1, entities, rels)

    result.should.be.a('array')
    result.length.should.eql(2)
  })
})
