import axios from 'axios';

const HOST = 'localhost';
const PORT = '8000';

const getBase = endpoint => `http://${HOST}:${PORT}/api/${endpoint}`;

const createParamsStr = params => {
  let paramsStr = '';
  for (let i in params) {
    if (paramsStr == '') {
      paramsStr = `?${i}=${params[i]}`
    } else {
      paramsStr += `&${i}=${params[i]}`
    }
  }
  return paramsStr;
};

export const get = async (endpoint, params = {}) => {
  const base = getBase(endpoint);
  const paramsStr = createParamsStr(params);
  const res = await axios.get(`${base}${paramsStr}`);
  return res;
};

export const post = async (endpoint, body, params = {}, config={}) => {
  const base = getBase(endpoint);
  const paramsStr = createParamsStr(params);
  const res = await axios.post(`${base}${paramsStr}`, body, config);
  return res;
};

export const put = async (endpoint, body, params = {}) => {
  const base = getBase(endpoint);
  const paramsStr = createParamsStr(params);
  const res = await axios.put(`${base}${paramsStr}`, body);
  return res;
};

export const setToken = token => {
  document.cookie = `auth_token=${token}; path=/`;
  useTokenIfExists();
};

export const useTokenIfExists = _ => {
  const cookies = document.cookie;
  const cookiesArr = cookies.split(';').map(cookieStr => cookieStr.split('='));
  const token = cookiesArr.find(cookie => cookie[0].trim() === 'auth_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `JWT ${token[1].trim()}`
  }
};

useTokenIfExists();