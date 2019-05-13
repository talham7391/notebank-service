import { get, post } from 'api';
import axios from 'axios';

export const getNotesForAuthenticatedUser = async _ => {
  const res = await get('notes/authenticated/');
  return res.data;
};

export const getNotesForCourse = async course => {
  const res = await get(`notes/`, {course});
  return res.data;
};

export const getNote = async id => {
  const res = await get(`notes/${id}/`);
  return res.data;
};

export const createNote = async (title, courseId, academicYear) => {
  const res = await post('notes/', {
    title,
    course: courseId,
    academic_year: academicYear,
  });
  return res.data;
};

export const getSheets = async noteId => {
  const res = await get(`notes/${noteId}/sheets/`);
  return res.data;
};

export const createSheet = async (noteId, fileName, isSecret, order, fileType) => {
  const res = await post(`notes/${noteId}/sheets/`, {
    file_name: fileName,
    is_secret: isSecret,
    order,
    file_type: fileType,
  });
  return res.data;
};

export const uploadSheet = async (url, fields, file, onProgressCallback) => {
  const fd = new FormData();
  for (let key in fields) {
    fd.append(key, fields[key]);
  }
  fd.append('file', file);

  const res = await axios.post(url, fd, {
    onUploadProgress: onProgressCallback,
    transformRequest: [(data, headers) => {
      delete headers.common.Authorization;
      return data;
    }],
  });

  return res;
};

export const downloadSheet = async url => {
  return await axios({
    method: 'get',
    url,
    responseType: 'blob',
    transformRequest: [(data, headers) => {
      delete headers.common.Authorization;
      return data;
    }],
  });
};