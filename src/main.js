import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';
import data from './example';
const url = 'https://gist.githubusercontent.com/d3byex/25129228aa50c30ef01f/raw/2f8664d0eb75ef606f412f9647116954ff0af41d/radial.json';
d3.json(url, (error, data) => {
  console.log(data);
  const width = 600,
    height = 600,
    nodeRadius = 4.5;
  const svg = d3.select('#content')
    .append('svg')
    .attr({
      width: width,
      height: height
    });
  const radius = width / 2;
  const mainGroup = svg.append('g')
    .attr("transform", "translate(" + radius + "," + radius + ")");
  const cluster = d3.layout.cluster()
    .size([360, radius - 50]);
  const nodes = cluster.nodes(data);
  const links = cluster.links(nodes);
  const diagonal = d3.svg.diagonal.radial()
    .projection(d => {
      return [
        d.y,
        d.x / 180 * Math.PI
      ];
    });
  mainGroup.selectAll('path')
    .data(links)
    .enter()
    .append('path')
    .attr({
      'd': diagonal,
      fill: 'none',
      stroke: '#ccc',
      'stroke-width': 1
    });
  const nodeGroups = mainGroup.selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", d => {
      return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
    });
  nodeGroups.append("circle")
    .attr({
      r: nodeRadius,
      fill: '#fff',
      stroke: 'tomato',
      'stroke-width': 1.5
    });
  nodeGroups.append("text")
    .attr({
      dy: ".31em",
      'text-anchor': d => {
        return d.x < 180 ? "start" : "end";
      },
      'transform': d => {
        return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
      }
    })
    .style('font', '10px Open Sans')
    .text(d => {
      return d.name;
    });
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
