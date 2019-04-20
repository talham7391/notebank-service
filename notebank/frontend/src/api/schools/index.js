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