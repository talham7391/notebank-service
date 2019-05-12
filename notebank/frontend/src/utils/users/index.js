import { doesTokenExist } from 'api';

export const redirectToAccountIfLoggedIn = _ => {
  if (doesTokenExist()) {
    window.location.href = '/account/';
    return true;
  }
  return false;
};

export const redirectToLoginIfLoggedOut = _ => {
  if (!doesTokenExist()) {
    window.location.href = '/login/';
    return true;
  }
  return false;
};