import React, { Component } from 'react';
import * as S from './styles';
import * as PS from '../styles';
import { Form, Input, Row, Col, Button, Icon, message, Switch, InputNumber } from 'antd';
import { observer } from 'mobx-react';
import { observable, action, toJS, computed } from 'mobx';
import valid from 'card-validator';
import SqPaymentForm from 'components/square/SqPaymentForm';
import CardSummary from 'components/square/CardSummary';
import { VALIDATE_NOTE_CREATION } from 'constants/global';

@observer class MoneyStep extends Component {
  @observable isFormBuilding = false;
  @observable isFree = true;

  sqPaymentForm = undefined;

  setSqPaymentForm = ref => {
    if (ref != null) {
      this.isFormBuilding = true;
      this.sqPaymentForm = ref;
    }
  };

  validateFields = async _ => {
    const err = await new Promise((res, rej) => {
      this.props.form.validateFields((err, values) => {
        res(err);
      });
    });
    return err;
  };

  onNextClick = _ => {
    if (!VALIDATE_NOTE_CREATION) {
      this.props.onNextStep();
      return;
    }
    if (this.props.state.noteForm.price?.value === 0) {
      this.proceedNext();
      return;
    }
    if (this.props.state.noteForm.isCardInfoPresent) {
      this.proceedNext();
    } else {
      this.sqPaymentForm.requestCardNonce();
    }
  };

  proceedNext = async _ => {
    const errs = await this.validateFields();
    if (errs == null) {
      this.props.onNextStep();
    } else {
      message.error('You must fix the errors in your form.');
    }
  };

  @action onFormBuilt = _ => {
    this.isFormBuilding = false;
  };

  onNonce = (errors, nonce, cardData) => {
    if (errors) {
      this.validateFields();
    } else {
      this.props.state.noteForm.nonce = nonce;
      this.props.state.noteForm.cardData = cardData;
      this.proceedNext();
    }
  };

  onClearCardInfo = _ => {
    this.props.state.noteForm.nonce = undefined;
    this.props.state.noteForm.cardData = undefined;
  };

  @action onFreeChange = evt => {
    this.isFree = evt;
    if (this.isFree) {
      this.props.form.setFieldsValue({'price': 0});
    } else {
      this.props.state.noteForm.price = undefined;
    }
  };

  @action componentDidMount() {
    if (this.props.state.noteForm.price?.value !== 0) {
      this.isFree = false;
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <PS.StepContainer>
        <PS.FormContainer>
          <Form layout="vertical">
            <Form.Item label="Free" labelCol={{span: 4}} wrapperCol={{span: 20}}>
              <Switch
                disabled={this.isFormBuilding}
                onChange={this.onFreeChange}
                checked={this.isFree}/>
            </Form.Item>
            { !this.isFree &&
              <Form.Item label="Price">
                {getFieldDecorator('price', {
                    rules: [{
                      required: true,
                    }],
                    initialValue: this.props.state.noteForm.price?.value,
                  })(
                    <InputNumber
                      disabled={this.isFormBuilding}/>
                  )}
              </Form.Item>
            }
            { !this.isFree && (
              this.props.state.noteForm.isCardInfoPresent ?
                <CardSummary
                  card={this.props.state.noteForm.cardData}
                  onDelete={this.onClearCardInfo}/>
                :
                <SqPaymentForm
                  ref={this.setSqPaymentForm}
                  onFormBuilt={this.onFormBuilt}
                  onNonce={this.onNonce}/>
              )
            }
          </Form>
        </PS.FormContainer>
        <PS.FormContainer>
          <S.Buttons>
            <Button
              disabled={this.isFormBuilding}
              onClick={this.props.onPreviousStep}><Icon type="left"/>Back</Button>
            <Button
              disabled={this.isFormBuilding}
              type="primary"
              onClick={this.onNextClick}>Next<Icon type="right"/></Button>
          </S.Buttons>
        </PS.FormContainer>
      </PS.StepContainer>
    );
  }
}

const WrappedMoneyStep = Form.create({
  name: 'money',
  mapPropsToFields: props => {
    const fields = props.state.noteForm.moneyStepFields;
    const retval = {};
    for (let f in fields) {
      retval[f] = Form.createFormField(toJS(fields[f]));
    }
    return retval;
  },
  onFieldsChange: (props, fields) => {
    for (let field in fields) {
      props.state.noteForm[field] = fields[field];
    }
  },
})(MoneyStep);

const ObservingWrappedMoneyStep = observer(props => {
  let _ = props.state.noteForm.cardData;
  _ = props.state.noteForm.nonce;
  _ = props.state.noteForm.price;
  return <WrappedMoneyStep {...props}/>
});

export default ObservingWrappedMoneyStep;