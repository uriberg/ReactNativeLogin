import * as React from 'react';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import EmployeesList from '../components/employeesList';
import axiosIntance from '../axios';

interface PropsFromDispatch {
  onGetEmployees: () => void
}

interface PropsFromState {
  employeesData: [],
  adminPermissions: boolean
}

type AllProps = PropsFromDispatch & PropsFromState;

class EmployeesContainer extends React.Component<AllProps> {
  componentDidMount(): void {
    this.props.onGetEmployees();
    console.log('data is', this.props.employeesData);
  }

  deleteEmployee = (id) => {
    axiosIntance().delete('/employees/' + id)
      .then(res => {
        console.log(id + ' deleted!');
        this.props.onGetEmployees();
      })
      .catch(error => {
        console.log(error);
      });
  };

  updateEmployee = (id, first_name, last_name) => {
    axiosIntance().put('/employees/' + id, {first_name, last_name})
      .then(res => {
        console.log(id + 'updated!');
        this.props.onGetEmployees();
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <EmployeesList employeesData={this.props.employeesData} adminPermissions={this.props.adminPermissions}
                     deleteEmployee={this.deleteEmployee} updateEmployee={this.updateEmployee}/>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    employeesData: state.employees.employeesData,
    adminPermissions: state.employees.adminPermissions
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onGetEmployees: () => dispatch(actions.getEmployees())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesContainer);
