import 'babel-polyfill';
import d3 from 'd3';
import _ from 'lodash';
import './assets/styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

ReactDOM.render(<App />, document.getElementById('content'));