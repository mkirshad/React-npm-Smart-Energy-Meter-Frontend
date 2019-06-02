import * as actionTypes from './actionTypes';
import { login, registration } from '../../API/auth';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
};

export const authSuccess = token => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token
  }
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
}

export const CheckAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000)
  }
};

export const authLogin = (username, password) => {
  return async dispatch => {
    dispatch(authStart());

    const res = await login(username, password);
    if (res.fail) {
      dispatch(authFail(res))
    } else {
      const token = res.key;
      const expirationDate = new Date(new Date().getTime() + 31536000 * 1000);//previous version
      localStorage.setItem('token', token);
      localStorage.setItem('expirationDate', expirationDate.toString());

      dispatch(authSuccess(token));
      dispatch(CheckAuthTimeout(31536000));

    }
  }
};

export const authSignup = (username, email, password1, password2) => {
  return async dispatch => {
    dispatch(authStart());
    const res = await registration(username, email, password1, password2);
    if (res.fail) {
      dispatch(authFail(res))
    } else {
      const token = res.key;
      const expirationDate = new Date(new Date().getTime() + 31536000 * 1000);
      localStorage.setItem('token', token);
      localStorage.setItem('expirationDate', expirationDate.toString());
      dispatch(authSuccess(token));
      dispatch(CheckAuthTimeout(31536000));
    }
  }
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token));
        console.log((expirationDate.getTime() - new Date().getTime()) / 1000);
        dispatch(CheckAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  }
};
