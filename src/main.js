import d3 from 'd3';
import './assets/styles.css';
import { queue } from 'd3-queue';
// import * as d3_request from 'd3-request';
window.queue = queue;
// window.request = d3_request;
// const collectData = new Promise((resolve, reject) => {
//      queue()
//        .defer(d3.csv, './hackORVolunteers.csv')
//        .await((err, a) => {
//          if(err){
//            reject(err);
//          }
//          let dataSet = [...a]; // spread operator
//          resolve(dataSet);
//        });
//    });

// collectData.then(value => {
//   console.log(value);
// })

d3.csv('./hackORVolunteers.csv', function(d){
  console.log(d)
   return {
     response: d["What motivated you most to volunteer with Hack Oregon?"].split(',')
     }
   }, function(err,rows){
   var hashSet = {}
   var num = 0;

   for (var i = 0; i < rows.length; i++) {
     var response = rows[i].response;
     for (var j = 0; j < response.length; j++) {
       var answer = response[j].trim();
       if(!Object.keys(hashSet).includes(answer)){
         hashSet[answer] = 1;
       } else {
         hashSet[answer] = hashSet[answer]+1;
       }
     }
   }
   console.log(hashSet)
});
  //  var dataSet = Object.keys(hashSet).map(function(item){
  //    if (key);
  //  })



  // var data = d3.csv.parse('hackORVolunteers.csv');

// //get variable names
//   var keys = d3.keys(data[0]);
//               var namesTitle = keys[0];
//               var valuesTitle = keys[1];
//
//               //accessing the properties of each object with the variable name through its key
//               var values = function(d) {return +d[valuesTitle];};
//               var names = function(d) {return d[namesTitle];}
// console.log(dirtyCSV);
// var height = 250; // set vars for height & width
// var width = 600;
//
// var yScale = d3.scale.linear()
//   .domain([0, d3.max(dataSet)*1.1]) // domain now with d3.max
//   .range([0, height]) // set yScale linear
// var xScale = d3.scale.ordinal() // orders
//   .domain(dataSet)
//   .rangeBands([0, width], 0.25, 0.25); // (width of data), padding between, padding outside
//
//   var colorScale = d3.scale.linear() // linear - min / max
//   //.domain([0,d3.max(dataSet)]) // for data based
//   .domain([0,dataSet.length]) // for position based
//   .range(['tomato','cornflowerBlue'])
//
// var svg = d3.select('#barChart').append('svg')
//   .attr('width', width)
//   .attr('height', height)
//
// svg.selectAll('rect')
//   .data(dataSet)
//   .enter()
//   .append('rect')
//   .attr('class', 'bar')
//   .attr('x', function(data, index) {
//     return xScale(data) // using xScale on data
//   })
//   .attr('y', function(data) {
//     return height - yScale(data) // using yScale on data
//   })
//   .attr('width', xScale.rangeBand) // width determined by xScale.rangeBand
//   .style('height', function(data) {
//     return yScale(data) // height determined by yScale
//   })
//   .attr('fill', function(data,i) {
//    // return colorScale(data) // for data based
//     return colorScale(i) // for position based
//   })
// });
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
