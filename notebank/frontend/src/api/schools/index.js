import { get } from 'api';

export const getSchools = async searchQuery => {
  const params = {
    limit: 10,
  };
  if (searchQuery && searchQuery !== '') {
    params.name = searchQuery
  }
  const res = await get('schools/', params);
  return res.data;
};

export const getSchool = async schoolId => {
  const res = await get(`schools/${schoolId}/`);
  return res.data;
};

export const getCourses = async (schoolId, searchQuery) => {
  const params = {
    limit: 10,
  };
  if (searchQuery && searchQuery !== '') {
    params.course_code = searchQuery
  }
  const res = await get(`schools/${schoolId}/courses/`, params);
  return res.data;
};

export const getCourse = async (schoolId, courseId) => {
  const res = await get(`schools/${schoolId}/courses/${courseId}/`);
  return res.data;
};