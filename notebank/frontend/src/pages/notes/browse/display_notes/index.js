import React, { Component, Fragment } from 'react';
import { Icon, Input, Typography, List } from 'antd';
import * as PS from '../styles';
import BrowseBreadcrumb from '../breadcrumb';
import { observer } from 'mobx-react';
import { observable, action, toJS } from 'mobx';
import * as notesApi from 'api/notes';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

@observer class DisplayNotes extends Component {
  @observable notes = [];

  get schoolId() {
    return this.props.match.params.schoolid;
  }
  
  get courseId() {
    return this.props.match.params.courseid;
  }

  reset = _ => {
    this.notes = [];
  };

  load = async _ => {
    this.reset();
    this.notes = await notesApi.getNotesForCourse(this.courseId);
  };

  componentDidMount() {
    this.load();
  }

  gotoNote = noteId => {
    window.location.href = `/notes/#/${noteId}/`;
  };

  render() {
    return (
      <Fragment>
        <BrowseBreadcrumb {...this.props}/>
        <PS.BrowseContainer>
          <Title>Notes</Title>
          <List
            style={{marginTop: '1em'}}
            itemLayout="horizontal"
            dataSource={this.notes}
            renderItem={note => (
              <List.Item actions={[<a onClick={_ => this.gotoNote(note.id)}>View</a>]}>
                <List.Item.Meta
                  title={note.title}/>
              </List.Item>
            )}/>
        </PS.BrowseContainer>
      </Fragment>
    );
  }
}

export default DisplayNotes;