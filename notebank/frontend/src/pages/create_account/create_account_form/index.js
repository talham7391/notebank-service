import React, { Component } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import * as S from './styles';

class CreateAccountForm extends Component {
  
  onSubmit = evt => {
    evt.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err == null) {
        this.props.onCreateAccount?.call(this.props, values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="vertical" onSubmit={this.onSubmit}>
        <Form.Item label="Email">
          {getFieldDecorator('email', {
            rules: [{
              required: true,
              message: 'Missing email.',
            }, {
              type: 'email',
              message: 'Invalid email.',
            }],
          })(
            <Input prefix={<Icon type="user" style={{color: 'rgba(0, 0, 0, 0.25)'}}/>}/>
          )}
        </Form.Item>
        <Form.Item label="Password">
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: 'Missing password.',
            }],
          })(
            <Input prefix={<Icon type="lock" style={{color: 'rgba(0, 0, 0, 0.25)'}}/>} type="password"/>
          )}
        </Form.Item>
        <Form.Item>
          <S.ButtonContainer>
            <Button
              disabled={this.props.isButtonDisabled}
              loading={this.props.isButtonLoading}
              type="primary"
              htmlType="submit">
              Create Account
            </Button>
          </S.ButtonContainer>
        </Form.Item>
      </Form>
    );
  }
};

const WrappedCreateAccountForm = Form.create({name: 'create-account'})(CreateAccountForm);

export default WrappedCreateAccountForm;