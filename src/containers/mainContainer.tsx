import * as React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import LoginContainer from './loginContainer';
import EmployeesContainer from './employeesContainer';


interface PropsFromDispatch {

}

interface PropsFromState {
  isLoggedIn: boolean
}

type AllProps = PropsFromDispatch & PropsFromState;

class mainContainer extends React.Component<AllProps> {
  componentDidMount(): void {
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <LoginContainer/>
        {this.props.isLoggedIn ? <EmployeesContainer/> : null}
      </View>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    employeesData: state.employees.employeesData,
    isLoggedIn: state.login.isLoggedIn
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onGetEmployees: () => dispatch(actions.getEmployees()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(mainContainer);
