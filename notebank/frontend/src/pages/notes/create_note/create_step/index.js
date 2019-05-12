import React, { Component } from 'react';
import { Steps, Progress, Alert, Icon } from 'antd';
import * as PS from '../styles';
import { observer } from 'mobx-react';
import { observable, toJS } from 'mobx';
import { getProgressStatus, changeExtensionToPng } from './utils';
import * as notesApi from 'api/notes';
import * as usersApi from 'api/users';
import axios from 'axios';

const Step = Steps.Step;

@observer class CreateStep extends Component {
  @observable showError = false;
  @observable currentStep = 0;
  @observable progress = {
    uploadNote: 0,
    processDocuments: 0,
    uploadDocuments: 0,
  };

  createdNote = undefined;
  uploadFiles = [];

  doUploadNote = async _ => {
    const uploadData = this.props.state.noteForm.uploadStepFieldsValues;
    const moneyData = this.props.state.noteForm.moneyStepFieldsValues;
    this.createdNote = await notesApi.createNote(
      uploadData.title,
      uploadData.courseId,
      uploadData.academicYear,
    );
    this.progress.uploadNote = 100;
  };

  doProcessDocuments = async _ => {
    for (let i in this.props.state.noteForm.files) {
      const pages = await blurFile(this.props.state.noteForm.files[i]);
      this.uploadFiles.push(...pages.map((page, idx) => ({
        ...toJS(this.props.state.noteForm.files[i]),
        name: `${idx}-${this.props.state.noteForm.files[i].name}`,
        blurredPage: page,
      })));
      this.progress.processDocuments += Math.round(i / this.props.state.noteForm.files.length * 100);
    }
    this.progress.processDocuments = 100;
  };

  doUploadDocuments = async _ => {
    const percents = this.uploadFiles.map(_ => ({
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

      this.progress.uploadDocuments = Math.round(done * 100);
    };

    const onProgressFunc = idx => evt => {
      percents[idx].loaded = evt.loaded;
      percents[idx].total = evt.total;
      updateProgress();
    };

    const uploads = this.uploadFiles.map(async (file, idx) => {
      const blurredFileName = changeExtensionToPng(file.name);

      const fileRes = await axios({method: 'get', url: file.blurredPage, responseType: 'blob'});
      const fileToUpload = new File([fileRes.data], blurredFileName, {type: fileRes.data.type});
      percents[idx].total = fileToUpload.size;

      const res = await notesApi.createSheet(this.createdNote.id, `blurred_${blurredFileName}`, false);
      const presignedUrl = res.upload_url;

      await notesApi.uploadSheet(presignedUrl.url, presignedUrl.fields, fileToUpload, onProgressFunc(idx));
    });

    for (let i in uploads) {
      await uploads[i];
    }

    this.progress.uploadDocuments = 100;
  };

  async componentDidMount() {
    try {
      await this.doUploadNote();
      this.currentStep++;
      await this.doProcessDocuments();
      this.currentStep++;
      await this.doUploadDocuments();
      this.currentStep++;
      this.uploadDocuments();
    } catch (e) {
      console.log(e);
      this.showError = true;
    }
  }

  render() {
    return (
      <PS.StepContainer>
        <PS.FormContainer>
          { this.showError ?
            <Alert showIcon message="Error" description="Something went wrong processing your note." type="error"/>
            :
            <Steps direction="vertical" size="small" current={this.currentStep}>
              <Step
                icon={this.currentStep === 0 ? <Icon type="loading"/> : undefined}
                title="Uploading Note Data"
                description={this.renderProgress('uploadNote', 0)}/>
              <Step
                icon={this.currentStep === 1 ? <Icon type="loading"/> : undefined}
                title="Processing Documents"
                description={this.renderProgress('processDocuments', 1)}/>
              <Step
                icon={this.currentStep === 2 ? <Icon type="loading"/> : undefined}
                title="Uploading Documents"
                description={this.renderProgress('uploadDocuments', 2)}/>
            </Steps>
          }
        </PS.FormContainer>
      </PS.StepContainer>
    );
  }

  renderProgress = (key, idx) => {
    return (
      <Progress
        percent={this.progress[key]}
        size="small"
        status={getProgressStatus(idx, this.currentStep, this.progress[key])}/>
    );
  };
}

export default CreateStep;