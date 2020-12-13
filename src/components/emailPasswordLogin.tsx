import * as React from 'react';
import {useState, useEffect} from 'react';
import {
    View,
    Text,
    Button,
    TextInput,
    Animated,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import auth from '@react-native-firebase/auth';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const createAnimationStyle = animation => {
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-5, 0],
    });

    return {
        opacity: animation,
        transform: [
            {
                translateY,
            },
        ],
    };
};


interface EmailPasswordLoginProps {
    login: (email, password) => void,
    createUser: (email, password, first_name, last_name) => void,
    logoff: () => void,
    loginMode: boolean
}

const EmailPasswordLogin = (props: EmailPasswordLoginProps) => {

    // const emailAnimation = new Animated.Value(0);
    // const passwordAnimation = new Animated.Value(0);
    // const firstNameAnimation = new Animated.Value(0);
    // const lastNameAnimation = new Animated.Value(0);
    // const buttonAnimation = new Animated.Value(0);

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [emailAnimation, setEmailAnimation] = useState(new Animated.Value(0));
    const [passwordAnimation, setPasswordAnimation] = useState(new Animated.Value(0));
    const [firstNameAnimation, setFirstNameAnimation] = useState(new Animated.Value(0));
    const [lastNameAnimation, setLastNameAnimation] = useState(new Animated.Value(0));
    const [buttonAnimation, setButtonAnimation] = useState(new Animated.Value(0));

    const emailStyle = createAnimationStyle(emailAnimation);
    const passwordStyle = createAnimationStyle(passwordAnimation);
    const firstNameStyle = createAnimationStyle(firstNameAnimation);
    const lastNameStyle = createAnimationStyle(lastNameAnimation);
    const buttonStyle = createAnimationStyle(buttonAnimation);
    // const [buttonAnimation, setButtonAnimation] = useState(new Animated.Value(0));

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        setPassword('');
        setEmail('');
        setFirstName('');
        setLastName('');
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        Animated.stagger(100, [
            Animated.timing(emailAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(passwordAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(firstNameAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(lastNameAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(buttonAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
        ]).start(() => {
            // firstNameAnimation.setValue(1);
            // lastNameAnimation.setValue(1);
        });


        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, [emailAnimation, passwordAnimation, firstNameAnimation, lastNameAnimation, buttonAnimation]);

    if (initializing) return null;

    if (!user) {
        return (
            <KeyboardAvoidingView>
                <View>
                    <AnimatedTextInput
                        style={[styles.input, emailStyle]}
                        placeholder="Email"
                        value={email}
                        onChangeText={(email) => setEmail(email)}
                    />
                    <AnimatedTextInput
                        style={[styles.input, passwordStyle]}
                        placeholder="Password"
                        value={password}
                        onChangeText={(password) => setPassword(password)}
                    />
                </View>
                {!props.loginMode ?
                    <View>
                        <AnimatedTextInput
                            style={[styles.input, firstNameStyle]}
                            placeholder="First Name"
                            value={first_name}
                            onChangeText={(first_name) => setFirstName(first_name)}
                        />
                        <AnimatedTextInput
                            style={[styles.input, lastNameStyle]}
                            placeholder="Last Name"
                            value={last_name}
                            onChangeText={(last_name) => setLastName(last_name)}
                        />
                    </View> : null}
                <TouchableOpacity
                    onPress={props.loginMode ? () => props.login(email, password) : () => props.createUser(email, password, first_name, last_name)}>
                    <Animated.View style={[styles.button, buttonStyle]}>
                        <Text style={styles.buttonText}>
                            {props.loginMode ? "Login" : "Register"}
                        </Text>
                    </Animated.View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
    return (
        <View>
            <Button title={`logout ${user.email}`} onPress={props.logoff}/>
            {/*<Text>Welcome {user.email}</Text>*/}
        </View>
    );

};

export default EmailPasswordLogin;

const styles = StyleSheet.create({
    input: {
        // width: 250,
        // height: 35,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#FFF",
        color: "#333",
        backgroundColor: "#FFF",
    },
    button: {
        marginTop: 10,
        backgroundColor: "tomato",
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
    },
    buttonText: {
        textAlign: "center",
        color: "#FFF",
        fontSize: 16,
    }
});