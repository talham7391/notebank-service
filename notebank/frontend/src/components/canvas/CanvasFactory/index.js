import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

@observer class CanvasFactory extends Component {
  @observable canvases = [];
  canvasCount = 0;
  canvasRefs = [];
  subscribers = [];

  subscribe = s => {
    this.subscribers.push(s);
  };

  setCanvasCount = count => {
    this.canvasCount = count;
    this.canvases.replace([]);
    this.canvasRefs = [];
    for (let i = 0; i < count; i++) {
      this.canvases.push(1);
      this.canvasRefs.push(null);
    }
  };

  setCanvasRef = (idx, ref) => {
    this.canvasRefs[idx] = ref;
    if (this.canvasRefs.length === this.canvasCount && this.canvasRefs.every(x => x != null)) {
      this.subscribers.forEach(s => s && s.notify && s.notify());
    }
  };

  getCanvas = idx => {
    return this.canvasRefs[idx];
  };

  render() {
    return this.canvases.map((_, idx) => (
      this.props.StyledCanvas ? 
      <this.props.StyledCanvas size={this.props.canvasSize} ref={ref => this.setCanvasRef(idx, ref)} key={idx}></this.props.StyledCanvas>
      :
      <canvas ref={ref => this.setCanvasRef(idx, ref)} key={idx}></canvas>
    ));
  }
}

export default CanvasFactory;