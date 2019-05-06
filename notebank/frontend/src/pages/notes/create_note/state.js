import { observable, computed, action, autorun, toJS } from 'mobx';

class NoteFormState {
  @observable schoolId = undefined;
  @observable courseId = undefined;
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
      courseId: this.courseId,
      academicYear: this.academicYear,
      title: this.title,
      blurAmount: this.blurAmount,
    };
  }

  @computed get uploadStepFieldsValues() {
    return {
      schoolId: this.schoolId?.value,
      courseId: this.courseId?.value,
      academicYear: this.academicYear?.value,
      title: this.title?.value,
      blurAmount: this.blurAmount?.value,
    };
  }

  @computed get pageCount() {
    return this.files.length;
  }

  @observable price = {
    value: 0,
  };
  @observable nonce = undefined;
  @observable cardData = undefined;

  @computed get isCardInfoPresent() {
    return this.nonce != null && this.cardData != null;
  }

  @computed get moneyStepFields() {
    return {
      price: this.price,
      nonce: this.nonce,
      cardData: this.cardData,
    };
  }

  @computed get moneyStepFieldsValues() {
    return {
      price: this.price?.value,
      nonce: this.nonce,
      cardData: this.cardData,
    };
  }

  @observable isAgreeTermsAndConditions = false;

  @computed get submitStepFields() {
    return {
      isAgreeTermsAndConditions: this.isAgreeTermsAndConditions,
    };
  }

  @computed get submitStepFieldsValues() {
    return {
      isAgreeTermsAndConditions: this.isAgreeTermsAndConditions?.value,
    };
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