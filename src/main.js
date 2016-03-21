import d3 from 'd3';
import _ from 'lodash';
import './assets/styles.css';

// using lodash for random data
const dataSet = _.map(_.range(25), () => {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    radius: Math.random() * 40
  };
});

// all d3 code below
const margin = {
  top: 0,
  right: 0,
  bottom: 20,
  left: 50
};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#content').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

const yScale = d3.scale.linear()
  .domain([0, d3.max(dataSet, data => {
    return data.y;
  })])
  .range([height, 0]);

const xScale = d3.scale.linear()
  .domain([0, 100])
  .range([0, width]);

svg.selectAll('circle')
  .data(dataSet)
  .enter()
  .append('circle')
  .attr('class', 'bubble')
  .attr('cx', data => {
    return xScale(data.x);
  })
  .attr('cy', data => {
    return yScale(data.y);
  })
  .attr('r', data => {
    return data.radius;
  });


/*
* ignore this code below - it's for webpack to know that this
* code needs to be watched and not to append extra elements
*/
const duplicateNode = document.querySelector('svg');
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    duplicateNode.parentNode.removeChild(duplicateNode);
  });
}