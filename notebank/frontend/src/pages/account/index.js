import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Page from 'components/ui/page';
import { PageContent } from 'components/ui/page/styles';
import { Typography, Button, List, Divider, Icon } from 'antd';
import * as S from './styles';
import * as notesApi from 'api/notes';
import { redirectToLoginIfLoggedOut } from 'utils/users';
import { getLogisticsFromNote } from 'utils/notes';
import { observer } from 'mobx-react';
import { observable, action, toJS } from 'mobx';
import * as urls from 'constants/page/urls';

const { Title, Paragraph } = Typography;

@observer class AccountPage extends Component {
  @observable notes = [];
  
  @action async componentDidMount() {
    if (redirectToLoginIfLoggedOut()) {
      return;
    }
    this.notes = await notesApi.getNotesForAuthenticatedUser();
    this.updateNoteLogistics();
  }

  @action updateNoteLogistics = _ => {
    for (let i = 0; i < this.notes.length; i++) {
      getLogisticsFromNote(this.notes[i]).then(data => {
        this.notes[i] = {
          ...this.notes[i],
          logistics: `${data.course.course_code} - ${data.course.name}`,
        };
      });
    }
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
          <Button icon="upload" type="primary" href={urls.CREATE_NOTE}>Upload Note</Button>
          <List
            style={{marginTop: '1.5em'}}
            itemLayout="horizontal"
            dataSource={this.notes.slice()}
            renderItem={note => (
              <List.Item actions={[<a href={urls.NOTE(note.id)}>View</a>]}>
                <List.Item.Meta
                  title={note.title}
                  description={note.logistics || <Icon type="loading"/>}/>
              </List.Item>
            )}/>
        </PageContent>
      </Page>
    )};
}

ReactDOM.render(<AccountPage/>, document.getElementById("root"));