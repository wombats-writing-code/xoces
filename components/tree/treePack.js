

/** treePack

*/
function treePack(nodes, links, iterateeFn) {

  var findDepthTraverse = function findDepthTraverse(arg, iterateeFn) {
    var quantity = iterateeFn(arg);

    if (quantity.length == 0) {
      return 0;

    } else {
      var maxDepth = 0;
      for (var i=quantity.length; i--;) {
        maxDepth = Math.max(maxDepth, findDepthTraverse(quantity[i], iterateeFn));
      }
      return maxDepth + 1;
    }
  }

  var levels = {};
  for (var j=0; j<nodes.length; j++) {
    var depth = findDepthTraverse(nodes[j], iterateeFn);
    levels[depth] = levels[depth] || [];
    levels[depth].push(nodes[j]);
  }

  return {
    levelsByRank: levels,
    links: links
  }
}

module.exports = treePack;
