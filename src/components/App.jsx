import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import code from './code'
import d3 from 'd3';
import _ from 'lodash'
// import DataVisuals from './DataVisuals.jsx'

const dataset = _.map(_.range(25), function (i) {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    radius: Math.random() * 20
  };
}); // using underscore for random data for now
import React, { PropTypes } from 'react'

const App = React.createClass({
  initCode : () => {
    this.visual = d3.select(ReactDOM.findDOMNode(this)).insert("svg:svg").append("svg:g")

  }

  componentDidMount = () => {
    debugger
    this.initCode();
  }

  renderCode = () => {

    // return <div>{coded}</div>
  }

  render = () => {
    return(
      <div/>
    )
  }
})

export default App

// class App extends Component {
//   constructor(props){
//     super(props)
//     this.renderCode = this.renderCode.bind(this)
//   }

// }

// export default App;