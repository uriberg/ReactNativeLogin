import * as React from 'react';
import {Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

interface SocialLoginProps {
  register: (first_name, last_name, email) => void,
  loginMode: boolean,
  socialLogin: (email) => void
}

const SocialLogIn = (props: SocialLoginProps) => {

  function register(first_name, last_name, email){
    props.register(first_name, last_name, email);
  }

  return (
    <>
      {props.loginMode?
        <Button
          title="Log in with Facebook"
          onPress={() => onFacebookButtonPress().then((result) => props.socialLogin(result.additionalUserInfo.profile.email))}
        /> :
        <Button
          title="Facebook Sign-In"
          onPress={() => onFacebookButtonPress().then((result) => register(
            result.additionalUserInfo.profile.first_name,
            result.additionalUserInfo.profile.last_name,
            result.additionalUserInfo.profile.email))}
        />
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
