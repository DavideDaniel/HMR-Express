import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';
const colorBlend = d3.interpolateRgb('#CDF3F2', '#08519c');

function donorPercent(amount,donors) {
  // at 0 it should be size: 0%, color: #fff
  if(!amount) {
    return  {
      size: '0%',
      color: '#fff'
    }
  }

  //  value of the highest donor
  let donorMax = d3.max(donors, d => d.value);
  console.log(donorMax);
  let donorSize = d3.scale.linear().domain([0,donorMax]).range([0,1]);
  console.log(donorSize);

  return {
    size: `${100 * donorSize(amount)}%`,
    color: colorBlend(donorSize(amount))
  }

  // % for size
  // size: '100%'
  // color
  // color: '#08519c'

}

// dummy data

const donors = [
  {"name":"John Arnold","value":2750000},
  {"name":"Michael Bloomberg","value":2385000},
  {"name":"Loren Parks","value":896800},
  {"name":"Connie Ballmer","value":505000},
  {"name":"Tom Hormel","value":500000},

];
// {"name":"John K", "value":25}
console.log(donorPercent(250000, donors));


