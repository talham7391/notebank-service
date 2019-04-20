import { post } from 'api';

export const createNote = noteInfo => {
  const data = {
    created_by: noteInfo.email,
  };
  post('notes/', data);
};