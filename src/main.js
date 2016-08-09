import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';
import data from './example';
// constants
const width = 500;
const height = 800;
const nodeRadius = 4;
const margin = {
  top: 60,
  left: 80,
  bottom: 60,
  right: 200
};
const radius = width / 2;
// basic svg appended
const svg = d3.select('#content')
  .append('svg')
  .attr({
    width: width,
    height: height
  });
const mainGroup = svg.append('g')
  .attr("transform", "translate(" + radius + "," +
    radius + ")");

// layout for tree
const cluster = d3.layout.cluster()
  .size([
    270,
    radius - 30
  ]);
// tree has nodes (elements or people etc..)
const nodes = cluster.nodes(data);
// & links(relationships)
const links = cluster.links(nodes);
// diagonal cubic Bézier path generator to connect nodes + links
const diagonal = d3.svg.diagonal.radial()
  .projection(d => {
    return [d.y,
      d.x / 180 * Math.PI
    ];
  });
// because I hate writing out string interpolations
const translate = (a, b) => `translate(${a},${b})`;
mainGroup.selectAll('path')
  .data(links)
  .enter()
  .append('path')
  .attr({
    d: diagonal, // path data is generated with diagonal
    fill: 'none',
    stroke: 'cornflowerblue',
    'stroke-width': 1
  });
const nodeGroups = mainGroup.selectAll("g")
  .data(nodes)
  .enter()
  .append("g")
  .attr("transform", function (d) {
    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
  });
nodeGroups.append("circle")
  .attr({
    r: nodeRadius, // radius is determined by our constant
    fill: '#fff',
    stroke: 'tomato',
    'stroke-width': 1
  });
nodeGroups.append('text')
  .text(datum => datum.name)
  .attr({
    dy: '.31em',
    // y: datum => datum.children ? (-nodeRadius * 2) : (nodeRadius),
    // x: datum => datum.children ? 0 : (nodeRadius + 3),
  'text-anchor': datum => datum.x < 180 ? 'start' : 'end',
  'transform': datum => {
        return datum.x < 180 ?
          'translate(' + (nodeRadius * 4) + ')' :
          'rotate(180)' +
          'translate(' + (-nodeRadius * 3) + ')';
      }
    });

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
