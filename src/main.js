import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';
// import data from './example';

// constants
const width = 750;
const height = 500;
const radius = Math.min(width, height) / 2;

// fetch data & render inside for static visual
d3.json('http://54.213.83.132/hackoregon/http/oregon_individual_contributors/5/', data => {
  // append our svg with constants for w, h & offsets
  const svg = d3.select('#content')
    .append('svg')
    .attr({
      width: width,
      height: height
    })
    .append('g')
    .attr('transform', 'translate(' + radius + ',' + radius + ')');

  // this example uses sort & ascending - try d3.descending
  const pie = d3.layout.pie()
    .sort((a,b) => d3.ascending(a.sum,b.sum))
    .value(d => d.sum); // choosing the data to visualize

  // arc generator function gives us a slice per datum
  const sliceOfPie = d3.svg.arc()
    .innerRadius(40) // allows us to make donuts vs pies
    .outerRadius(radius - 10)
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle);

  // a separate arc function for our labels later
  const labelArc = d3.svg.arc()
    .outerRadius(radius-60)
    .innerRadius(radius-60);

  // our color function this time uses a built in helper
  const colors = d3.scale.category20c();

  // for less string interpolations
  const translate = (a,b) => `translate(${a},${b})`;

  // formatting the money
  const formatMoney = d3.format("$,");

  // creating and appending our slices
  const group = svg.selectAll('.slice')
    .data(pie(data)) // calling the pie func on data
    .enter()
    .append('g')
    .attr("class", "slice");

  // appending the path for each slice
  group.append('path')
    .attr({
      d: sliceOfPie, // data attribute
      stroke: 'white',
      'stroke-width': 4,
      fill: (d, i) => colors(i)
    })

  // adding our labels - note how both labels are done
  group.append("text")
    .attr("transform", d => translate(...labelArc.centroid(d))) // using spread operator for 2 arguments from array
    .text(d => `${d.data.contributor_payee}`);
  group.append('text')
  .attr("transform", d => translate(labelArc.centroid(d)[0],(labelArc.centroid(d)[1]+20))) // using the centroid numbers but customizing offsets
  .text(d => `${formatMoney(d.data.sum)}`);
});
/*
 * ignore this code below - it's for webpack to know that this
 * code needs to be watched and not to append extra elements
 */
const duplicateNode = document.querySelector('svg');
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    if (duplicateNode) {
      duplicateNode.parentNode.removeChild(duplicateNode);
    }
  });
}
