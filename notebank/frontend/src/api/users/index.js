import { get, post, put } from 'api';


export const login = async (email, password) => {
  const res = await post('users/login/', {
    username: email,
    password,
  });
  return res.data;
};


export const createAccount = async (email, password) => {
  const res = await post('users/create-account/', {
    username: email,
    password,
  });
  return res.data;
};


export const test = async _ => {
  await get('users/test/');
};


export const setCard = async (cardNonce) => {
  const res = await put('users/set-card/', {
    card_nonce: cardNonce,
  });
};