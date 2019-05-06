import React, { Component } from 'react';
import * as S from './styles';
import * as PS from '../styles';
import { Form, Input, Row, Col, Button, Icon, message, Checkbox } from 'antd';
import { observer } from 'mobx-react';
import { observable, action, toJS } from 'mobx';
import valid from 'card-validator';
import { VALIDATE_NOTE_CREATION } from 'constants/global';

class SubmitStep extends Component {

  validateFields = async _ => {
    const err = await new Promise((res, rej) => {
      this.props.form.validateFields((err, values) => {
        res(err);
      });
    });
    return err;
  };

  onSubmitClick = async _ => {
    if (!VALIDATE_NOTE_CREATION) {
      this.props.onSubmit();
      return;
    }
    const errs = await this.validateFields();
    if (errs == null) {
      this.props.onSubmit();
    } else {
      message.error('You must fix the errors in your form.');
    }
  };

  termsAndConditionsValidator(rule, value, callback) {
    const errors = [];
    if (value !== true) {
      errors.push('You must agree to the terms and conditions to create a note.');
    }
    callback(errors);
  }

  onTerms = evt => {
    evt.preventDefault();
    window.location.href = '/terms-and-conditions';
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <PS.StepContainer>
        <PS.FormContainer>
          <Form>
            <Form.Item>
            {getFieldDecorator('isAgreeTermsAndConditions', {
              rules: [{
                required: true,
                validator: this.termsAndConditionsValidator,
              }],
            })(
              <Checkbox>I have read and agree to the <a onClick={this.onTerms}>Terms and Conditions.</a></Checkbox>
            )}
            </Form.Item>
          </Form>
        </PS.FormContainer>
        <PS.FormContainer>
          <S.Buttons>
            <Button onClick={this.props.onPreviousStep}><Icon type="left"/>Back</Button>
            <Button type="primary" onClick={this.onSubmitClick}>Submit</Button>
          </S.Buttons>
        </PS.FormContainer>
      </PS.StepContainer>
    );
  }
}

const WrappedSubmitStep = Form.create({
  name: 'submit',
  mapPropsToFields: props => {
    const fields = props.state.noteForm.submitStepFields;
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
})(SubmitStep);

const ObservingWrappedSubmitStep = observer(props => {
  return <WrappedSubmitStep {...props}/>
});

export default ObservingWrappedSubmitStep;