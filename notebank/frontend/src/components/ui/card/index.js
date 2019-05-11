import React, { Component } from 'react';
import * as S from './styles';

class Card extends Component {
  render() {
    return (
      <S.Card>{this.props.children}</S.Card>
    );
  }
}

export default Card;