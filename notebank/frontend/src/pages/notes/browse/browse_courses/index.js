import React, { Component, Fragment } from 'react';
import { Icon, Input, Typography, List } from 'antd';
import * as PS from '../styles';
import * as S from './styles';
import { DebouncedFunc } from 'utils/rxjs';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import * as schoolsApi from 'api/schools';
import { Link } from 'react-router-dom';
import BrowseBreadcrumb from '../breadcrumb';
import { courseCache } from '../utils';
import * as urls from 'constants/page/urls';

const { Title, Text } = Typography;

const DebouncedInput = DebouncedFunc('onChange', 200, evt => evt.target.value)(Input);

@observer class BrowseCourses extends Component {
  @observable courses = [];
  @observable loading = false;
  @observable schoolName = null;
  searchValue = null;
  currentPage = 0;

  getSchoolId = _ => {
    return this.props.match.params.schoolid;
  };

  @action onCourseSearch = async value => {
    this.searchValue = value;
    this.loading = true;
    this.courses = await schoolsApi.getCourses(this.getSchoolId(), value);
    this.currentPage = 1;
    this.loading = false;
  };

  @action loadCourses = async _ => {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const LOAD_NUMBER = 10;
    if (this.currentPage === 0) {
      this.courses = await schoolsApi.getCourses(this.getSchoolId(), this.searchValue, {
        limit: LOAD_NUMBER,
      });
    } else {
      const moreCourses = await schoolsApi.getCourses(this.getSchoolId(), this.searchValue, {
        limit: LOAD_NUMBER,
        offset: this.currentPage * LOAD_NUMBER,
      });
      this.courses = [
        ...this.courses,
        ...moreCourses,
      ];
    }
    this.currentPage += 1;
    this.loading = false;
  };

  @action onScroll = evt => {
    if (window.scrollY + window.innerHeight === document.body.scrollHeight) {
      this.loadCourses();
    }
  };

  @action componentDidMount() {
    window.scrollTo(0, 0);
    this.loadCourses();
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  updateCourseCache = course => {
    courseCache.setCourseForId(course.id, course);
  };

  render() {
    return (
      <Fragment>
        <BrowseBreadcrumb {...this.props}/>
        <PS.BrowseContainer>
          <Title>Select Course</Title>
          <DebouncedInput
            prefix={<Icon type="search"/>}
            suffix={this.loading ? <Icon type="loading"/> : undefined}
            placeholder="Course Name"
            onChange={this.onCourseSearch}/>
          <List
            style={{marginTop: '1em'}}
            itemLayout="horizontal"
            dataSource={this.courses}
            renderItem={course => (
              <List.Item actions={[<Link onClick={_ => this.updateCourseCache(course)} to={urls.hashGotoCourse(this.getSchoolId(), course.id)}>Select</Link>]}>
                <List.Item.Meta
                  title={course.course_code}
                  description={course.name}/>
              </List.Item>
            )}/>
          { this.loadCourses && 
            <S.Loading>
              <Icon type="loading"/>
            </S.Loading>
          }
        </PS.BrowseContainer>
      </Fragment>
    );
  }
}

export default BrowseCourses;