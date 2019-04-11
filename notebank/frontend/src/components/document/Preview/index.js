import React, { Component } from 'react';
import PDFPreview from 'components/document/pdf/PDFPreview';
import ImagePreview from 'components/document/image/ImagePreview';

class Preview extends Component {
  render() {
    const fitWithin = {
      width: 110,
      height: 110,
    };
    return (
      (this.props.file.type === 'application/pdf' && <PDFPreview fitWithin={fitWithin} {...this.props}/>) ||
      (this.props.file.type.split('/')[0] === 'image' && <ImagePreview fitWithin={fitWithin} {...this.props}/>)
    );
  }
}

export default Preview;