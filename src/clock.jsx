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

  handleStartStop = () => {
    const { startFlag } = this.state;

    if (!startFlag) {
      this.newIntervalId = setInterval(() => this.countDown(), 1000);
    } else {
      clearInterval(this.newIntervalId);
    }

    this.setState({
      startFlag: !startFlag,
    });
  };

  timeFormatter = () => {
    // let divisor_for_minutes = secs % (60 * 60);
    const totalCount = this.state.timer;
    if (totalCount <= 0) return "00:00";
    let minutes = Math.floor(totalCount / 60);
    let seconds = totalCount - minutes * 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  countDown = () => {
    // Remove one second, set state so a re-render happens.
    const { timerLabel, timer } = this.state;

    if (timer < 0) {
      let timerLabelToUpdate = timerLabel === "Session" ? "Break" : "Session";
      let type = timerLabel === "Session" ? "breakLength" : "sessionLength";
      this.setState({
        timer: this.state[type] * 60,
        timerLabel: timerLabelToUpdate,
      });
      this.audioBeep.play();
    } else {
      this.setState({
        timer: timer - 1,
      });
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

  handleIncrementDecrement = (type, operator) => {
    if (this.state.startFlag) return;
    let typeToUpdate = type === "Session" ? "sessionLength" : "breakLength";

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
        <div class="row">
          <div class="breakLength col">
            <div id="break-label">Break Length</div>
            <button
              onClick={() => this.handleIncrementDecrement("Break", "+")}
              className={"btn btn-primary m-1 " + renderClass}
              id="break-increment"
            >
              Break +
            </button>
            <div id="break-length">{breakLength}</div>
            <button
              onClick={() => this.handleIncrementDecrement("Break", "-")}
              className={"btn btn-primary m-1 " + renderClass}
              id="break-decrement"
            >
              Break -
            </button>
          </div>

          <div class="sessionLength col">
            <div id="session-label">Session Length</div>
            <button
              onClick={() => this.handleIncrementDecrement("Session", "+")}
              className={"btn btn-primary m-1 " + renderClass}
              id="session-increment"
            >
              Session +
            </button>
            <div id="session-length">{sessionLength}</div>
            <button
              onClick={() => this.handleIncrementDecrement("Session", "-")}
              className={"btn btn-primary m-1 " + renderClass}
              id="session-decrement"
            >
              Session -
            </button>
          </div>
        </div>

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
