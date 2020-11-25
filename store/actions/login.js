import * as actionTypes from './actionsTypes';

export const setLoginMode = (loginMode) => {
  return {
    type: actionTypes.SET_LOGIN_MODE,
    loginMode: loginMode,
  };
};

export const setIsLoggedIn = (isLoggedIn) => {
  return {
    type: actionTypes.SET_IS_LOGGED_IN,
    isLoggedIn: isLoggedIn
  };
};
