import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

class Clock extends Component {
  state = {
    timer: 1500,
    breakLength: 5,
    sessionLength: 25,
    timerLabel: "Session",
    startFlag: false, // set to true if running or to false if paused.
  };

  newintervalId = 0;

  //initiate values of timer on load

  handleStartStop = () => {
    if (!this.state.startFlag) {
      this.newIntervalId = setInterval(() => this.countDown(), 1000);
    } else clearInterval(this.newIntervalId);

    this.setState({
      startFlag: !this.state.startFlag,
    });
  };

  countDown = () => {
    // Remove one second, set state so a re-render happens.
    const timerLabel = this.state.timerLabel;

    this.setState({
      timer: this.state.timer - 1,
    });

    if (this.state.timer < 0) {
      let timerLabel = this.state.timerLabel == "Session" ? "Break" : "Session";
      let type =
        this.state.timerLabel == "Session" ? "breakLength" : "sessionLength";
      this.setState({
        timer: this.state[type] * 60,
        timerLabel,
      });
      this.audioBeep.play();
    }

    // if (timerLabel === "Session" && this.state.timer < 0) {
    //   this.setState({
    //     timer: this.state.breakLength * 60,
    //     timerLabel: "Break",
    //   });
    //   this.audioBeep.play();
    // } else if (timerLabel === "Break" && this.state.timer < 0) {
    //   this.setState({
    //     timer: this.state.sessionLength * 60,
    //     timerLabel: "Session",
    //   });
    //   this.audioBeep.play();
    // }
  };

  timeFormatter = () => {
    // let divisor_for_minutes = secs % (60 * 60);
    if (this.state.timer <= 0) return "00:00";
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  handleIncrementDecrement = (type, operator) => {
    // if (this.state.startFlag) return;
    let typeToUpdate = type == "Session" ? "sessionLength" : "breakLength";

    if (this.state.timerLabel !== type) {
      if (operator === "-" && this.state[typeToUpdate] > 1) {
        this.setState({ breakLength: this.state[typeToUpdate] - 1 });
      } else if (operator === "+" && this.state[typeToUpdate] < 60) {
        this.setState({ breakLength: this.state[typeToUpdate] + 1 });
      }
    } else {
      if (operator === "-" && this.state[typeToUpdate] > 1) {
        this.setState({
          [typeToUpdate]: this.state[typeToUpdate] - 1,
          timer: this.state[typeToUpdate] * 60 - 60,
        });
      } else if (operator === "+" && this.state[typeToUpdate] < 60) {
        this.setState({
          [typeToUpdate]: this.state[typeToUpdate] + 1,
          timer: this.state[typeToUpdate] * 60 + 60,
        });
      }
    }
    // } else if (type === "Session") {
    //   if (this.state.timerLabel === "Session") {
    //     if (operator === "-" && this.state.sessionLength > 1) {
    //       this.setState({
    //         sessionLength: this.state.sessionLength - 1,
    //         timer: this.state.sessionLength * 60 - 60,
    //       });
    //     } else if (operator === "+" && this.state.sessionLength < 60) {
    //       this.setState({
    //         sessionLength: this.state.sessionLength + 1,
    //         timer: this.state.sessionLength * 60 + 60,
    //       });
    //     }
    //   }
    //   if (this.state.timerLabel === "Break") {
    //     if (operator === "-" && this.state.sessionLength > 1) {
    //       this.setState({
    //         sessionLength: this.state.sessionLength - 1,
    //       });
    //     } else if (operator === "+" && this.state.sessionLength < 60) {
    //       this.setState({
    //         sessionLength: this.state.sessionLength + 1,
    //       });
    //     }
    //   }
    // }
  };

  handleReset = () => {
    clearInterval(this.newIntervalId);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timer: 25 * 60,
      timerLabel: "Session",
      startFlag: false,
    });
  };

  render() {
    const { timerLabel, startFlag, breakLength, sessionLength } = this.state;

    let renderClass = null;
    renderClass = startFlag ? "disabled" : null;

    return (
      <div id="container">
        <div id="break-label">Break Length</div>
        <div id="break-length">{breakLength}</div>
        <div id="session-label">Session Length</div>
        <div id="session-length">{sessionLength}</div>

        <button
          onClick={() => this.handleIncrementDecrement("Break", "+")}
          className={"btn btn-primary m-1 " + renderClass}
          id="break-decrement"
        >
          Break +
        </button>
        <button
          onClick={() => this.handleIncrementDecrement("Break", "-")}
          className={"btn btn-primary m-1 " + renderClass}
          id="break-increment"
        >
          Break -
        </button>
        <button
          onClick={() => this.handleIncrementDecrement("Session", "-")}
          className={"btn btn-primary m-1 " + renderClass}
          id="session-decrement"
        >
          Session -
        </button>
        <button
          onClick={() => this.handleIncrementDecrement("Session", "+")}
          className={"btn btn-primary m-1 " + renderClass}
          id="session-increment"
        >
          Session +
        </button>
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{this.timeFormatter()}</div>
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
        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    );
  }
}

export default Clock;
