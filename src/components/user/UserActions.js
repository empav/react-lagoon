import { login, findPrincipal, findNotices } from '../../backend';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const FIND_PRINCIPAL = 'FIND_PRINCIPAL';
export const FIND_NOTICES = 'FIND_NOTICES';
export const UPDATE_PRINCIPAL_FROM_STORAGE = 'UPDATE_PRINCIPAL_FROM_STORAGE';

export const loginRedux = credentials => async dispatch => {
  try {
    const res = await login(credentials);
    dispatch(receiveLoginCredentials(res));
    return Promise.resolve(res);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const findPrincipalRedux = username => async dispatch => {
  try {
    const res = await findPrincipal(username);
    dispatch(receiveLoginCredentials(res, FIND_PRINCIPAL));
    return Promise.resolve(res);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const findNoticesRedux = userId => async dispatch => {
  try {
    const { items = [] } = await findNotices(userId);
    dispatch(receiveNotices(items));
    return Promise.resolve(items);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const updatePrincipalFromStorageRedux = credentials => async dispatch => {
  dispatch(receiveLoginCredentials(credentials, UPDATE_PRINCIPAL_FROM_STORAGE));
};

export const logoutRedux = () => async dispatch => {
  dispatch({
    type: LOGOUT
  });
};

const receiveLoginCredentials = (data, type = 'LOGIN') => {
  return {
    type,
    data
  };
};

const receiveNotices = notices => {
  return {
    type: FIND_NOTICES,
    notices
  };
};
