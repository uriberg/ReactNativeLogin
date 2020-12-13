import * as React from 'react';
import {Button, TouchableOpacity, View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

interface SocialLoginProps {
    register: (first_name, last_name, email) => void,
    loginMode: boolean,
    socialLogin: (email) => void
}

const SocialLogIn = (props: SocialLoginProps) => {

    function register(first_name, last_name, email) {
        props.register(first_name, last_name, email);
    }

    return (
        <>
            {props.loginMode ?
                <TouchableOpacity
                    onPress={() => onFacebookButtonPress().then((result) => props.socialLogin(result.additionalUserInfo.profile.email))}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Log in with Facebook</Text>
                    </View>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => onFacebookButtonPress().then((result) => register(
                    result.additionalUserInfo.profile.first_name,
                    result.additionalUserInfo.profile.last_name,
                    result.additionalUserInfo.profile.email))}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Facebook Sign-In</Text>
                    </View>
                </TouchableOpacity>
            }
        </>
    );
};


async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
        throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
        throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
}

export default SocialLogIn;

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
        backgroundColor: "#1b387f",
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
        alignSelf: "stretch"
    },
    buttonText: {
        textAlign: "center",
        color: "#FFF",
        fontSize: 16,
    }
});
