import React, { Component, Fragment } from 'react';
import * as S from './styles';
import { Form, Select, Icon, Input, Upload, InputNumber, Button, Typography } from 'antd';
import * as PS from '../styles';
import { observer } from 'mobx-react';
import { observable, action, computed, toJS } from 'mobx';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getSchools } from 'api';
import ReorderablePreviewList from 'components/document/ReorderablePreviewList';

const { Option } = Select;
const { Text } = Typography;

@observer class UploadStep extends Component {
  @observable schoolOptions = [{id: 1, name: 'School'}];
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
    this.schoolOptions = await getSchools(search);
    this.isLoadingSchools = false;
  };

  @action componentDidMount = async () => {
    this.searchSubject.pipe(debounceTime(100)).subscribe(this.updateSchoolOptions);
    this.schoolOptions = await getSchools();
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

  validateFields = _ => {
    this.props.form.validateFields((err, values) => {
      this.props.state.noteForm.validateFiles();
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <PS.FormContainer>
          <Form layout="vertical">
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
              {getFieldDecorator('academicYear', {
                rules: [{required: true, message: 'Please choose an academic year.'}],
              })(
                <InputNumber placeholder="YYYY" min={1900} max={new Date().getFullYear()}/>
              )}
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
                  {this.props.state.noteForm.files.length > 0 ? 'Upload More Files' : 'Upload'}
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </PS.FormContainer>
        <PS.FormContainer>
          { this.props.state.noteForm.files.length > 0 &&
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
      </Fragment>
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
  _ = props.state.noteForm.files.slice();
  return <WrappedUploadStep {...props}/>
});

export default ObservingWrappedUploadStep;