import * as React from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Alert, Dimensions, ScrollView, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import SocialLogIn from '../components/socialLogin';
import EmailPasswordLogin from '../components/emailPasswordLogin';
import auth from '@react-native-firebase/auth';

interface PropsFromDispatch {
  onRegisterEmployee: (first_name, last_name, email) => void,
  getEmployees: () => void,
  checkIfAdmin: (email) => void,
  setLoginMode: (loginMode) => void,
  setIsLoggedIn: (isLoggedIn) => void
}

interface PropsFromState {
  employeesData: [],
  loginMode: boolean,
  isLoggedIn: boolean
}

type AllProps = PropsFromDispatch & PropsFromState;

interface State {
  orientation: string
}

class LoginContainer extends React.Component<AllProps, State> {

  constructor(props: AllProps) {
    super(props);

    const isPortrait = () => {
      const dim = Dimensions.get('window');
      return dim.height >= dim.width ? 'portrait' : 'landscape';
    };

    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape',
    };

    Dimensions.addEventListener('change', () => {
      console.log('orientation move');
      this.setState({
        orientation: isPortrait(),
      });
      console.log(isPortrait());
    });
  }

  validateLogin = (email, password) => {
    if (email.length == 0 || password.length == 0) {
      Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
        {text: 'Okay'},
      ]);
      return false;
    } else {
      return true;
    }
  };

  validateRegister = (email, password, first_name, last_name) => {
    if (email.length == 0 || password.length == 0 || first_name.length == 0 || last_name.length == 0) {
      Alert.alert('Wrong Input!', 'Username/password/first name/last name field cannot be empty.', [
        {text: 'Okay'},
      ]);
      return false;
    } else {
      return true;
    }
  };

  createUser = (email, password, first_name, last_name) => {
    if (!this.validateRegister(email, password, first_name, last_name)) {
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        console.log('User account created & signed in!');
        this.props.onRegisterEmployee(first_name, last_name, email);
        this.props.setIsLoggedIn(true);
        this.props.checkIfAdmin(email);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  login = (email, password) => {
    if (!this.validateLogin(email, password)) {
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        //move to redux
        this.props.setIsLoggedIn(true);
        this.props.getEmployees();
        this.props.checkIfAdmin(email);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  logoff = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        this.props.setIsLoggedIn(false);
        this.props.setLoginMode(false);
      });
  };

  register = (first_name, last_name, email) => {
    this.props.onRegisterEmployee(first_name, last_name, email);
    this.props.setIsLoggedIn(true);
  };

  socialLogin = (email) => {
    this.props.setIsLoggedIn(true);
    this.props.getEmployees();
    this.props.checkIfAdmin(email);
  };

  render() {
    const containerBody =  <View style={!this.props.isLoggedIn ? styles.loginContainerPortrait :
      {}}>
      {!this.props.isLoggedIn ?
        <View style={styles.socialLoginWrapper}>
          <SocialLogIn register={this.register} socialLogin={this.socialLogin} loginMode={this.props.loginMode}/>
          <Text style={styles.centerAndSpaceText}>Or</Text>
        </View>
        : null}
      <EmailPasswordLogin createUser={this.createUser} login={this.login} logoff={this.logoff}
                          loginMode={this.props.loginMode}/>
      {!this.props.isLoggedIn ? <View>
        {!this.props.loginMode ?
          <TouchableOpacity onPress={() => this.props.setLoginMode(true)}>
            <Text style={styles.centerAndSpaceText}>Already a member? Log in</Text></TouchableOpacity> :
          <TouchableOpacity onPress={() => this.props.setLoginMode(false)}>
            <Text style={styles.centerAndSpaceText}>
              not a member? back to sign up
            </Text>
          </TouchableOpacity>}
      </View> : null}
    </View>;

    if (this.state.orientation === 'landscape' && !this.props.isLoggedIn){
      return (
        <ScrollView>
          {containerBody}
        </ScrollView>
      );
    }
      else {
        return (
          <>
          {containerBody}
          </>
        );
      }
  }
}

const mapStateToProps = (state: any) => {
  return {
    employeesData: state.employees.employeesData,
    loginMode: state.login.loginMode,
    isLoggedIn: state.login.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onRegisterEmployee: (first_name, last_name, email) => dispatch(actions.registerEmployee(first_name, last_name, email)),
    getEmployees: () => dispatch(actions.getEmployees()),
    checkIfAdmin: (email) => dispatch(actions.checkIfAdmin(email)),
    setLoginMode: (loginMode) => dispatch(actions.setLoginMode(loginMode)),
    setIsLoggedIn: (isLoggedIn) => dispatch(actions.setIsLoggedIn(isLoggedIn)),
  };
};

const styles = StyleSheet.create({
  loginContainerPortrait: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  centerAndSpaceText: {
    textAlign: 'center',
    paddingVertical: 10,
  },
  socialLoginWrapper: {
    marginBottom: 35,
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
