import { doesTokenExist } from 'api';
import * as urls from 'constants/page/urls';

export const redirectToAccountIfLoggedIn = _ => {
  if (doesTokenExist()) {
    urls.goto(urls.ACCOUNT);
    return true;
  }
  return false;
};

export const redirectToLoginIfLoggedOut = _ => {
  if (!doesTokenExist()) {
    urls.goto(urls.LOGIN);
    return true;
  }
  return false;
};