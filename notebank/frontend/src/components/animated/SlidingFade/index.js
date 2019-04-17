import React, { Component } from 'react';
import Transition from 'components/animated/Transition';

const FADED_OUT_LEFT = {
  opacity: 0,
  transform: 'translateX(-60px)',
};

const FADED_OUT_RIGHT = {
  opacity: 0,
  transform: 'translateX(60px)',
};

const FADED_IN = {
  opacity: 1,
  transform: 'translateX(0px)',
};

class SlidingFade extends Component {
  render() {
    let isIn = false;
    let sourceStyle = {};
    let targetStyle = {};
    if (this.props.currentId === this.props.id) {
      isIn = true;
      if (this.props.id > this.props.previousId) { // come in from right
        sourceStyle = FADED_OUT_RIGHT;
      } else {                                     // come in from left
        sourceStyle = FADED_OUT_LEFT;
      }
      targetStyle = FADED_IN;
    } else {
      sourceStyle = FADED_IN;
      if (this.props.id < this.props.currentId) { // go out to left
        targetStyle = FADED_OUT_LEFT;
      } else {                                    // go out to right
        targetStyle = FADED_OUT_RIGHT;
      }
    }
    return (
      <Transition
        in={isIn}
        sourceStyle={sourceStyle}
        targetStyle={targetStyle}
        exitingDelay={0}
        exitingDuration={200}
        enteringDelay={200}
        enteringDuration={200}>{this.props.children}</Transition>
    );
  }
}

export default SlidingFade;