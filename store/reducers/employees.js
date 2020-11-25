import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
  employeesData: [],
  adminPermissions: false
};

const setEmployees = (state, action) => {
  return updateObject(state, {employeesData: action.employeesData});
};

const setAdminPermissions = (state, action) => {
  return updateObject(state, {adminPermissions: action.adminPermissions});
};

const employees = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_EMPLOYEES: return setEmployees(state, action);
    case actionTypes.SET_ADMIN_PERMISSIONS: return setAdminPermissions(state, action);
    default:
      return state;
  }
};

export default employees;
