import axios from 'axios';

const HOST = 'localhost';
const PORT = '8000';

const get = async (endpoint, params = {}) => {
  const base = `http://${HOST}:${PORT}/api/${endpoint}`;
  let paramsStr = null;
  for (let i in params) {
    if (paramsStr) {
      paramsStr += `&${i}=${params[i]}`
    } else {
      paramsStr = `?${i}=${params[i]}`
    }
  }
  const res = await axios.get(`${base}${paramsStr}`);
  return res;
};

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