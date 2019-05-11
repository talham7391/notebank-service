import React, { Component, Fragment } from 'react';
import { Icon, Input, Typography, List } from 'antd';
import * as PS from '../styles';
import BrowseBreadcrumb from '../breadcrumb';

const { Title, Text } = Typography;

class DisplayNotes extends Component {

  render() {
    return (
      <Fragment>
        <BrowseBreadcrumb {...this.props}/>
        <PS.BrowseContainer>
          <Title>Notes</Title>
        </PS.BrowseContainer>
      </Fragment>
    );
  }
}

export default DisplayNotes;