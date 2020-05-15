import React, { Component } from 'react';

import './timer-wrapper.css';

import Beep from '../../sounds/sample_beep.mp3';

export default class TimerWrapper extends Component {
  state = {
    stage1N: null,
    stage2N: null,
    stage3N: null,
    stage4N: null,
    beep: new Audio(Beep),
    timerStage: null,
    isTicking: false,
    tickFrequency: 200000,
  };

  tickTimeout = null;

  componentWillMount() {
    this.setTimerVariance();
  }

  componentWillUnmount() {
    console.log('bye bye!');
    this.state.beep.pause();
    clearTimeout(this.tickTimeout);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.timerLength !== nextProps.timerLength) {
      this.setTimerVariance();
    }

    if (
      this.props.timeLeft !== nextProps.timeLeft ||
      this.props.timerStopped !== nextProps.timerStopped
    ) {
      this.setTimerStage(nextProps);
    }
  }

  setTimerStage = (props) => {
    const { timerLength, timeLeft, timerStopped } = props;
    const { stage1N, stage2N, stage3N, stage4N, timerStage } = this.state;

    if (timerStopped && !!timerStage) {
      this.setState({ timerStage: null });
    } else if (timeLeft < timerLength * stage4N && timerStage === 'stage-3') {
      clearTimeout(this.tickTimeout);
      this.setState({ timerStage: 'stage-4', tickFrequency: 250 }, () => {
        this.audioTick();
      });
    } else if (timeLeft < timerLength * stage3N && timerStage === 'stage-2') {
      clearTimeout(this.tickTimeout);
      this.setState({ timerStage: 'stage-3', tickFrequency: 500 }, () => {
        this.audioTick();
      });
    } else if (timeLeft < timerLength * stage2N && timerStage === 'stage-1') {
      clearTimeout(this.tickTimeout);
      this.setState({ timerStage: 'stage-2', tickFrequency: 1000 }, () => {
        this.audioTick();
      });
    } else if (timeLeft < timerLength * stage1N && !timerStage) {
      clearTimeout(this.tickTimeout);
      this.setState({ timerStage: 'stage-1', tickFrequency: 2000 }, () => {
        this.audioTick();
      });
    }
  };

  setTimerVariance = () => {
    this.setState({
      stage1N: 0.5 + Math.random() * 0.2, // 50-70%
      stage2N: 0.3 + Math.random() * 0.15, // 30-45%
      stage3N: 0.15 + Math.random() * 0.1, // 15-25%
      stage4N: 0.05 + Math.random() * 0.05, // 5-10%
    });
  };

  startTicking = () => {
    if (!this.state.ticking) {
      this.audioTick();
      this.setState({ isTicking: true });
    }
  };

  audioTick = () => {
    if (!this.props.timerStopped) {
      this.state.beep.volume = 0.1;
      this.state.beep.play();
      this.tickTimeout = setTimeout(() => {
        this.audioTick();
      }, this.state.tickFrequency);
    } else {
      this.setState({ isTicking: false });
    }
  };

  render() {
    return (
      <div className={`timer-wrapper ${this.state.timerStage}`}>
        {this.props.children}
      </div>
    );
  }
}
