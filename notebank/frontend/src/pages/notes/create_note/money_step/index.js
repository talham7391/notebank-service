import React, { Component } from 'react';
import * as S from './styles';
import * as PS from '../styles';
import { Form, Input, Row, Col, Button, Icon, message } from 'antd';
import { observer } from 'mobx-react';
import { observable, action, toJS } from 'mobx';
import valid from 'card-validator';

class MoneyStep extends Component {

  cardNumberValidator = (rule, value, callback) => {
    const errors = [];
    
    if (rule.required && (value == null || value === '')) {
      errors.push(`${rule.field} is required`);
    }

    const numberValidation = valid.number(value);
    if (!numberValidation.isValid) {
      errors.push('Invalid credit card number.');
    }

    callback(errors);
  };

  cardExpirationValidator = (rule, value, callback) => {
    const errors = [];
    
    if (rule.required && (value == null || value === '')) {
      errors.push(`${rule.field} is required`);
    }

    const expirationValidation = valid.expirationDate(value);
    if (!expirationValidation.isValid) {
      errors.push('Invalid expiration date.');
    }

    callback(errors);
  };
  
  cardCvvValidator = (rule, value, callback) => {
    const errors = [];
    
    if (rule.required && (value == null || value === '')) {
      errors.push(`${rule.field} is required`);
    }

    const cvvValidation = valid.cvv(value);
    if (!cvvValidation.isValid) {
      errors.push('Invalid cvv.');
    }

    callback(errors);
  };

  validateFields = async _ => {
    const err = await new Promise((res, rej) => {
      this.props.form.validateFields((err, values) => {
        res(err);
      });
    });
    return err;
  };

  onNextClick = async _ => {
    const errs = await this.validateFields();
    if (errs == null) {
      this.props.onNextStep();
    } else {
      message.error('You must fix the errors in your form.');
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <PS.StepContainer>
        <PS.FormContainer>
          <Form>
            <Form.Item label="Card Number">
              {getFieldDecorator('cardNumber', {
                  rules: [{
                    required: true,
                    message: 'Missing/invalid card number.',
                    validator: this.cardNumberValidator,
                  }],
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="1234  1234  1234  1234"/>
                )}
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Expiration">
                  {getFieldDecorator('expiration', {
                      rules: [{
                        required: true,
                        message: 'Missing/invalid expiration date.',
                        validator: this.cardExpirationValidator,
                      }],
                      validateTrigger: 'onBlur',
                    })(
                      <Input placeholder="MM / YY"/>
                    )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="CVV">
                  {getFieldDecorator('cvv', {
                      rules: [{
                        required: true,
                        message: 'Missing/invalid cvv.',
                        validator: this.cardCvvValidator,
                      }],
                      validateTrigger: 'onBlur',
                    })(
                      <Input placeholder="123"/>
                    )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </PS.FormContainer>
        <PS.FormContainer>
          <S.Buttons>
            <Button onClick={this.props.onPreviousStep}>Back<Icon type="left"/></Button>
            <Button type="primary" onClick={this.onNextClick}>Next<Icon type="right"/></Button>
          </S.Buttons>
        </PS.FormContainer>
      </PS.StepContainer>
    );
  }
}

const justNum = str => {
  if (str == null) {
    return str;
  }
  let num = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ' || isNaN(str[i])) {
      continue;
    }
    num += str[i];
  }
  return num;
};

const formatCardNumber = str => {
  if (str == null || str == '') {
    return str;
  }
  const num = justNum(str);

  const numberValidation = valid.number(num);
  const maxLength = numberValidation.card ? Math.max(...numberValidation.card.lengths) : num.length;

  let retval = '';
  for (let i = 0; i < num.length; i++) {
    if (i >= maxLength) {
      break;
    }
    if (numberValidation.isPotentiallyValid && numberValidation.card?.gaps.find(x => x === i) != null) {
      retval += '  ';
    }
    retval += num[i];
  }
  return retval;
};

const formatCardExpiration = str => {
  if (str == null) {
    return str;
  }
  const num = justNum(str);

  let retval = '';
  for (let i = 0; i < num.length; i++) {
    if (i === 0 || i === 1 || i === 3) {
      retval += num[i];
    } else if (i === 2) {
      retval += ' / ';
      retval += num[i];
    }
  }
  return retval;
};

const formatCardCvv = str => {
  if (str == null) {
    return str;
  }
  const num = justNum(str);

  let retval = '';
  for (let i = 0; i < num.length; i++) {
    if (i < 3) {
      retval += num[i];
    }
  }
  return retval;
};

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
      if (field === 'cardNumber') {
        fields[field].value = formatCardNumber(fields[field].value);
      } else if (field === 'expiration') {
        fields[field].value = formatCardExpiration(fields[field].value);
      } else if (field === 'cvv') {
        fields[field].value = formatCardCvv(fields[field].value);
      }
      props.state.noteForm[field] = fields[field];
    }
  },
})(MoneyStep);

const ObservingWrappedMoneyStep = observer(props => {
  let _ = props.state.noteForm.cardNumber;
  _ = props.state.noteForm.expiration;
  _ = props.state.noteForm.cvv;
  return <WrappedMoneyStep {...props}/>
});

export default ObservingWrappedMoneyStep;