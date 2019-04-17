import React, { Component } from 'react';
import * as S from './styles';
import { Form, Select, Icon, Input, Upload, InputNumber, Button, Typography, Radio, message } from 'antd';
import * as PS from '../styles';
import { observer } from 'mobx-react';
import { observable, action, computed, toJS } from 'mobx';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getSchool, getSchools } from 'api';
import ReorderablePreviewList from 'components/document/ReorderablePreviewList';
import { BLUR_AMOUNT } from 'constants/document';
import BlurPreview from 'components/document/BlurPreview';

const { Option } = Select;
const { Text } = Typography;

@observer class UploadStep extends Component {
  @observable schoolOptions = [];
  @observable isLoadingSchools = false;
  searchSubject = new Subject();

  onSchoolSearch = search => {
    this.searchSubject.next(search);
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

  @action updateSchoolOptions = async search => {
    this.isLoadingSchools = true;
    this.schoolOptions = [];
    this.schoolOptions = await getSchools(search);
    this.isLoadingSchools = false;
  };

  @action componentDidMount = async () => {
    this.searchSubject.pipe(debounceTime(100)).subscribe(this.updateSchoolOptions);
    if (this.props.state.noteForm.schoolId != null) {
      this.schoolOptions = [{
        id: this.props.state.noteForm.schoolId.value,
        name: 'Loading School Name...',
      }];
      this.schoolOptions = [await getSchool(this.props.state.noteForm.schoolId.value)];
    } else {
      this.schoolOptions = await getSchools();
    }
  };

  @computed get renderSchoolOptions() {
    return this.schoolOptions.map(option => (
      <Option key={option.id} value={option.id}>{option.name}</Option>
    ));
  };

  @action onReorderFiles = list => {
    this.props.state.noteForm.reorderFiles(list);
  };

  @action onDeleteFile = file => {
    this.props.state.noteForm.deleteFile(file);
  };

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
    this.props.onNextStep();
    return;
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
                  showSearch
                  notFoundContent={this.isLoadingSchools ? <Icon type="loading"/> : 'No schools found.'}
                  filterOption={_ => true}
                  onSearch={this.onSchoolSearch}
                  suffixIcon={<Icon type="search"/>}
                  placeholder="University of Earth">
                  { this.renderSchoolOptions }
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Course Code">
              {getFieldDecorator('courseCode', {
                rules: [{required: true, message: 'Please enter a course code.'}],
              })(
                <Input placeholder="ABC 123"/>
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
            <Form.Item label="Blur Amount for Preview">
              <S.BlurAmount>
                {getFieldDecorator('blurAmount', {
                  rules: [{required: true, message: 'Please choose a blur amount.'}],
                })(
                  <Radio.Group>
                    <Radio style={radioStyle} value={BLUR_AMOUNT.FULL}>All of the first page.</Radio>
                    <Radio style={radioStyle} value={BLUR_AMOUNT.HALF}>Half of the first page.</Radio>
                    <Radio style={radioStyle} value={BLUR_AMOUNT.NONE}>Leave the first page visible.</Radio>
                  </Radio.Group>
                )}
                <div>
                  <BlurPreview blurAmount={this.props.state.noteForm.blurAmount?.value}/>
                </div>
              </S.BlurAmount>
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
        <PS.FormContainer>
          { this.props.state.noteForm.pageCount > 0 &&
          <S.DragInfo><Text type="secondary">Click/hold & drag to reorder the files.</Text></S.DragInfo> }
        </PS.FormContainer>
        <S.FilesContainer>
          <S.HorizontalScroll>
            <ReorderablePreviewList
              files={this.props.state.noteForm.files}
              onReorder={this.onReorderFiles}
              onDeleteFile={this.onDeleteFile}/>
          </S.HorizontalScroll>
        </S.FilesContainer>
        <PS.FormContainer>
          <S.Buttons>
            <Button type="primary" onClick={this.onNextClick}>Next<Icon type="right"/></Button>
          </S.Buttons>
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
  _ = props.state.noteForm.courseCode;
  _ = props.state.noteForm.academicYear;
  _ = props.state.noteForm.title;
  _ = props.state.noteForm.blurAmount;
  _ = props.state.noteForm.files.slice();
  return <WrappedUploadStep {...props}/>
});

export default ObservingWrappedUploadStep;