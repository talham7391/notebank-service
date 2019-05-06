import React, { Component, Fragment } from 'react';
import * as S from './styles';
import { Row, Col, Icon } from 'antd';
import './styles.css';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

@observer class SqPaymentForm extends Component {
  @observable isFormBuilt = false;
  @observable errors = {
    cardNumber: null,
    cvv: null,
    expirationDate: null,
    postalCode: null,
  };

  @action resetErrors = _ => {
    this.errors = {
      cardNumber: null,
      cvv: null,
      expirationDate: null,
      postalCode: null,
    };
  };

  componentDidMount() {
    window.addSquareListener(this);
    window.createPaymentForm();

    window.buildForm(window.paymentForm);
  }

  componentWillUnmount() {
    window.removeSquareListener(this);
    window.paymentForm.destroy();
  }

  requestCardNonce() {
    const x = window.paymentForm.requestCardNonce();
  }

  paymentFormLoaded() {
    this.isFormBuilt = true;
    this.props.onFormBuilt && this.props.onFormBuilt();
  }

  @action cardNonceResponseReceived(errors, nonce, cardData) {
    this.resetErrors();
    if (errors) {
      for (let key in errors) {
        this.errors[errors[key].field] = errors[key].message;
      }
    }
    this.props.onNonce?.call(this.props, errors, nonce, cardData);
  }

  renderAntInput = (title, errorMessage, sqId) => {
    return (
      <div className={`ant-row ant-form-item ${errorMessage != null ? 'ant-form-item-with-help' : ''}`}>
        <div className="ant-col ant-form-item-label">
          <label className="ant-form-item-required">{title}</label>
        </div>
        <div className="ant-col ant-form-item-control-wrapper">
          <div className={`ant-form-item-control ${errorMessage != null ? 'has-error' : 'has-success'}`}>
            <span className="ant-form-item-children">
              <div id={sqId}></div>
            </span>
            { errorMessage != null &&
              <div className="ant-form-explain">{errorMessage}</div>
            }
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <S.SqPaymentForm>
          { !this.isFormBuilt && 
            <S.LoadingContainer>
              <Icon type="loading"/>
            </S.LoadingContainer>
          }
          <S.PaymentFieldsContainer show={this.isFormBuilt}>
            {this.renderAntInput('Card Number', this.errors.cardNumber, 'sq-card-number')}
            <Row gutter={16}>
              <Col span={8}>
                {this.renderAntInput('Expiration', this.errors.expirationDate, 'sq-expiration-date')}
              </Col>
              <Col span={8}>
                {this.renderAntInput('CVV', this.errors.cvv, 'sq-cvv')}
              </Col>
              <Col span={8}>
                {this.renderAntInput('Postal', this.errors.postalCode, 'sq-postal-code')}
              </Col>
            </Row>
          </S.PaymentFieldsContainer>
      </S.SqPaymentForm>
    );
  }
}

export default SqPaymentForm;