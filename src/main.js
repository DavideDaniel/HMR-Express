import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';
import data from './example';

const width = 960,
  height = 500,
  nodeRadius = 10,
  margin = {
    left: 50,
    top: 10,
    bottom: 10,
    right: 40
  };

const svg = d3.select('body')
  .append("svg")
  .attr({
    width: width,
    height: height
  });

const mainGroup = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ')');

const tree = d3.layout.tree()
  .size([
    height - (margin.bottom + margin.top),
    width - (margin.left + margin.right),
  ]);

const nodes = tree.nodes(data);

const links = tree.links(nodes);

const diagonal = d3.svg.diagonal()
  .projection(datum => {
    return [datum.y, datum.x];
  });

mainGroup.selectAll('path')
  .data(links)
  .enter()
  .append('path', 'g')
  .attr({
    d: diagonal,
    fill: 'none',
    stroke: 'cornflowerblue',
    'stroke-width': 1
  });
const circleGroups = mainGroup.selectAll('g')
  .data(nodes)
  .enter()
  .append('g')
  .attr('transform', datum => {
    return 'translate(' + datum.y + ',' + datum.x + ')';
  });
circleGroups.append('circle')
  .attr({
    r: nodeRadius,
    fill: '#fff',
    stroke: 'tomato',
    'stroke-width': 1,
  });
circleGroups.append('text')
  .text(datum => {
    return datum.name;
  })
  .attr('y', datum => {
    return datum.children || datum._children ?
      -nodeRadius * 2 : nodeRadius * 2;
  })
  .attr({
    dy: '.35em',
    'text-anchor': 'middle',
    'fill-opacity': 1
  })
  .style('font', '12px Open Sans');
