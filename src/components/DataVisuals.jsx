import React, {PropTypes} from 'react'
import d3 from 'd3';

const dataset = _.map(_.range(25), function(i) {
return {
  x: Math.random() * 100,
  y: Math.random() * 100,
  radius: Math.random() * 20
};
}); // using underscore for random data for now

  const margin = {
top: 0,
right: 0,
bottom: 20,
left: 40
};

const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#chart').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')'); // transform the x,y value with translate

  const yScale = d3.scale.linear().domain([
0,
d3.max(dataset, function(data) {
  return data.y;
})
]).range([height, 0]);

const xScale = d3.scale.linear().domain([0, 100]).range([0, width]);

svg.selectAll('circle').data(dataset).enter().append('circle'). // creating circles
  attr('class', 'bubble').attr('cx', function(data) { // determining the center point x value
return xScale(data.x);
}).attr('cy', function(data) { // determining the center point y value
return yScale(data.y);
}).attr('r', function(data) { // determining the radius of the circle
return data.radius;
});

const VisualCode = () => {
  return (
    <div id='chart'></div>
    );
}

export default VisualCode;
