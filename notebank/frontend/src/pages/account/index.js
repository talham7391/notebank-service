import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';
import { Typography, Button, List, Divider } from 'antd';
import * as S from './styles';
import * as notesApi from 'api/notes';
import { redirectToLoginIfLoggedOut } from 'utils/users';
import { observer } from 'mobx-react';
import { observable, action, toJS } from 'mobx';

const { Title, Paragraph } = Typography;

@observer class AccountPage extends Component {
  @observable notes = [];
  
  async componentDidMount() {
    if (redirectToLoginIfLoggedOut()) {
      return;
    }
    this.notes = await notesApi.getNotesForAuthenticatedUser();
  }

  onUploadNote = _ => {
    window.location.href = '/notes/create/';
  };

  gotoNote = noteId => {
    window.location.href = `/notes/#/${noteId}/`;
  };

  render () {
    return (
      <Page showLogout={true}>
        <PageContent>
          <Title>My Notes</Title>
          <Divider/>
          <Button icon="upload" type="primary" onClick={this.onUploadNote}>Upload Note</Button>
          <List
            style={{marginTop: '1.5em'}}
            itemLayout="horizontal"
            dataSource={this.notes}
            renderItem={note => (
              <List.Item actions={[<a onClick={_ => this.gotoNote(note.id)}>View</a>]}>
                <List.Item.Meta
                  title={note.title}/>
              </List.Item>
            )}/>
        </PageContent>
      </Page>
    )};
}

ReactDOM.render(<AccountPage/>, document.getElementById("root"));