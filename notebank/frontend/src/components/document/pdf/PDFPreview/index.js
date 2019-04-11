import React, { Component } from 'react';
import * as DocStyles from 'components/document/styles.js';
import CanvasFactory from 'components/canvas/CanvasFactory';
import { observer } from 'mobx-react';
import { observable, autorun } from 'mobx';
import { PDF } from 'utils/document/pdf';
import { Typography } from 'antd';

const { Text } = Typography;

@observer class PDFPreview extends Component {
  @observable shouldRender = false;
  @observable canvasReady = false;
  @observable canvasSize = undefined;
  currentlyRendering = false;
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

  renderPDFToCanvas = autorun(async _ => {
    if (this.shouldRender && this.canvasReady && !this.currentlyRendering) {
      this.currentlyRendering = true;
      const pdf = new PDF();
      await pdf.load(this.props.file.url);
      const size = await pdf.renderToCanvas(this.canvasFactory.getCanvas(0), {...this.props.fitWithin});
      this.canvasSize = size;
      this.shouldRender = false;
      this.currentlyRendering = false;
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

export default PDFPreview;