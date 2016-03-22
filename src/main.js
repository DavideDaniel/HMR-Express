import d3 from 'd3';
import _ from 'lodash';
import './assets/styles.css';
import $ from 'jquery';

// using lodash for random data
const dataSet = _.map(_.range(25), () => {
  return {
    x: Math.round(Math.random() * 100),
    y: Math.round(Math.random() * 100),
    radius: Math.round(Math.random() * 40)
  };
});

const newDate = '03-21-16'
let formattedDate = d3.time.format('%m-%d-%y').parse(newDate);
console.log(formattedDate)
$('#change').on('click', changeData);

function changeData(){
  dataSet.forEach(datum =>{
    datum.x = Math.round(Math.random() * 100);
    datum.y = Math.round(Math.random() * 100);
    datum.radius = Math.round(5 + Math.random() * 40);
  })
  svg.selectAll('circle')
    .transition()
    .duration(1000)
    .attr('cx', function(data) {
      return xScale(data.x);
    })
    .transition()
    .duration(1000)
    .attr('cy', function(data) {
      return yScale(data.y);
    })
    .style('fill', 'cornflowerBlue')
    .transition()
    .duration(1000)
    .attr('r', function(data) {
      return data.radius;
    })
    .style('fill', 'tomato');
}

// all d3 code below

var margin = {top: 20, right: 20, bottom: 60, left: 40};

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select('#content').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')'); // transform the x,y value with translate

var yScale = d3.scale.linear()
  .domain([0, d3.max(dataSet, function(data) {
    return data.y;
  })])
  .range([height, 0]);

var xScale = d3.scale.linear()
  .domain([0, 100])
  .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(10)
    .innerTickSize(10)
    .outerTickSize(10)
    .tickPadding(10);

svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, '+ (height + 10) + ')') // moved to height + 10 pixels
  .call(xAxis);

  var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left')
  .ticks(5)
  .innerTickSize(10)
  .outerTickSize(2)
  .tickPadding(10);

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(0, '+ 10 + ')') // moved to height + 10 pixels
    .call(yAxis);

svg.selectAll('circle')
  .data(dataSet)
  .enter()
  .append('circle') // creating circles
  .attr('class', 'bubble')
  .attr('cx', function(data) { // determining the center point x value
    return xScale(data.x);
  })
  .attr('cy', function(data) { // determining the center point y value
    return yScale(data.y);
  })
  .attr('r', function(data) { // determining the radius of the circle
    return data.radius;
  })
  .on('mouseover', function(d){
    d3.select(this).classed('highlight', true);
  })
  .on('mouseout', function(d){
    d3.select(this).classed('highlight',false);
  })

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