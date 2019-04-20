import { observable, computed, action } from 'mobx';

class NoteFormState {
  @observable schoolId = undefined;
  @observable courseCode = undefined;
  @observable academicYear = undefined;
  @observable title = undefined;
  @observable files = [];
  @observable showFileErrors = false;
  @observable blurAmount = undefined;

  @action addFile = url => {
    this.showFileErrors = false;
    this.files.push(url);
  }

  @action reorderFiles = list => {
    this.files.replace(list);
  };

  @action deleteFile = file => {
    this.files.replace(this.files.filter(f => f.url !== file.url));
  };

  @action validateFiles = _ => {
    if (this.files.length === 0) {
      this.showFileErrors = true;
      return {
        files: {
          errors: [{
            field: 'files',
            message: 'Please upload atleast 1 file.',
          }],
        },
      };
    }
    return null;
  };

  @computed get uploadStepFields() {
    return {
      schoolId: this.schoolId,
      courseCode: this.courseCode,
      academicYear: this.academicYear,
      title: this.title,
      blurAmount: this.blurAmount,
    };
  }

  @computed get uploadStepFieldsValues() {
    return {
      schoolId: this.schoolId?.value,
      courseCode: this.courseCode?.value,
      academicYear: this.academicYear?.value,
      title: this.title?.value,
      blurAmount: this.blurAmount?.value,
    };
  }

  @computed get pageCount() {
    return this.files.length;
  }

  @observable email = undefined;

  @computed get moneyStepFields() {
    return {
      email: this.email,
    };
  }

  @computed get moneyStepFieldsValues() {
    return {
      email: this.email?.value,
    };
  }

  @computed get submitStepFields() {
    return {};
  }

  @computed get submitStepFieldsValues() {
    return {};
  }

  @computed get allFields() {
    return {
      ...this.uploadStepFieldsValues,
      ...this.moneyStepFieldsValues,
      ...this.submitStepFieldsValues,
    };
  }
}

const state = {
  noteForm: new NoteFormState(),
};

export default state;