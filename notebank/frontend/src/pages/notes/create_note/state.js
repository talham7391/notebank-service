import { observable, computed, action } from 'mobx';

class NoteFormState {
  @observable schoolId = undefined;
  @observable courseCode = undefined;
  @observable academicYear = undefined;
  @observable files = [];
  @observable showFileErrors = false;

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
    }
  };

  // @computed get isUploadStepDone() {
  //   return this.schoolId != null && this.courseCode != null && this.courseCode != '' && this.academicYear != null;
  // }

  @computed get uploadStepFields() {
    return {
      schoolId: this.schoolId,
      courseCode: this.courseCode,
      academicYear: this.academicYear,
    };
  }
}

const state = {
  noteForm: new NoteFormState(),
};

export default state;