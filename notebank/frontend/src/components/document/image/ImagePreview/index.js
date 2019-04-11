import React, { Component } from 'react';
import * as DocStyles from 'components/document/styles.js';
import CanvasFactory from 'components/canvas/CanvasFactory';
import { observer } from 'mobx-react';
import { observable, autorun, toJS } from 'mobx';
import { PDF } from 'utils/document/pdf';
import { Typography } from 'antd';
import { scaleToFitWithin } from 'utils/document';

const { Text } = Typography;

@observer class ImagePreview extends Component {
  @observable shouldRender = false;
  @observable canvasReady = false;
  @observable canvasSize = undefined;
  canvasFactory = null;

  setCanvasFactoryRef = ref => {
    this.canvasFactory = ref;
  };

  componentDidMount() {
    this.canvasFactory.subscribe(this);
    this.canvasFactory.setCanvasCount(1);
    if (this.props.file.url != null) {
      this.shouldRender = true;
    }
  }

  notify() {
    this.canvasReady = true;
  }

  renderImageToCanvas = autorun(async _ => {
    if (this.shouldRender && this.canvasReady) {
      const img = new Image();
      img.src = this.props.file.url;

      await new Promise((res, rej) => {img.onload = res});

      const canvas = this.canvasFactory.getCanvas(0);
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      const size = scaleToFitWithin(this.props.fitWithin, {width: img.width, height: img.height});
      this.canvasSize = size;

      this.shouldRender = false;
    }
  });

  componentDidUpdate(prevProps) {
    if (prevProps.file.url !== this.props.file.url) {
      this.shouldRender = true;
    }
  }

  render() {
    return (
      <DocStyles.PreviewContainer>
        <CanvasFactory canvasSize={this.canvasSize} StyledCanvas={DocStyles.PreviewStyledCanvas} ref={this.setCanvasFactoryRef}/>
        <DocStyles.PreviewFileName><Text>{this.props.file.name}</Text></DocStyles.PreviewFileName>
      </DocStyles.PreviewContainer>
    );
  }
}

export default ImagePreview;