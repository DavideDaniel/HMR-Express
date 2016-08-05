import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';
import data from './example';

// constants
const width = 1000;
const height = 400;
const margin = {
  top: 10,
  left: 80,
  bottom: 10,
  right: 200
};
const nodeRadius = 6;

// basic svg appended
const svg = d3.select('#content')
  .append('svg')
  .attr({
    width: width,
    height: height
  });

// layout for tree
const tree = d3.layout.tree()
  .size(
    [height - (margin.bottom + margin.top),
      width - (margin.left + margin.right)
    ]);

// tree has nodes (elements or people etc..)
const nodes = tree.nodes(data);
// & links(relationships)
const links = tree.links(nodes);

// diagonal cubic Bézier path generator to connect nodes + links
const diagonal = d3.svg.diagonal()
  .projection(datum => [datum.y, datum.x]);

// because I hate writing out string interpolations
const translate = (a, b) => `translate(${a},${b})`;

// start drawing the links group first
const linksGroup = svg.append('g')
  .attr('transform', translate(margin.left, margin.top))

// it is important to draw our links path first
linksGroup.selectAll('path')
  .data(links)
  .enter()
  .append('path', 'g')
  .attr({
    d: diagonal, // path data is generated with diagonal
    fill: 'none',
    stroke: 'cornflowerblue',
    'stroke-width': 1
  });
// try switching them to see what happens and think about why that happened

// draw the nodes group next
const nodesGroup = linksGroup.selectAll('g')
  .data(nodes)
  .enter()
  .append('g')
  .attr('transform', datum => translate(datum.y, datum.x));

// append a shape for the nodes themselves
nodesGroup.append('circle') // you can choose other shapes
  .attr({
    r: nodeRadius, // radius is determined by our constant
    fill: '#fff',
    stroke: 'tomato',
    'stroke-width': 1
  });

// append labels next
nodesGroup.append('text')
  .text(datum => datum.name)
  .attr('y', datum => datum.children ? (-nodeRadius * 2) : (nodeRadius))
  .attr('x', datum => datum.children ? 0:(nodeRadius+3))
  .attr('text-anchor', datum => datum.children ? 'middle':'left')
  // we use our nodeRadius constant to calculate offsets for the labels & whether they are children to adjust location of labels




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