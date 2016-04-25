import d3 from 'd3';
import './assets/styles.css';
import { queue } from 'd3-queue';
// import * as d3_request from 'd3-request';
window.queue = queue;
// window.request = d3_request;

const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
};

const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x0 = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);
const x1 = d3.scale.ordinal();
const y = d3.scale.linear()
  .range([height, 0]);
const color = d3.scale.ordinal()
  .range(['RGBA(215, 59, 65, .8)', 'RGBA(252, 179, 111, .80)', 'RGBA(77, 146, 194, .80)','RGBA(182, 223, 170, 1.00)']);

const xAxis = d3.svg.axis()
  .scale(x0)
  .orient("bottom");
const yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(d3.format(".2s"));

const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // using queue to collect multiple data sets
  const collectData = new Promise((resolve, reject) => {
       queue()
         .defer(d3.json, 'http://54.213.83.132/hackoregon/http/committee_data_by_id/12498/')
         .defer(d3.json, 'http://54.213.83.132/hackoregon/http/committee_data_by_id/5591/')
         .defer(d3.json, 'http://54.213.83.132/hackoregon/http/committee_data_by_id/15089/')
         .defer(d3.json, 'http://54.213.83.132/hackoregon/http/committee_data_by_id/12456/')
         .await((err, a, b, c, d) => {
           if(err){
             reject(err);
           }
           let dataSet = [...a, ...b, ...c, ...d]; // spread operator
           resolve(dataSet);
         });
     });
//
function visualize(data) {
  // console.log(data)
  // format
  const dataSet = data.map((item) => {
    return {
      'Candidate': item.candidate_name,
      'Total': item.total,
      'Total spent': item.total_spent,
      'In State': item.instate * item.total,
      'Grassroots': item.grassroots * item.total,
    }
  });

const keyNames = d3.keys(dataSet[0])
    .filter(key => key !== 'Candidate');
  dataSet.forEach((d) => {
    d.keys = keyNames.map((key) => {
      return {
        name: key,
        value: +d[key]
      }
    });
  });
  // console.log(dataSet, keyNames);
  x0.domain(dataSet.map(d => d.Candidate));
  x1.domain(keyNames)
    .rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(dataSet, d => d3.max(d.keys, d => d.value))])

//
//   // draw axes
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "translate(0" + 50 + ")")
    .attr("y", 6)
    .attr("dy", ".5em")
    .style("text-anchor", "end")
    .text("Dollars");
//
//   // draw candidate dataset
  const candidate = svg.selectAll(".candidate")
    .data(dataSet)
    .enter()
    .append("g")
    .attr("class", "candidate")
    .attr("transform", (d) => {
      return "translate(" + x0(d.Candidate) + ",0)";
    });
  candidate.selectAll("rect")
    .data((d) => {
      return d.keys;
    })
    .enter()
    .append("rect")
    .attr("width", x1.rangeBand())
    .attr("x", (d) => {
      return x1(d.name);
    })
    .attr("y", (d) => {
      return y(d.value);
    })
    .attr("height", (d) => {
      return height - y(d.value);
    })
    .style("fill", (d) => {
      return color(d.name);
    })
    .append("text")
    .style("text-anchor","end")
    .text(d => d.value)
    .attr('y' )

//
//   // draw legend
  const legend = svg.selectAll(".legend")
    .data(keyNames.slice())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => {
      return "translate(0," + i * 20 + ")";
    });
  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);
  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 6)
    .attr("dy", ".5em")
    .style("text-anchor", "end")
    .text((d) => {
      return d;
    });
}
//
collectData // promise - not a function
  .then(value => {
    return visualize(value);
  }).then(value => {
//     // what else can we do?
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
