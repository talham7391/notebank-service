import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './login_form';
import * as S from './styles';
import * as usersApi from 'api/users';
import * as api from 'api';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Alert, Button, Typography } from 'antd';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';

const { Title } = Typography;

@observer class LoginPage extends Component {
  DEBUG_MODE = false;

  @observable loginFailed = false;
  @observable loginSucceeded = false;
  @observable tryingLogin = false;

  @observable testingLoading = false;
  @observable testingFailed = false;

  onLogin = async fields => {
    this.tryingLogin = true;
    try {
      const token = await usersApi.login(fields.email, fields.password);
      api.setToken(token.token);
      this.loginFailed = false;
      this.loginSucceeded = true;
      window.location.href = '/account/';
    } catch (e) {
      this.loginFailed = true;
      this.loginSucceeded = false;
    }
    this.tryingLogin = false;
  };

  testToken = async fields => {
    this.testingLoading = true;
    try {
      await usersApi.test();
      this.testingFailed = false;
    } catch (e) {
      console.log(e);
      this.testingFailed = true;
    }
    this.testingLoading = false;
  };

  render() {
    return (
      <Page showLogin={false}>
        <PageContent>
          <S.LoginPage>
            <Title>Login</Title>
            <LoginForm
              onLogin={this.onLogin}
              isButtonLoading={this.tryingLogin}
              isButtonDisabled={this.loginSucceeded}/>
            { this.loginFailed &&
              <Alert
                showIcon
                type="error"
                message="Login Failed"
                description="Invalid username/password."/>
            }
            { this.loginSucceeded &&
              <Alert
                showIcon
                type="success"
                message="Login Succeeded"
                description="Redirecting to account..."/>
            }
            { this.DEBUG_MODE &&
              <div>
                <Button loading={this.testingLoading} onClick={this.testToken}>Test Restricted Endpoint</Button>
                { this.testingFailed &&
                  <Alert
                    showIcon
                    type="error"
                    message="Test Failed"/>
                }
              </div>
            }
          </S.LoginPage>
        </PageContent>
      </Page>
    );
  } 
}

ReactDOM.render(<LoginPage/>, document.getElementById("root"));