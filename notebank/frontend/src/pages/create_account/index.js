import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';
import { Typography } from 'antd';
import * as S from './styles';

const { Title } = Typography;

class CreateAccountPage extends Component {
  render () {
    return (
      <Page showLogin={false}>
        <PageContent>
          <S.CreateAccount>
            <Title>Create Account</Title>
          </S.CreateAccount>
        </PageContent>
      </Page>
    )};
}

ReactDOM.render(<CreateAccountPage/>, document.getElementById("root"));