import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';
import { Typography, Button, List, Divider } from 'antd';
import * as S from './styles';
import * as notesApi from 'api/notes';
import { redirectToLoginIfLoggedOut } from 'utils/users';

const { Title, Paragraph } = Typography;

class AccountPage extends Component {
  
  async componentDidMount() {
    if (redirectToLoginIfLoggedOut()) {
      return;
    }
    const notes = await notesApi.getNotesForAuthenticatedUser();
    console.log(notes);
  }

  onUploadNote = _ => {
    window.location.href = '/notes/create/';
  };

  render () {
    return (
      <Page showLogout={true}>
        <PageContent>
          <Title>My Notes</Title>
          <Divider/>
          <Button icon="upload" type="primary" onClick={this.onUploadNote}>Upload Note</Button>
          <List
            itemLayout="horizontal"
            dataSource={[]}/>
        </PageContent>
      </Page>
    )};
}

ReactDOM.render(<AccountPage/>, document.getElementById("root"));