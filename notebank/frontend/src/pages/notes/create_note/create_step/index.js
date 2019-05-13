import React, { Component } from 'react';
import * as PS from '../styles';
import * as S from './styles';
import { observer } from 'mobx-react';
import { observable, action, toJS, computed } from 'mobx';
import { Progress, Typography, Steps, Icon, Alert } from 'antd';
import * as notesApi from 'api/notes';
import axios from 'axios';

const { Title } = Typography;
const Step = Steps.Step;

@observer class CreateStep extends Component {
  @observable current = null;
  @observable progress = 0;
  @observable showError = false;
  note = null;

  doCreateNote = async _ => {
    const { title, courseId, academicYear } = toJS(this.props.state.noteForm.uploadStepFieldsValues);
    this.note = await notesApi.createNote(title, courseId, academicYear);
  };

  @action doUploadDocuments = async _ => {
    const files = toJS(this.props.state.noteForm.files);
    const percents = files.map(_ => ({
      loaded: 0,
      total: 0,
    }));

    const updateProgress = _ => {
      let totalSum = 0;
      let loadedSum = 0;
      percents.forEach(percent => {
        totalSum += percent.total;
        loadedSum += percent.loaded;
      });
      const done = loadedSum / totalSum;

      this.progress = Math.round(done * 100);
    };

    const onProgressFunc = idx => evt => {
      percents[idx].loaded = evt.loaded;
      percents[idx].total = evt.total;
      updateProgress();
    };

    const fileObjects = [];
    for (let i = 0; i < files.length; i++) {
      const fileRes = await axios({method: 'get', url: files[i].url, responseType: 'blob'});
      const file = new File([fileRes.data], files[i].name, {type: fileRes.data.type});
      fileObjects.push(file);
      percents[i].total = file.size;
    }

    for (let i = 0; i < files.length; i++) {
      this.current = i;

      const sheet = await notesApi.createSheet(this.note.id, files[i].name, false, i, files[i].type);
      const presignedUrl = sheet.upload_url;

      await notesApi.uploadSheet(presignedUrl.url, presignedUrl.fields, fileObjects[i], onProgressFunc(i));
    }

    this.current = files.length;
    this.progress = 100;
  };

  @action async componentDidMount() {
    try {
      await this.doCreateNote();
      await this.doUploadDocuments();
      window.location.href = `/notes/#/${this.note.id}/`;
    } catch (e) {
      this.showError = true;
    }
  }

  @computed get doneUploading() {
    return this.progress === 100;
  }

  render() {
    const files = toJS(this.props.state.noteForm.files);

    return (
      <PS.StepContainer>
        <PS.FormContainer>
          <S.CreateStep>
            <Title level={4}>Uploading Documents</Title>
            <Progress
              percent={this.progress}
              status={this.showError ? 'exception' : this.doneUploading ? 'success' : 'active'}/>
            <S.Files>
              <Steps current={this.current} direction="vertical" size="small">
                { files.map((file, idx) => (
                  <Step key={idx} title={file.name} icon={this.current === idx ? <Icon type="loading"/> : undefined}/>
                )) }
              </Steps>
            </S.Files>
            <S.InfoContainer>
              { this.doneUploading && this.showError !== true &&
                <Alert message="Redirecting to note..." type="success" showIcon/>
              }
              { this.showError &&
                <Alert message="Something went wrong." type="error" showIcon/>
              }
            </S.InfoContainer>
          </S.CreateStep>
        </PS.FormContainer>
      </PS.StepContainer>
    );
  }
}

export default CreateStep;