
export const HOME = '/';
export const LOGIN = '/login/';
export const CREATE_ACCOUNT = '/create-account/';
export const ACCOUNT = '/account/';
// export const BROWSE_NOTES = '/notes/browse/';
export const BROWSE_NOTES = '/notes/browse/#/school/1/';
export const CREATE_NOTE = '/notes/create/';
export const NOTES = '/notes/';
export const NOTE = noteId => `${NOTES}#/${noteId}/`;

// export const HASH_HOME = '/';
export const HASH_HOME = '/school/1/';
export const HASH_SCHOOL = '/school/';

export const goto = url => {
  window.location.href = url;
};

export const hashGotoSchool = schoolId => `${HASH_SCHOOL}${schoolId}/`;
export const hashGotoCourse = (schoolId, courseId) => `${hashGotoSchool(schoolId)}course/${courseId}/`