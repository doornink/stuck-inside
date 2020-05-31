import { Component } from 'react';

import Beep from '../../sounds/sample_beep.mp3';
import Buzzer from '../../sounds/buzzer.mp3';
import Ding from '../../sounds/ding.mp3';

export const SOUNDS = {
  BEEP: 'BEEP',
  DING: 'DING',
  BUZZER: 'BUZZER',
};

export class AudioEngine extends Component {
  componentWillMount() {
    this.beep = new Audio(Beep);
    this.beep.volume = 0.1;
    this.ding = new Audio(Ding);
    this.ding.volume = 0.1;
    this.buzzer = new Audio(Buzzer);
    this.buzzer.volume = 0.1;
    this.lockedAudio = [this.beep, this.ding, this.buzzer];

    document.addEventListener('click', this.initAudio, false);
    document.addEventListener('touchstart', this.initAudio, false);
  }

  initAudio = () => {
    console.log('triggered!', this.lockedAudio);
    if (this.lockedAudio) {
      for (let audio of this.lockedAudio) {
        audio.play();
        audio.pause();
        audio.currentTime = 0;
      }
      this.lockedAudio = null;
    }
  };

  componentDidUpdate(props) {
    if (!!props.sound) {
      this.playSound(props.sound);
    }
  }

  playSound(sound) {
    // if safari, dont play audio until the user triggers it in the tap function above
    if (this.lockedAudio && navigator.userAgent.indexOf('Safari') !== -1) {
      return null;
    }
    switch (sound) {
      case SOUNDS.BEEP:
        console.log('play beep');
        this.beep.play();
        break;
      case SOUNDS.DING:
        console.log('play ding');
        this.ding.play();
        break;
      case SOUNDS.BUZZER:
        console.log('play buzzer');
        this.buzzer.play();
        break;
      default:
        break;
    }
  }

  render() {
    return null;
  }
}
