import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

class Clock extends Component {
  state = {
    breakTimer: { m: 0, s: 0 },
    sessionTimer: { m: 0, s: 0 },
    timer: 0,
    breakLength: 5,
    sessionLength: 25,
    timerLabel: true, //true indicate session and false indicates break
    startStopFlag: true, // set to true if start or to false if stop.
  };

  newintervalId = 0;

  //initiate values of timer on load
  componentDidMount = () => {
    this.setState({
      sessionTimer: this.secondsToTime(this.state.sessionLength * 60),
      breakTimer: this.secondsToTime(this.state.breakLength * 60),
      timer: this.state.sessionLength * 60,
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.breakLength !== this.state.breakLength)
      this.setState({
        breakTimer: {
          time: this.secondsToTime(this.state.breakLength * 60),
          seconds: this.state.breakLength * 60,
        },
      });
    if (prevState.sessionLength !== this.state.sessionLength)
      this.setState({
        sessionTimer: {
          time: this.secondsToTime(this.state.sessionLength * 60),
          seconds: this.state.sessionLength * 60,
        },
      });
  };

  handleStartStop = () => {
    if (this.state.startStopFlag) {
      this.newIntervalId = setInterval(this.countDown, 1000);
    } else clearInterval(this.newIntervalId);
    this.setState({
      startStopFlag: !this.state.startStopFlag,
    });
  };

  countDown = () => {
    // Remove one second, set state so a re-render happens.
    let timerLabel = this.state.timerLabel;
    let breakTimeTracker = { ...this.state.breakTimer };
    let sessionTimeTracker = { ...this.state.sessionTimer };
    console.log(
      "1",
      timerLabel,
      breakTimeTracker.seconds,
      sessionTimeTracker.seconds
    );

    if (timerLabel === false) this.setState({ breakLength });
    else sessionTimeTracker.seconds -= 1;
    console.log(
      "2",
      timerLabel,
      breakTimeTracker.seconds,
      sessionTimeTracker.seconds
    );

    if (breakTimeTracker.seconds < 0) {
      timerLabel = true;
      breakTimeTracker.seconds = this.state.breakLength * 60;
    } else if (sessionTimeTracker.seconds < 0) {
      timerLabel = false;
      sessionTimeTracker.seconds = this.state.sessionLength * 60;
    }
    console.log(
      "3",
      timerLabel,
      breakTimeTracker.seconds,
      sessionTimeTracker.seconds
    );

    this.setState({
      sessionTimer: {
        time: this.secondsToTime(sessionTimeTracker.seconds),
        seconds: sessionTimeTracker.seconds,
      },
      breakTimer: {
        time: this.secondsToTime(breakTimeTracker.seconds),
        seconds: breakTimeTracker.seconds,
      },
      timerLabel,
    });

    // Check if we're at zero.
  };

  secondsToTime = (secs) => {
    // let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(secs / 60);

    let divisor_for_seconds = secs % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      m: minutes,
      s: seconds,
    };
    return obj;
  };

  handleIncrementDecrement = ({ currentTarget }) => {
    const value = currentTarget.value;
    const breakLength = this.state.breakLength;
    const sessionLength = this.state.sessionLength;
    if (value === "B+" && breakLength < 60)
      this.setState({ breakLength: this.state.breakLength + 1 });
    else if (value === "B-" && breakLength > 1)
      this.setState({ breakLength: this.state.breakLength - 1 });
    else if (value === "S+" && sessionLength < 60)
      this.setState({ sessionLength: this.state.sessionLength + 1 });
    else if (value === "S-" && sessionLength > 1)
      this.setState({ sessionLength: this.state.sessionLength - 1 });

    // this.setState((prevState) => {
    //   prevState.breakTimer.time = this.secondsToTime(breakLength * 60);
    //   prevState.sessionTimer.time = this.secondsToTime(sessionLength * 60);
    //   prevState.breakTimer.seconds = breakLength * 60;
    //   prevState.sessionTimer.seconds = sessionLength * 60;
    //   prevState.breakLength = breakLength;
    //   prevState.sessionLength = sessionLength;
    //   return prevState;
    // });
  };

  handleReset = () => {
    clearInterval(this.newIntervalId);
    let sessiomTimeLeftVar = this.secondsToTime(1500);
    let breakTimeLeftVar = this.secondsToTime(300);
    this.setState({
      sessionTimer: { time: sessiomTimeLeftVar, seconds: 25 * 60 },
      breakTimer: { time: breakTimeLeftVar, seconds: 5 * 60 },
      breakLength: 5,
      sessionLength: 25,
      timerLabel: true,
      startStopFlag: true,
    });
    console.log(this.state);
  };

  render() {
    const {
      sessionTimer,
      breakTimer,
      timerLabel,
      breakLength,
      sessionLength,
      startStopFlag,
    } = this.state;
    let renderingValue = "";
    if (timerLabel) {
      renderingValue = sessionTimer;
    } else {
      renderingValue = breakTimer;
    }

    const renderClass = !startStopFlag ? "disabled" : null;

    return (
      <div id="container">
        <div id="break-label">Break Length</div>
        <div id="session-label">Session Length</div>
        <div id="break-length">{breakLength}</div>
        <div id="session-length">{sessionLength}</div>
        <button
          value="B+"
          onClick={this.handleIncrementDecrement}
          className={"btn btn-primary m-1 " + renderClass}
          id="break-decrement"
        >
          Break +
        </button>
        <button
          value="B-"
          onClick={this.handleIncrementDecrement}
          className={"btn btn-primary m-1 " + renderClass}
          id="break-increment"
        >
          Break -
        </button>
        <button
          value="S-"
          onClick={this.handleIncrementDecrement}
          className={"btn btn-primary m-1 " + renderClass}
          id="session-decrement"
        >
          Session -
        </button>
        <button
          value="S+"
          onClick={this.handleIncrementDecrement}
          className={"btn btn-primary m-1 " + renderClass}
          id="session-increment"
        >
          Session +
        </button>
        <div id="timer-label">{timerLabel ? "Session" : "Break"}</div>
        <div id="time-left">
          {(renderingValue.time.m < 10
            ? "0" + renderingValue.time.m
            : renderingValue.time.m) +
            ":" +
            (renderingValue.time.s < 10
              ? "0" + renderingValue.time.s
              : renderingValue.time.s)}
        </div>
        <button
          onClick={this.handleStartStop}
          className="btn btn-danger m-1"
          id="start_stop"
        >
          Start/Stop
        </button>
        <button
          className="btn btn-warning"
          id="reset"
          onClick={this.handleReset}
        >
          Reset
        </button>
      </div>
    );
  }
}

export default Clock;
