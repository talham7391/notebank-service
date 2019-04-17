import React, { Component } from 'react';
import * as S from './styles';
import { observer } from 'mobx-react';
import { observable, action, autorun, toJS } from 'mobx';
import Graph from 'utils/graph/Graph';

const RENDER_STEPS = 0;

const STATE = {
  EXITED: 'exited',
  ENTERING: 'entering',
  ENTERED: 'entered',
  EXITING: 'exiting',
};

const STAGE = {
  STARTING: 'starting',
  FINISHING: 'finishing',
};

@observer class Transition extends Component {
  @observable showChildren = false;
  @observable shouldProcess = undefined;
  @observable transitionInfo = {
    /* currentStage: this will tell us whether:
    ** we are going from entered/exit -> exiting/entering = 'starting' (render count dependant)
    ** we are going from exiting/entering -> exited/entered = 'finishing' (time dependant)
    */
    currentStage: undefined,
    updateCount: 0,
    callback: undefined,
  };

  @observable appliedStyle = {};
  targetState = undefined;
  stateGraph = new Graph([STATE.EXITED, STATE.ENTERING, STATE.ENTERED, STATE.EXITING], RENDER_STEPS);

  @action initializeTransition = _ => {
    // entered -> entered: do nothing
    // entering -> entered: do nothing
    // exiting -> entered: jump to entering phase, update the target not the source
    // exited -> entered: update the target and the source

    // exited -> exited: do nothing
    // exiting -> exited: do nothing
    // entering -> exited: jump to exiting phase, update the target not the source
    // entered -> exited: update the target and the source

    this.clearTransitionInfo();
    this.showChildren = true;

    if (this.props.in) {
      if (this.targetState == null) { // this means the component has just been mounted
        // either show up right away or suppose you are in the exited phase depending on what user wants
        this.appliedStyle = this.props.targetStyle;
        this.stateGraph.jumpTo(STATE.ENTERED);
      } else if (this.stateGraph.getCurrentValue() === STATE.EXITING) {
        // jump to entering phase
        // set the applied style to the target
        this.stateGraph.jumpTo(STATE.ENTERING);
        this.setStage(STAGE.FINISHING);
      } else if (this.stateGraph.getCurrentValue() === STATE.EXITED) {
        // set the source then go into entering phase
        this.appliedStyle = this.props.sourceStyle;
        this.setStage(STAGE.STARTING);
      } else {
        // don't do anything
      }
      this.targetState = STATE.ENTERED;
    } else {
      if (this.targetState == null) {
        // either dissappear right away or suppose you are in the entering phase depending on what user wants
        this.appliedStyle = this.props.targetStyle;
        this.stateGraph.jumpTo(STATE.EXITED);
        this.showChildren = false;
      } else if (this.stateGraph.getCurrentValue() === STATE.ENTERING) {
        // jump to exiting phase
        // set the applied style to the target
        this.stateGraph.jumpTo(STATE.EXITING);
        this.setStage(STAGE.FINISHING);
      } else if (this.stateGraph.getCurrentValue() === STATE.ENTERED) {
        // set the source then go into the exiting phase
        this.appliedStyle = this.props.sourceStyle;
        this.setStage(STAGE.STARTING);
      } else {
        // do nothing
        this.showChildren = false;
      }
      this.targetState = STATE.EXITED;
    }
  };

  @action setStage(stage) {
    this.transitionInfo.currentStage = stage;
  }

  @action clearTransitionInfo() {
    if (this.transitionInfo.callback != null) {
      clearTimeout(this.transitionInfo.callback);
    }
    this.transitionInfo = {
      currentStage: undefined,
      updateCount: 0,
      callback: undefined,
    };
  }

  process = autorun(_ => {
    if (this.shouldProcess) {
      this.initializeTransition();
      this.shouldProcess = false;
    }
  });

  startingStage = autorun(_ => {
    if (this.transitionInfo.currentStage === STAGE.STARTING && this.transitionInfo.updateCount >= 1) {
      this.stateGraph.gotoNext();
      this.transitionInfo.updateCount = 0;
      this.transitionInfo.currentStage = STAGE.FINISHING;
    }
  });

  finishingStage = autorun(_ => {
    if (this.transitionInfo.currentStage === STAGE.FINISHING) {
      let duration = null;
      if (this.targetState === STATE.ENTERED) {
        this.appliedStyle = {
          ...this.props.targetStyle,
          transition: `all ${this.props.enteringDuration}ms`,
          transitionDelay: `${this.props.enteringDelay}ms`,
        };
        duration = this.props.enteringDuration + this.props.enteringDelay;
      } else {
        this.appliedStyle = {
          ...this.props.targetStyle,
          transition: `all ${this.props.exitingDuration}ms`,
          transitionDelay: `${this.props.exitingDelay}ms`,
        };
        duration = this.props.exitingDuration + this.props.exitingDelay;
      }
      this.transitionInfo.callback = setTimeout(() => {
        this.stateGraph.gotoNext();
        this.clearTransitionInfo();
        if (this.stateGraph.getCurrentValue() === STATE.EXITED && !this.props.in) {
          this.showChildren = false;
        }
      }, duration);
    }
  });

  componentDidMount() {
    this.shouldProcess = true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.in !== this.props.in) {
      this.shouldProcess = true;
    }
    if (this.transitionInfo.currentStage === STAGE.STARTING) {
      this.transitionInfo.updateCount++;
    }
  }

  render() {
    return (
      <S.Transition appliedStyle={toJS(this.appliedStyle)}>
        {this.showChildren && this.props.children}
      </S.Transition>
    );
  }
}

export default Transition;