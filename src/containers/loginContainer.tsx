import * as React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    Dimensions,
    ScrollView,
    Animated,
    ImageBackground
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import SocialLogIn from '../components/socialLogin';
import EmailPasswordLogin from '../components/emailPasswordLogin';
import auth from '@react-native-firebase/auth';
import Logout from "../components/logout";
import loginPic from "../shared/loginPic.jpg";

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
    orientation: string,
    animation: Animated.Value,
    user: any,
    initializing: boolean
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
            animation: new Animated.Value(0),
            user: undefined,
            initializing: true
        };

        this.animateOpacity();

        Dimensions.addEventListener('change', () => {
            console.log('orientation move');
            this.setState({
                orientation: isPortrait(),
            });
            console.log(isPortrait());
        });

        const subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
        // return subscriber; // unsubscribe on unmount
    }

    onAuthStateChanged = (user) => {
        this.setState({
            user: user
        });
        if (this.state.initializing) this.setState({initializing: false});
    }

    animateOpacity = () => {
        Animated.timing(this.state.animation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    };

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
                this.state.animation.setValue(0);
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
                this.state.animation.setValue(0);
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
                this.animateOpacity();
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
        const animatedStyles = {
            opacity: this.state.animation
        };

        const containerBody = <View style={!this.props.isLoggedIn ? styles.loginContainerPortrait :
            {}}>
            {!this.props.isLoggedIn ?
                <Animated.View style={[styles.socialLoginWrapper, animatedStyles]}>
                    <View style={styles.socialButtonWrapper}>
                        <SocialLogIn register={this.register} socialLogin={this.socialLogin}
                                     loginMode={this.props.loginMode}/>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <View style={styles.line}/>
                        <View style={styles.socialAlternativeTextWrapper}>
                            <Text style={styles.socialAlternativeText}>Or</Text>
                        </View>
                        <View style={styles.line}/>
                    </View>
                </Animated.View>
                : null}
            {!this.props.isLoggedIn ?
                <EmailPasswordLogin createUser={this.createUser} login={this.login} logoff={this.logoff}
                                    loginMode={this.props.loginMode}/>
                                    :
                <Logout logoff={this.logoff} user={this.state.user} />}
            {!this.props.isLoggedIn ? <View>
                {!this.props.loginMode ?
                    <TouchableOpacity onPress={() => this.props.setLoginMode(true)}>
                        <Animated.View style={[styles.footer, animatedStyles]}>
                            <Text style={[styles.centerAndSpaceText, styles.footerText]}>Already a member? Log in</Text>
                        </Animated.View>
                    </TouchableOpacity> :
                    <TouchableOpacity onPress={() => this.props.setLoginMode(false)}>
                        <Animated.View style={[styles.footer, animatedStyles]}>
                            <Text style={[styles.centerAndSpaceText, styles.footerText]}>
                                not a member? back to sign up
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>}
            </View> : null}
        </View>;

        if (this.state.orientation === 'landscape' && !this.props.isLoggedIn) {
            return (
                <ScrollView>
                    {containerBody}
                </ScrollView>
            );
        } else {
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
        alignItems: "center",
    },
    footer: {
        paddingHorizontal: 5,
        marginTop: 120,
        borderRadius: 5,
        backgroundColor: "#036f79",
    },
    footerText: {
        color: "#bdcddc",
        fontWeight: "bold",
        fontSize: 16
    },
    socialButtonWrapper: {
        alignSelf: "stretch"
    },
    socialAlternativeTextWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#036f79"
    },
    socialAlternativeText: {
        color: "#bdcddc",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 2
    },
    line: {
        backgroundColor: "#96a4b1",
        height: 2,
        flex: 1,
        alignSelf: 'center',
        marginTop: 5
    },
                image: {
                flex: 1,
                resizeMode: "cover",
                justifyContent: "center"
                }
});


export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
