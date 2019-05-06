import React, { Component } from 'react';
import { Alert } from 'antd';

class CardSummary extends Component {

  get cardInfo() {
    return `•••••••••••• ${this.props.card.last_4}`;
  }

  render() {
    return (
      <div>
        <Alert
          type="success"
          showIcon
          message="Card Saved"
          closeText="Change"
          afterClose={this.props.onDelete}
          description={this.cardInfo}/>
      </div>
    );
  }
}

export default CardSummary;