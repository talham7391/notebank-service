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

  @computed get pageCount() {
    return this.files.length;
  }

  @observable cardNumber = undefined;
  @observable expiration = undefined;
  @observable cvv = undefined;

  @computed get moneyStepFields() {
    return {
      cardNumber: this.cardNumber,
      expiration: this.expiration,
      cvv: this.cvv,
    };
  }
}

const state = {
  noteForm: new NoteFormState(),
};

export default state;