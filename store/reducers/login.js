import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
  loginMode: false,
  isLoggedIn: false
};

const setLoginMode = (state, action) => {
  return updateObject(state, {loginMode: action.loginMode});
};

const setIsLoggedIn = (state, action) => {
  return updateObject(state, {isLoggedIn: action.isLoggedIn});
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_LOGIN_MODE: return setLoginMode(state, action);
    case actionTypes.SET_IS_LOGGED_IN: return setIsLoggedIn(state, action);
    default:
      return state;
  }
};

export default login;
