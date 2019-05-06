import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';
import { Typography, Alert } from 'antd';
import * as S from './styles';
import CreateAccountForm from './create_account_form';
import * as usersApi from 'api/users';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { redirectToAccountIfLoggedIn } from 'utils/users';

const { Title } = Typography;

@observer class CreateAccountPage extends Component {
  @observable tryingCreate = false;
  @observable createFailed = false;
  @observable createSucceeded = false;

  onCreateAccount = async fields => {
    this.tryingCreate = true;
    try {
      await usersApi.createAccount(fields.email, fields.password);
      this.createSucceeded = true;
      this.createFailed = false;
      window.location.href = '/login/';
    } catch (e) {
      this.createSucceeded = false;
      this.createFailed = true;
    }
    this.tryingCreate = false;
  };

  componentDidMount() {
    if (redirectToAccountIfLoggedIn()) {
      this.createSucceeded = true;
    }
  }
  
  render () {
    return (
      <Page showLogin={false}>
        <PageContent>
          <S.CreateAccount>
            <Title>Create Account</Title>
            <CreateAccountForm
              onCreateAccount={this.onCreateAccount}
              isButtonLoading={this.tryingCreate}
              isButtonDisabled={this.createSucceeded}/>
            { this.createFailed &&
              <Alert
                showIcon
                type="error"
                message="Account Creation Failed"
                description="Invalid username/password or email already in use."/>
            }
            { this.createSucceeded &&
              <Alert
                showIcon
                type="success"
                message="Account Creation Succeeded"
                description="Redirecting..."/>
            }
          </S.CreateAccount>
        </PageContent>
      </Page>
    )};
}

ReactDOM.render(<CreateAccountPage/>, document.getElementById("root"));