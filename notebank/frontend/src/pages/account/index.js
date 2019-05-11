import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';
import { Typography, Button, List } from 'antd';
import * as S from './styles';

const { Title, Paragraph } = Typography;

class AccountPage extends Component {
  render () {
    return (
      <Page showLogout={true}>
        <PageContent>
          <Title>My Notes</Title>
          <List
            itemLayout="horizontal"
            dataSource={[]}/>
        </PageContent>
      </Page>
    )};
}

ReactDOM.render(<AccountPage/>, document.getElementById("root"));