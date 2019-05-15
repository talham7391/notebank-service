import React, { Component } from 'react';
import { Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { isBlank } from 'utils/strings';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { schoolCache, courseCache } from '../utils';
import * as urls from 'constants/page/urls';

@observer class BrowseBreadcrumb extends Component {
  @observable schoolName = null;
  @observable courseName = null;

  getSchoolId = _ => {
    return this.props.match.params.schoolid;
  };
  
  getCourseId = _ => {
    return this.props.match.params.courseid;
  };

  shouldShowSchool = _ => {
    return this.props.match.params.schoolid != null;
  };

  shouldShowCourse = _ => {
    return this.props.match.params.courseid != null;
  };

  async componentDidMount() {
    let schoolReq = null;
    if (this.shouldShowSchool()) {
      schoolReq = schoolCache.getSchoolNameFromId(this.getSchoolId());
    }
    let courseReq = null;
    if (this.shouldShowCourse()) {
      courseReq = courseCache.getCourseNameFromId(this.getSchoolId(), this.getCourseId());
    }
    this.schoolName = await schoolReq;
    this.courseName = await courseReq;
  }

  render() {
    return (
      <Breadcrumb>
        <Breadcrumb.Item><Link to={urls.HASH_HOME}><Icon type="bank"/></Link></Breadcrumb.Item>
        { this.shouldShowSchool() &&
          <Breadcrumb.Item>
            <Link to={urls.hashGotoSchool(this.getSchoolId())}>
              {isBlank(this.schoolName) ? <Icon type="loading"/> : this.schoolName}
            </Link>
          </Breadcrumb.Item>
        }
        { this.shouldShowCourse() &&
          <Breadcrumb.Item>
            <Link to={urls.hashGotoCourse(this.getSchoolId(), this.getCourseId())}>
              {isBlank(this.courseName) ? <Icon type="loading"/> : this.courseName}
            </Link>
          </Breadcrumb.Item>
        }
      </Breadcrumb>
    );
  }
}

export default BrowseBreadcrumb;