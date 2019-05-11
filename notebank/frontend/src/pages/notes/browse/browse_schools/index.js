import React, { Component, Fragment } from 'react';
import { Breadcrumb, Icon, Input, Typography, List, Avatar } from 'antd';
import * as PS from '../styles';
import * as S from './styles';
import { DebouncedFunc } from 'utils/rxjs';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import * as schoolsApi from 'api/schools';
import { Link } from 'react-router-dom';
import { schoolCache } from '../utils';
import BrowseBreadcrumb from '../breadcrumb';

const { Title, Text } = Typography;

const DebouncedInput = DebouncedFunc('onChange', 200, evt => evt.target.value)(Input);

@observer class BrowseSchools extends Component {
  @observable loading = false;
  @observable schools = [];

  @action onSchoolSearch = async value => {
    this.loading = true;
    this.schools = await schoolsApi.getSchools(value);
    this.loading = false;
  };

  @action async componentDidMount() {
    this.schools = await schoolsApi.getSchools();
  }

  updateSchoolCache = school => {
    schoolCache.setSchoolForId(school.id, school);
  };

  render() {
    return (
      <Fragment>
        <BrowseBreadcrumb {...this.props}/>
        <PS.BrowseContainer>
          <Title>Select School</Title>
          <DebouncedInput
            prefix={<Icon type="search"/>}
            suffix={this.loading ? <Icon type="loading"/> : undefined}
            placeholder="School Name"
            onChange={this.onSchoolSearch}/>
          <List
            style={{marginTop: '1em'}}
            itemLayout="horizontal"
            dataSource={this.schools}
            renderItem={school => (
              <List.Item actions={[<Link onClick={_ => this.updateSchoolCache(school)} to={`/school/${school.id}/`}>Select</Link>]}>
                <List.Item.Meta
                  avatar={<SchoolImage src={school.thumbnail_url}/>}
                  title={school.name}
                  description={`${school.city}, ${school.country}`}/>
              </List.Item>
            )}/>
        </PS.BrowseContainer>
      </Fragment>
    );
  }
}

const SchoolImage = props => (
  <S.SchoolImage src={props.src}/>
);

export default BrowseSchools;