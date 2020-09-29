import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

/*
* A simple React component
*/
const initState = {
  breakLength: 0.5,
  sessionLength: 0.5,
  init: "session",
  // stateIndex: 0,
  timeLeft: undefined,
  timeLeftSeconds: undefined,
  started: false,
  intervalFunc: undefined
};

const secondsToMins = (time) => {
  let converted =
  ("0" + Math.floor(time / 60)).slice(-2) +
  ":" +
  ("0" + Math.floor(time % 60)).slice(-2);
  return converted;
};

// timeLeftSeconds is initialized to sessionLength and then is decreased
// until 0 at which point timeLeftSeconds is set to breakLength
// unitl 0 at which point timeLeftSeconds is set to session.
// This cycle is non-stop, and there is a bell sound that plays
// everytime timeLeftSeconds reaches 0.

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = initState;
    this.breakDecrement = this.breakDecrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.startStop = this.startStop.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    let sessionSeconds = this.state.sessionLength * 60;
    this.setState({ timeLeftSeconds: sessionSeconds });
    this.setState({ timeLeft: secondsToMins(sessionSeconds) });
  }

  breakDecrement() {
    console.log("break decrement");
    // decrements the breakLength which does not show seconds
    let breakLength = this.state.breakLength - 1;
    if (breakLength > 0 && breakLength < 61) {
      this.setState({ breakLength: breakLength });
    }
  }

  breakIncrement() {
    // same as decrement except does increment
    let breakLength = this.state.breakLength + 1;
    if (breakLength > 0 && breakLength < 61) {
      this.setState({ breakLength: breakLength });
    }
  }

  sessionDecrement() {
    // decrements the sessionLength
    // timeLeftSeconds is used to countdown
    let sessionLength = this.state.sessionLength - 1;
    if (sessionLength > 0 && sessionLength < 61) {
      this.setState((prevState) => ({
        sessionLength: prevState.sessionLength - 1,
        timeLeftSeconds: (prevState.sessionLength - 1) * 60,
        timeLeft: secondsToMins((prevState.sessionLength - 1) * 60)
      }));
    }
  }

  sessionIncrement() {
    // same as decrement except does increment
    let sessionLength = this.state.sessionLength + 1;
    if (sessionLength > 0 && sessionLength < 61) {
      this.setState((prevState) => ({
        sessionLength: prevState.sessionLength + 1,
        timeLeftSeconds: (prevState.sessionLength + 1) * 60,
        timeLeft: secondsToMins((prevState.sessionLength + 1) * 60)
      }));
    }
  }

  startStop(id) {
    // starts the countDown, which runs continuously until the
    // start/stop button is pressed again, which pauses the countdown.
    // the id parameter is used by countDown to play the audio beep
    if (!this.state.started) {
      this.setState({ started: true });
      this.countDown(id);
    }
    // pauses the countDown
    if (this.state.started) {
      this.setState({ started: false });
      let intervalFunc = this.state.intervalFunc;
      clearInterval(intervalFunc);
    }
  }

  reset() {
    let sound = document.getElementById('beep');
    sound.pause();
    sound.currentTime = 0;
    let intervalFunc = this.state.intervalFunc;
    clearInterval(intervalFunc);

    // reset state to default values
    this.setState({ breakLength: 5 });
    this.setState({ sessionLength: 25 });
    this.setState({ init: "session" });
    this.setState({ timeLeftSeconds: 1500 });
    this.setState({ timeLeft: "25:00" });
    this.setState({ started: false });
    this.setState({ intervalFunc: undefined });
  }

  decreaseCurrentSecond = () =>
  {
    this.setState({
      timeLeftSeconds: this.state.timeLeftSeconds - 1
    });
    return this.state.timeLeftSeconds;
  };

  countDown(id) {
    // set the function to a variable and set state to it
    // so the intervalFunc can be paused with clearInterval()
    var intervalFunc = setInterval(
      () => down(this.decreaseCurrentSecond()),
      1000
    );
    this.setState({ intervalFunc: intervalFunc });

    const down = (time) => {
      if (time > 0) {
        // converts seconds to MM:SS at every t-minus
        this.setState({ timeLeft: secondsToMins(time) });
      }

      let sound = document.getElementById(id).childNodes[0];

      if (time <= 0) {
        sound.play();
        this.setState({ timeLeft: secondsToMins(time) });

        this.setState({
          init: this.state.init === "session" ? "break" : "session"
        });
        this.setState({
          timeLeftSeconds:
          this.state.init === "session"
          ? this.state.sessionLength * 60 + 1
          : this.state.breakLength * 60 + 1
        });
      }
    };
  }

  render() {
    return (
      <div id="clock">
      <h1 id="title">25-5 Clock</h1>

      <div>
      <p id="break-label">Break Length</p>
      <p id="break-length">{this.state.breakLength}</p>
      <button id="break-decrement" onClick={(e) => this.breakDecrement()}>
      {" "}
      Decrease{" "}
      </button>
      <button id="break-increment" onClick={(e) => this.breakIncrement()}>
      {" "}
      Increase{" "}
      </button>
      </div>

      <div>
      <p id="session-label">Session Length</p>
      <p id="session-length">{this.state.sessionLength}</p>
      <button
      id="session-decrement"
      onClick={(e) => this.sessionDecrement()}
      >
      {" "}
      Decrease{" "}
      </button>
      <button
      id="session-increment"
      onClick={(e) => this.sessionIncrement()}
      >
      {" "}
      Increase{" "}
      </button>
      </div>

      <hr />

      <div>
      <p id="timer-label">{this.state.init}</p>
      <p id="time-left">{this.state.timeLeft}</p>
      <button id="start_stop" onClick={(e) => this.startStop(e.target.id)}>
      <audio id="beep" src="./beep.mp3"></audio> start/stop{" "}
      </button>
      <button id="reset" onClick={(e) => this.reset()}>
      {" "}
      reset{" "}
      </button>
      </div>
      </div>
    );
  }
}

/*
* Render the above component into the div#app
*/
ReactDOM.render(<Clock />, document.getElementById("app"));
