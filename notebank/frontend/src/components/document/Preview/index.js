import React, { Component } from 'react';
import PDFPreview from 'components/document/pdf/PDFPreview';
import ImagePreview from 'components/document/image/ImagePreview';
import { PREVIEW_SIZE } from 'constants/document';

class Preview extends Component {
  render() {
    const fitWithin = {...PREVIEW_SIZE};
    return (
      (this.props.file.type === 'application/pdf' && <PDFPreview fitWithin={fitWithin} {...this.props}/>) ||
      (this.props.file.type.split('/')[0] === 'image' && <ImagePreview fitWithin={fitWithin} {...this.props}/>)
    );
  }
}

export default Preview;