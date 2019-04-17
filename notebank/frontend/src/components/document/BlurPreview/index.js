import React, { Component } from 'react';
import * as S from './styles';
import { BLUR_AMOUNT } from 'constants/document';

class BlurPreview extends Component {
  render() {
    let percent = 100;
    if (this.props.blurAmount == null || this.props.blurAmount === BLUR_AMOUNT.FULL) {
      percent = 0;
    } else if (this.props.blurAmount === BLUR_AMOUNT.HALF) {
      percent = 50;
    }
    return (
      <S.BlurPreview>
        <S.PreviewPage percent={percent} index={2} first></S.PreviewPage>
        <S.PreviewPage index={1}></S.PreviewPage>
        <S.PreviewPage shadow base></S.PreviewPage>
      </S.BlurPreview>
    );
  }
}

export default BlurPreview;