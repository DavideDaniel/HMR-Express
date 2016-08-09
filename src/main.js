import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';
import data from './example';
import axios from 'axios';

const radius = 400;
const dendogramContainer = "content";
const dendogramDataSource = data;
const rootNodeSize = 20;
const levelOneNodeSize = 12;
const levelTwoNodeSize = 10;
const levelThreeNodeSize = 7;

let i = 0;
let duration = 300; //Changing value doesn't seem any changes in the duration ??
let rootJsonData;

const API_ROOT = `http://54.213.83.132/hackoregon/http/`;

const getFilerId = filerId => axios.get(`${API_ROOT}current_candidate_transactions/${filerId}/`);
const getDonorTrans = name => axios.get(`${API_ROOT}transactions_by_alias/${name}/`);

const getInitialData = (id) => {
  const func = isNaN(id) ? getDonorTrans : getFilerId;
  return func(id).then(response => {
    if(response.status === 200) {
      return { data:response.data, _id: id }
    } else {
      console.log(response.statusText);
    }
  })
}

window.MAP = {};
let MAP = window.MAP;

const checkForId = (data) => {
  const { filer_id, filer, contributor_payee_class, contributor_payee_committee_id, contributor_payee } = data;

  if(contributor_payee_class == 'grassroots_contributor'){
    return {
      name: filer,
      _id: filer_id
    }
  }

  if(contributor_payee_committee_id) {
    return {
      name: contributor_payee,
      _id: contributor_payee_committee_id
    }
  }

  return {
    name: contributor_payee,
    _id: contributor_payee
  };
}

const unique = (data) => {
  let map = {};
  data.forEach(item => {
    map[item.name] = {
     name: item.name,
      _id: item._id,
      get: () => bindData(item._id)
    }
  });
  return map;
}

const getData = (data) => data.map(i => checkForId(i));

const bindData = id => getInitialData(id).then(response => {
  const { data, _id } = response;
  const inbound = data.filter(d => d.direction === 'in');
  const outbound = data.filter(d => d.direction === 'out');
  const dataSet = unique(getData(data));
  const existing = window.MAP[_id] || {}
  window.MAP[_id] = {...existing,
      name: data[0].filer,
      children: [{
        name: 'Recipients',
        children: unique(getData(outbound))
      },
      { name: 'Donors',
        children: unique(getData(inbound))
      }]
    };
  return window.MAP[_id].children;
});

const getRootData = id => {
  if(window.MAP && window.MAP[id] && MAP[id].children){
    return {
      name: MAP[id].name,
      children: MAP[id].children
    }
  } else {
    return bindData(id).then(v => getRootData(id));
  }
}

const cluster = d3.layout.cluster()
  .size([360, radius - 120])
  .separation((a, b) => {
    return (a.parent == b.parent ? 1 : 2) / a.depth;
  });

const diagonal = d3.svg.diagonal.radial()
  .projection(d => {
    return [d.y, d.x / 180 * Math.PI];
  });
let containerDiv = d3.select(document.getElementById(dendogramContainer));
containerDiv.append("button")
  .attr("id", "collapse-button")
  .text("Collapse!")
  .on("click", collapseLevels);
const svgRoot = containerDiv.append("svg:svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "-" + (radius) + " -" + (radius - 50) + " " + radius * 2 + " " + radius * 2)
  .call(d3.behavior.zoom()
    .scale(0.9)
    .scaleExtent([0.1, 3])
    .on("zoom", zoom))
  .on("dblclick.zoom", null)
  .append("svg:g");
// Add the clipping path
svgRoot.append("svg:clipPath")
  .attr("id", "clipper-path")
  .append("svg:rect")
  .attr('id', 'clip-rect-anim');
var animGroup = svgRoot.append("svg:g")
  .attr("clip-path", "url(#clipper-path)");

getRootData(931).then(response => {
    rootJsonData = response;
    debugger;
    rootJsonData.children.forEach(collapse);
    createCollapsibleDendroGram(rootJsonData);
});
// rootJsonData = data;

function createCollapsibleDendroGram(source) {
  // Compute the new tree layout.
  let nodes = cluster.nodes(rootJsonData);
  let pathlinks = cluster.links(nodes);
  // Normalize for nodes' fixed-depth.
  nodes.forEach(d => {
    if (d.depth <= 2) {
      d.y = d.depth * 70;
    } else {
      d.y = d.depth * 100;
    }
  });
  // Update the nodes…
  const node = svgRoot.selectAll("g.node")
    .data(nodes, d => {
      return d.id || (d.id = ++i);
    });
  // Enter any new nodes at the parent's previous position.
  const nodeEnter = node.enter()
    .append("g")
    .attr("class", "node")
    .on("click", toggleChildren);
  nodeEnter.append("circle");
  nodeEnter.append("text")
    .attr("x", 10)
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .text(d => {
      if (d.depth === 2) {
        return d.alias;
      }
      return d.name;
    });
  // Transition nodes to their new position.
  const nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", d => {
      return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
    })
  nodeUpdate.select("circle")
    .attr("r", d => {
      if (d.depth == 0) {
        return rootNodeSize;
      } else if (d.depth === 1) {
        return levelOneNodeSize;
      } else if (d.depth === 2) {
        return levelTwoNodeSize;
      }
      return levelThreeNodeSize;
    })
    .style("fill", d => {
      if (d.depth === 0) {
        return "#808080";
      } else if (d.depth === 1) {
        if (d.name == "Recipients") return "#816854";
        return "#C3B9A0";
      } else {
        return d.color;
      }
    })
    .style("stroke", d => {
      if (d.depth > 1) {
        return "white";
      } else {
        return "lightgray";
      }
    });
  nodeUpdate.select("text")
  .attr('id', d => {
      let order = 0;
      if (d.order) order = d.order;
      return 'T-' + d.depth + "-" + order;
    })
    .attr("text-anchor", d => {
      if (d.depth === 1) {
        return d.x < 180 ? "end" : "start";
      }
      return d.x < 180 ? "start" : "end";
    })
    .attr("dy", d => {
      if (d.depth === 1) {
        return d.x < 180 ? "1.4em" : "-0.2em";
      }
      return ".31em";
    })
    .attr("dx", d => {
      if (d.depth === 1) {
        return 0; //return d.x > 180 ? 2 : -2;
      }
      return d.x < 180 ? 1 : -20;
    })
    .attr("transform", d => {
      if (d.depth < 2) {
        return "rotate(" + (90 - d.x) + ")";
      } else {
        return d.x < 180 ? null : "rotate(180)";
      }
    });
  // TODO: appropriate transform
  const nodeExit = node.exit()
    .transition()
    .duration(duration)
    .remove();
  // Update the links…
  const link = svgRoot.selectAll("path.link")
    .data(pathlinks, d => {
      return d.target.name;
    });
  // Enter any new links at the parent's previous position.
  link.enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", d => {
      var o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .style("fill", d => {
      return d.color;
    });
  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);
  // Transition exiting nodes to the parent's new position.
  link.exit()
    .transition()
    .duration(duration)
    .attr("d", d => {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();
}
// Toggle children on click.
function toggleChildren(d, clickType) {
  if (d.children) {
    d._children = d3.values(d.children);
    d.children = null;
  } else {
    d.children = d3.values(d._children);
    d._children = null;
  }
  var type = typeof clickType == undefined ? "node" : clickType;
  //Activities on node click
  createCollapsibleDendroGram(d);
  highlightNodeSelections(d);
  highlightRootToNodePath(d, type);
}
// Collapse nodes
function collapse(d) {
  debugger;
  if (d.children) {
    d._children = d3.values(d.children);
    d._children.forEach(collapse);
    d.children = null;
  }
}
// highlights subnodes of a node
function highlightNodeSelections(d) {
  const highlightLinkColor = "darkslategray"; //"#f03b20";
  const defaultLinkColor = "lightgray";
  const depth = d.depth;
  let nodeColor = d.color;
  if (depth === 1) {
    nodeColor = highlightLinkColor;
  }
  const pathLinks = svgRoot.selectAll("path.link");
  pathLinks.style("stroke", (dd) => {
    debugger;
    if (dd.source.depth === 0) {
      if (d.name === '') {
        return highlightLinkColor;
      }
      return defaultLinkColor;
    }
    if (dd.source.name === d.name) {
      return nodeColor;
    } else {
      return defaultLinkColor;
    }
  });
}
//Walking parents' chain for root to node tracking
function highlightRootToNodePath(d, clickType) {
  let ancestors = [];
  let parent = d;
  while (!_.isUndefined(parent)) {
    ancestors.push(parent);
    parent = parent.parent;
  }
  // Get the matched links
  let matchedLinks = [];
  svgRoot.selectAll('path.link')
    .filter((d, i) => {
      return _.any(ancestors, p => {
        return p === d.target;
      });
    })
    .each(d => {
      matchedLinks.push(d);
    });
  animateChains(matchedLinks, clickType);

  function animateChains(links, clickType) {
    animGroup.selectAll("path.selected")
      .data([])
      .exit()
      .remove();
    animGroup.selectAll("path.selected")
      .data(links)
      .enter()
      .append("svg:path")
      .attr("class", "selected")
      .attr("d", diagonal);
    //Reset path highlight if collapse button clicked
    if (clickType == 'button') {
      animGroup.selectAll("path.selected")
        .classed('reset-selected', true);
    }
    var overlayBox = svgRoot.node()
      .getBBox();
    svgRoot.select("#clip-rect-anim")
      .attr("x", -radius)
      .attr("y", -radius)
      .attr("width", 0)
      .attr("height", radius * 2)
      .transition()
      .duration(duration)
      .attr("width", radius * 2);
  }
}

function zoom() {
  svgRoot.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function collapseLevels() {
  if (checkForThirdLevelOpenChildren()) {
    toggleAllSecondLevelChildren();
  } else {
    toggleSecondLevelChildren();
  }
  // Open first level only by collapsing second level
  function toggleSecondLevelChildren() {
    for (rootIndex = 0, rootLength = rootJsonData.children.length; rootIndex < rootLength; rootIndex++) {
      if (isNodeOpen(rootJsonData.children[rootIndex])) {
        toggleChildren(rootJsonData.children[rootIndex], 'button');
      }
    }
  }
  // Open first level only by collapsing second level
  function toggleAllSecondLevelChildren() {
    for (rootIndex = 0, rootLength = rootJsonData.children.length; rootIndex < rootLength; rootIndex++) {
      if (isNodeOpen(rootJsonData.children[rootIndex])) {
        for (childIndex = 0, childLength = rootJsonData.children[rootIndex].children.length; childIndex < childLength; childIndex++) {
          var secondLevelChild = rootJsonData.children[rootIndex].children[childIndex];
          if (isNodeOpen(secondLevelChild)) {
            toggleChildren(rootJsonData.children[rootIndex].children[childIndex], 'button');
          }
        }
      }
    }
  }
  // Check if any nodes opens at second level
  function checkForThirdLevelOpenChildren() {
    for (rootIndex = 0, rootLength = rootJsonData.children.length; rootIndex < rootLength; rootIndex++) {
      if (isNodeOpen(rootJsonData.children[rootIndex])) {
        for (childIndex = 0, childLength = rootJsonData.children[rootIndex].children.length; childIndex < childLength; childIndex++) {
          var secondLevelChild = rootJsonData.children[rootIndex].children[childIndex];
          if (isNodeOpen(secondLevelChild)) {
            return true;
          }
        }
      }
    }
  }

  function isNodeOpen(d) {
    if (d.children) {
      return true;
    }
    return false;
  }
}
/*
 * ignore this code below - it's for webpack to know that this
 * code needs to be watched and not to append extra elements
 */
if (module.hot) {
  const duplicateNode = document.querySelector('svg');
  module.hot.accept();
  module.hot.dispose(() => {
    if (duplicateNode) {
      duplicateNode.parentNode.removeChild(duplicateNode);
    }
  });
}
