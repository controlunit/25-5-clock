import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

const initState = {
  breakLength: '5.00',
  sessionLength: '25.00',
  init: 'session',
  timeLeft: '25.00'
}

class Clock extends React.Component {

  constructor(props) {
    super(props);
    this.state = initState;
    this.display = this.display.bind(this);
    this.clear = this.clear.bind(this);
  }

  display(text){

  }

  calculate(displayed){

  }

  clear(){
    this.setState({});
  }

  render() {
    return (
      
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("app"));
