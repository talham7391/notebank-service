import React, { Component, Fragment } from 'react';
import * as S from './styles';
import { Form, Select, Icon, Input, Upload, InputNumber, Button, Typography, Radio, message, Checkbox } from 'antd';
import * as PS from '../styles';
import { observer } from 'mobx-react';
import { observable, action, computed, toJS } from 'mobx';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getSchool, getSchools, getCourse, getCourses } from 'api/schools';
import ReorderablePreviewList from 'components/document/ReorderablePreviewList';
import { VALIDATE_NOTE_CREATION } from 'constants/global';

const { Option } = Select;
const { Text } = Typography;

@observer class UploadStep extends Component {
  @observable schoolOptions = [];
  @observable courseOptions = [];
  @observable isLoadingSchools = false;
  @observable isLoadingCourses = false;
  schoolSearchSubject = new Subject();
  courseSearchSubject = new Subject();

  onSchoolSearch = search => {
    this.schoolSearchSubject.next(search);
  };

  onCourseSearch = search => {
    this.courseSearchSubject.next(search);
  };

  @action handleUploadRequest = evt => {
    const x = new Blob([evt], {type: evt.type});
    const url = URL.createObjectURL(x);
    this.props.state.noteForm.addFile({
      url,
      name: evt.name,
      type: evt.type,
    });
    return new Promise(_ => false);
  };

  @action updateCourseOptionsHelper = async (schoolId, search) => {
    this.isLoadingCourses = true;
    this.courseOptions = [];
    this.courseOptions = await getCourses(schoolId, search);
    this.isLoadingCourses = false;
  };

  @action onSchoolSelect = id => {
    this.props.state.noteForm.courseId = undefined;
    this.updateCourseOptionsHelper(id, '');
  };

  @action updateSchoolOptions = async search => {
    this.isLoadingSchools = true;
    this.schoolOptions = [];
    this.schoolOptions = await getSchools(search);
    this.isLoadingSchools = false;
  };

  @action updateCourseOptions = search => this.updateCourseOptionsHelper(this.props.state.noteForm.schoolId.value, search);

  @action componentDidMount = async () => {
    this.schoolSearchSubject.pipe(debounceTime(100)).subscribe(this.updateSchoolOptions);
    this.courseSearchSubject.pipe(debounceTime(100)).subscribe(this.updateCourseOptions);
    if (this.props.state.noteForm.schoolId != null) {
      this.schoolOptions = [{
        id: this.props.state.noteForm.schoolId.value,
        name: 'Loading School Name...',
      }];
      this.schoolOptions = [await getSchool(this.props.state.noteForm.schoolId.value)];
    } else {
      this.schoolOptions = await getSchools();
    }
    if (this.props.state.noteForm.courseId != null) {
      this.courseOptions = [{
        id: this.props.state.noteForm.courseId.value,
        course_code: 'Loading Course Code...',
      }];
      this.courseOptions = [await getCourse(this.props.state.noteForm.schoolId.value, this.props.state.noteForm.courseId.value)];
    } else {
      this.updateCourseOptions('');
    }
  };

  @computed get renderSchoolOptions() {
    return this.schoolOptions.map(option => (
      <Option key={option.id} value={option.id}>{option.name}</Option>
    ));
  };

  @computed get renderCourseOptions() {
    return this.courseOptions.map(option => (
      <Option key={option.id} value={option.id}>{option.course_code}</Option>
    ));
  };

  @action onReorderFiles = list => {
    this.props.state.noteForm.reorderFiles(list);
  };

  @action onDeleteFile = file => {
    this.props.state.noteForm.deleteFile(file);
  };

  onTerms = evt => {
    evt.preventDefault();
    window.location.href = '/terms-and-conditions/';
  };

  termsAndConditionsValidator(rule, value, callback) {
    const errors = [];
    if (value !== true) {
      errors.push('You must agree to the terms and conditions.');
    }
    callback(errors);
  }

  validateFields = async _ => {
    const err = await new Promise((res, rej) => {
      this.props.form.validateFields((err, values) => {
        const fileErrors = this.props.state.noteForm.validateFiles();
        res({...err, ...fileErrors});
      });
    });
    return Object.keys(err).length > 0 ? err : null;
  };

  onNextClick = async _ => {
    if (!VALIDATE_NOTE_CREATION) {
      this.props.onNextStep();
      return;
    }
    const errs = await this.validateFields();
    if (errs == null) {
      this.props.onNextStep();
    } else {
      message.error('You must fix the errors in your form.');
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const sliderMarks = {};
    const numPages = this.props.state.noteForm.pageCount;
    if (numPages !== 0) {
      const jump = Math.ceil(100 / numPages);
      for (let i = 0; i <= 100; i += jump) {
        sliderMarks[i > 100 ? 100 : i] = '';
      }
    }

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <PS.StepContainer>
        <PS.FormContainer>
          <Form layout="vertical">
            <Form.Item label="Title">
              {getFieldDecorator('title', {
                rules: [{required: true, message: 'Please enter a title.'}],
              })(
                <Input placeholder="Assignment 4 Solutions"/>
              )}
            </Form.Item>
            <Form.Item label="School" required={true}>
              {getFieldDecorator('schoolId', {
                rules: [{required: true, message: 'Please select a school.'}],
              })(
                <Select
                  disabled={true}
                  onChange={this.onSchoolSelect}
                  showSearch
                  notFoundContent={this.isLoadingSchools ? <Icon type="loading"/> : 'No schools found.'}
                  filterOption={_ => true}
                  onSearch={this.onSchoolSearch}
                  suffixIcon={<Icon type="search"/>}
                  placeholder="University of Ontario">
                  { this.renderSchoolOptions }
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Course Code">
              {getFieldDecorator('courseId', {
                rules: [{required: true, message: 'Please enter a course code.'}],
              })(
                <Select
                  disabled={this.props.state.noteForm.schoolId == null}
                  showSearch
                  notFoundContent={this.isLoadingCourses ? <Icon type="loading"/> : 'No courses found.'}
                  filterOption={_ => true}
                  onSearch={this.onCourseSearch}
                  suffixIcon={<Icon type="search"/>}
                  placeholder="ABC 123">
                  { this.renderCourseOptions }
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Academic Year">
              <Input.Group>
              <Input
                disabled
                style={{
                  width: '75px',
                  textAlign: 'center',
                  borderRight: 'none',
                }}
                value={`${this.props.state.noteForm.academicYear ? this.props.state.noteForm.academicYear.value - 1 : '-'} /`} />
                {getFieldDecorator('academicYear', {
                  rules: [{required: true, message: 'Please choose an academic year.'}],
                })(
                  <InputNumber style={{
                    width: '75px',
                    borderTopLeftRadius: '0px',
                    borderBottomLeftRadius: '0px',
                  }}
                  placeholder="YYYY"
                  min={1900}
                  max={new Date().getFullYear() + 1}/>
                )}
              </Input.Group>
            </Form.Item>
            <Form.Item
              label="Files"
              required="true"
              help={this.props.state.noteForm.showFileErrors ? 'Please upload at least 1 file.' : ''}
              validateStatus={this.props.state.noteForm.showFileErrors ? 'error' : 'success'}>
              <Upload
                accept=".pdf,.png,.jpg"
                showUploadList={false}
                action={this.handleUploadRequest}
                multiple={true}>
                <Button>
                  <Icon type="upload" />
                  {this.props.state.noteForm.pageCount > 0 ? 'Upload More Files' : 'Upload'}
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </PS.FormContainer>
        { this.props.state.noteForm.pageCount > 0 &&
          <Fragment>
            <PS.FormContainer>
              <S.DragInfo><Text type="secondary">Click/hold & drag to reorder the files.</Text></S.DragInfo>
            </PS.FormContainer>
            <S.FilesContainer>
              <S.HorizontalScroll>
                <ReorderablePreviewList
                  files={this.props.state.noteForm.files}
                  onReorder={this.onReorderFiles}
                  onDeleteFile={this.onDeleteFile}/>
              </S.HorizontalScroll>
            </S.FilesContainer>
          </Fragment>
        }
        <PS.FormContainer>
          <Form>
            <Form.Item>
              {getFieldDecorator('isAgreeTermsAndConditions', {
                rules: [{
                  required: true,
                  validator: this.termsAndConditionsValidator,
                }],
              })(
                <Checkbox>I agree to the <a onClick={this.onTerms}>Terms and Conditions.</a></Checkbox>
              )}
            </Form.Item>
            <Form.Item>
              <S.Buttons><Button type="primary" onClick={this.onNextClick}>Upload</Button></S.Buttons>
            </Form.Item>
          </Form>
        </PS.FormContainer>
      </PS.StepContainer>
    );
  }
}

const WrappedUploadStep = Form.create({
  name: 'upload',
  mapPropsToFields: props => {
    const fields = props.state.noteForm.uploadStepFields;
    const retval = {};
    for (let f in fields) {
      retval[f] = Form.createFormField(toJS(fields[f]));
    }
    return retval;
  },
  onFieldsChange: (props, fields) => {
    for (let field in fields) {
      props.state.noteForm[field] = fields[field];
    }
  },
})(UploadStep);

const ObservingWrappedUploadStep = observer(props => {
  let _ = null;
  _ = props.state.noteForm.schoolId;
  _ = props.state.noteForm.courseId;
  _ = props.state.noteForm.academicYear;
  _ = props.state.noteForm.title;
  _ = props.state.noteForm.files.slice();
  _ = props.state.noteForm.isAgreeTermsAndConditions;
  return <WrappedUploadStep {...props}/>
});

export default ObservingWrappedUploadStep;