import { post } from 'api';
import axios from 'axios';

export const createNote = async (title, courseId, academicYear, price) => {
  const res = await post('notes/', {
    title,
    course: courseId,
    academic_year: academicYear,
    price,
  });
  return res.data;
};

export const createSheet = async (noteId, fileName, isSecret) => {
  const res = await post(`notes/${noteId}/sheets/`, {
    file_name: fileName,
    is_secret: isSecret,
  });
  return res.data;
};

export const uploadSheet = async (url, fields, file, onProgressCallback) => {
  const fd = new FormData();
  for (let key in fields) {
    fd.append(key, fields[key]);
  }
  fd.append('file', file);

  const headers = {
    'Content-Type': 'multipart/form-data',
  };

  const res = await axios.post(url, fd, {
    // headers,
    onUploadProgress: onProgressCallback,
    transformRequest: [(data, headers) => {
      delete headers.common.Authorization;
      return data;
    }],
  });

  return res;
  
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.upload.onprogress = onProgressCallback;
  xhr.onreadystatechange = _ => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      onDone();
    }
  };
  xhr.send(fd);
};