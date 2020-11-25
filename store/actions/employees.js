import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const setEmployees = (data) => {
  return {
    type: actionTypes.SET_EMPLOYEES,
    employeesData: data,
  };
};

export const setAdminPermissions = (adminPermissions) => {
  return {
    type: actionTypes.SET_ADMIN_PERMISSIONS,
    adminPermissions: adminPermissions
  };
};

export const getEmployees = () => {
  return dispatch => {
    axios.get('http://10.100.102.6:5000/employees')
      .then(res => {
        //console.log(res.data);
        dispatch(setEmployees(res.data));
        //setEmployeesList(res.data);
      })
      .catch(error => console.log(error));
  };
};

export const registerEmployee = (first_name, last_name, email) => {
  return dispatch => {
    axios.post('http://10.100.102.6:5000/employees', {first_name, last_name, email})
      .then(() => {
        // console.log('from post after register', res.data);
        // let employees = getState().employees.employeesData;
        // console.log('old employees', employees);
        dispatch(getEmployees());
        dispatch(checkIfAdmin(email));
        // getEmployees();
      }).catch(error => console.log(error));
  }
};

export const checkIfAdmin = (id) => {
  return dispatch => {
    axios.get('http://10.100.102.6:5000/employees/' + id)
      .then(res => {
        console.log('result of check ', res.data);
        dispatch(setAdminPermissions(res.data));
      })
      .catch(error => console.log(error));
  }
};

