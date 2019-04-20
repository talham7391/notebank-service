import React, { Component } from 'react';
import * as S from './styles';
import * as PS from '../styles';
import { Form, Input, Row, Col, Button, Icon, message } from 'antd';
import { observer } from 'mobx-react';
import { observable, action, toJS } from 'mobx';
import valid from 'card-validator';

class MoneyStep extends Component {

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
            <Form.Item label="Email Address">
              {getFieldDecorator('email', {
                  rules: [{
                    required: true,
                    type: 'email',
                    message: 'Please enter a valid email address.',
                  }],
                })(
                  <Input placeholder="abc@123.com"/>
                )}
            </Form.Item>
          </Form>
        </PS.FormContainer>
        <PS.FormContainer>
          <S.Buttons>
            <Button onClick={this.props.onPreviousStep}><Icon type="left"/>Back</Button>
            <Button type="primary" onClick={this.onNextClick}>Next<Icon type="right"/></Button>
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
  let _ = props.state.noteForm.email;
  return <WrappedMoneyStep {...props}/>
});

export default ObservingWrappedMoneyStep;