import * as React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import SocialLogIn from '../components/socialLogin';
import EmailPasswordLogin from '../components/emailPasswordLogin';
import auth from '@react-native-firebase/auth';
import {Colors} from 'react-native/Libraries/NewAppScreen';

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

class LoginContainer extends React.Component<AllProps> {
  componentDidMount(): void {

  }

  createUser = (email, password, first_name, last_name) => {
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
    //this.props.onRegisterEmployee(first_name, last_name, email);
    this.props.setIsLoggedIn(true);
    this.props.getEmployees();
    this.props.checkIfAdmin(email);
  };

  render() {
    return (
      <View style={!this.props.isLoggedIn ? styles.loginContainer : {}}>
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
      </View>
    );
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
  loginContainer: {
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
  listContainer: {
    flex: 1,
    marginTop: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  listItemWrapper: {
    marginBottom: 35,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemOptions: {
    flexDirection: 'column',
  },
  itemText: {
    justifyContent: 'space-between',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
