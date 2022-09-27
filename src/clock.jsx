import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

class Clock extends Component {
  state = {
    breakTimer: { time: { m: 0, s: 0 }, seconds: 0 },
    sessionTimer: { time: { m: 0, s: 0 }, seconds: 0 },
    breakLength: 1,
    sessionLength: 1,
    timerLabel: true,
    startStopFlag: true,
  };

  newintervalId = 0;

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
    let breakTimeTracker = this.state.breakTimer.seconds;
    let sessionTimeTracker = this.state.sessionTimer.seconds;
    console.log("1", timerLabel, breakTimeTracker, sessionTimeTracker);

    if (!timerLabel) breakTimeTracker -= 1;
    else sessionTimeTracker -= 1;
    console.log("2", timerLabel, breakTimeTracker, sessionTimeTracker);

    if (breakTimeTracker == 0) {
      timerLabel = true;
      breakTimeTracker = this.state.breakLength * 60;
    } else if (sessionTimeTracker == 0) {
      timerLabel = false;
      sessionTimeTracker = this.state.sessionLength * 60;
    }
    console.log("3", timerLabel, breakTimeTracker, sessionTimeTracker);

    this.setState({
      sessionTimer: {
        time: this.secondsToTime(sessionTimeTracker),
        seconds: sessionTimeTracker,
      },
      breakTimer: {
        time: this.secondsToTime(breakTimeTracker),
        seconds: breakTimeTracker,
      },
      timerLabel,
    });

    // Check if we're at zero.
  };

  componentDidMount = () => {
    let sessiomTimeLeftVar = this.secondsToTime(this.state.sessionLength * 60);
    let breakTimeLeftVar = this.secondsToTime(this.state.breakLength * 60);
    this.setState({
      sessionTimer: {
        time: sessiomTimeLeftVar,
        seconds: this.state.sessionLength,
      },
      breakTimer: {
        time: breakTimeLeftVar,
        seconds: this.state.breakLength,
      },
    });
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
    let breakLength = this.state.breakLength;
    let sessionLength = this.state.sessionLength;
    if (value == "B+" && breakLength < 60) breakLength += 1;
    else if (value == "B-" && breakLength > 0) breakLength -= 1;
    else if (value == "S+" && sessionLength < 60) sessionLength += 1;
    else if (value == "S-" && sessionLength > 0) sessionLength -= 1;
    console.log(breakLength, this.state.breakLength);

    this.setState((prevState) => {
      prevState.breakTimer.time = this.secondsToTime(breakLength * 60);
      prevState.sessionTimer.time = this.secondsToTime(sessionLength * 60);
      prevState.breakTimer.seconds = breakLength * 60;
      prevState.sessionTimer.seconds = sessionLength * 60;
      prevState.breakLength = breakLength;
      prevState.sessionLength = sessionLength;
      return prevState;
    });
  };

  handleReset = () => {
    let sessiomTimeLeftVar = this.secondsToTime(1500);
    let breakTimeLeftVar = this.secondsToTime(300);
    clearInterval(this.newIntervalId);
    this.setState({
      sessionTimer: { time: sessiomTimeLeftVar, seconds: 1500 },
      breakTimer: { time: breakTimeLeftVar, seconds: 300 },
      breakLength: 5,
      sessionLength: 25,
      timerLabel: true,
      startStopFlag: true,
    });
  };

  render() {
    const { sessionTimer, breakTimer, timerLabel, breakLength, sessionLength } =
      this.state;
    let renderingValue = "";
    if (timerLabel) {
      renderingValue = sessionTimer;
    } else {
      renderingValue = breakTimer;
    }

    return (
      <div id="container">
        <div id="break-label">{breakLength}</div>
        <div id="session-label">{sessionLength}</div>
        <button
          value="B+"
          onClick={this.handleIncrementDecrement}
          className="btn btn-primary m-1"
          id="break-decrement"
        >
          Break +
        </button>
        <button
          value="B-"
          onClick={this.handleIncrementDecrement}
          className="btn btn-primary m-1"
          id="break-increment"
        >
          Break -
        </button>
        <button
          value="S-"
          onClick={this.handleIncrementDecrement}
          className="btn btn-primary m-1"
          id="session-decrement"
        >
          Session -
        </button>
        <button
          value="S+"
          onClick={this.handleIncrementDecrement}
          className="btn btn-primary m-1"
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
