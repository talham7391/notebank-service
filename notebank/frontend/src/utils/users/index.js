import { doesTokenExist } from 'api';

export const redirectToAccountIfLoggedIn = _ => {
  if (doesTokenExist()) {
    window.location.href = '/account/';
    return true;
  }
  return false;
};