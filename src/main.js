import d3 from 'd3';
import './assets/normalize.css';
import './assets/styles.css';

// url to be changed
let URL = 'http://54.213.83.132/hackoregon/http/state_sum_by_date/_/';

// variables for data
let DATA_SET;
let DATA_SET_WEEK;

// container
const container = document.getElementById('content');

// margin values
const margin = {
  top: 20,
  right: 50,
  bottom: 30,
  left: 70
};

// setting the width & height
const width = container.clientWidth - margin.left - margin.right;
const height = container.clientHeight - margin.top - margin.bottom;

// svg function
const svg = d3
  .select('#content')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// line function
const line = d3.svg.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.amount))
  .interpolate('linear');

// functions for scale
const xScale = d3.time.scale()
  .range([0, width]);
const yScale = d3.scale.linear()
  .range([height - 2, 0]);

// functions for the axes
const xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom')
const yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left')
  .ticks(10);

// parse into date, sort dates
const parseDate = d3.time.format('%Y-%m-%d').parse;
const sortByDates = (a, b) => (a.date - b.date);

// fetch function
const getData = async(id) => {
  // ternary
  //  if id is truthy ? true return value : false return value; -- similar to if else
  URL = id ? `http://54.213.83.132/hackoregon/http/current_candidate_transactions_out/${id}/` : 'http://54.213.83.132/hackoregon/http/state_sum_by_date/_/';
  const fetchedData = await $.getJSON(URL);
  DATA_SET = await formatData(fetchedData);
  DATA_SET_WEEK = await groupByWeeks(DATA_SET);
  return DATA_SET;
}

// functions to format the data
const formatData = (data) => data.map(item => ({
    date: parseDate(item.tran_date),
    amount: item.total_out || item.amount
  }))
  .sort(sortByDates);

const groupByWeeks = (data) => {
  const minDate = data[0].date;
  const maxDate = data[data.length - 1].date;
  const weeks = d3.time.weeks(minDate, maxDate);
  let weeklyArr = [];
  for (let i = 0; i < weeks.length; i++) {
    let week = {
      amount: 0,
      date: weeks[i]
    };
    const range = moment.range(weeks[i], weeks[i + 1]);
    for (let j = 0; j < data.length; j++) {
      if (moment(data[j].date)
        .within(range)) {
        week.amount += data[j].amount;
      }
    }
    weeklyArr.push(week);
  }
  DATA_SET_WEEK = weeklyArr;
  return DATA_SET_WEEK;
}

// function to visualize the data
const visualize = (data, opt) => {
  const dates = data.map(d => d.date);
  const amounts = data.map(d => d.amount);

  yScale.domain(d3.extent(amounts));
  xScale.domain(d3.extent(dates));

  const updateSvg = d3.select('#content')
    .transition();
  updateSvg.select('.line')
    .duration(1000)
    .attr('d', line(data));
  updateSvg.select('.x.axis')
    .duration(1000)
    .call(xAxis)
  updateSvg.select('.y.axis')
    .duration(1000)
    .call(yAxis);
}

const visualizeWithChoice = (data) => {
  if(data){
    DATA_SET = data;
    DATA_SET_WEEK = groupByWeeks(data);
  }
  switch ($('select option:selected')
    .val()) {
  case 'Days':
    return visualize(DATA_SET);
  case 'Weeks':
    return visualize(DATA_SET_WEEK);
  default:
  }
}


// initial appending of svg and data
d3.json(URL, json => {
    const data = formatData(json);
    svg.append('path')
      .attr('class', 'line')
      .attr('d', line(data));
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);
    return visualizeWithChoice(data);
  });

// functions for the page interactions
$('#options')
  .on('change', (event, index, value) => {
    return visualizeWithChoice();
  });

$('#allState')
  .on('click', async () => {
    try {
      await getData();
      return visualizeWithChoice();
    } catch (e) {
      console.error(e);
    } finally {
      return $('#filerId')
        .val('');
    }
  });

$('#submitFiler')
  .on('click', async () => {
    try {
      const $filerId = await $('#filerId');
      const filerId = await $filerId.val();
      if(filerId){
        await getData(filerId);
        return visualizeWithChoice();
      } else {
        alert('Must have an id');
      }
    } catch (e) {
      console.error(e)
    } finally {
      // return visualizeWithChoice();
      return $('#filerId')
        .val('');
    }
  });