import * as schoolsApi from 'api/schools';

export const getLogisticsFromNote = async note => {
  const course = await schoolsApi.getCourseIndependant(note.course);
  const school = await schoolsApi.getSchool(course.school);
  return {
    school,
    course,
  };
};