import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';
import data from './example';

const width  = 480;
const height = 250;
const radius = Math.min(width, height) / 2;
const color  = d3.scale.category20();

const pie    = d3.layout.pie()
                .value(d => d.apples)
                .sort(null);

const arc    = d3.svg.arc()
              .innerRadius(radius - 10)
              .outerRadius(radius - 40);

const svg    = d3.select("#content").append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


let path     = svg.datum(data).selectAll("path")
              .data(pie)
              .enter().append("path")
              .attr("fill", (d, i) => color(i))
              .attr("d", arc)
              .each(function(d){ return this._current = d; }); // store the initial angles

d3.selectAll("input").on("change", change);

const timeout = setTimeout(() => d3.select("input[value=\"oranges\"]").property("checked", true).each(change), 2000);

function change() {
  const value = this.value;
  clearTimeout(timeout);
  pie.value(d => d[value]); // change the value function
  path = path.data(pie); // compute the new angles
  path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  const i = d3.interpolate(this._current, a);
  this._current = i(0);
  return (t) => arc(i(t));
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
