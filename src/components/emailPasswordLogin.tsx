import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';

interface EmailPasswordLoginProps {
  login: (email, password) => void,
  createUser: (email, password, first_name, last_name) => void,
  logoff: () => void,
  loginMode: boolean
}

const EmailPasswordLogin = (props: EmailPasswordLoginProps) => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');

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
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <View>
          <View>
            <Text>Enter your email:</Text>
            <TextInput
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
            <Text>Enter your password:</Text>
            <TextInput
              value={password}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
          {!props.loginMode ? <View>
            <Text>Enter your first name:</Text>
            <TextInput
              value={first_name}
              onChangeText={(first_name) => setFirstName(first_name)}
            />
            <Text>Enter your last name:</Text>
            <TextInput
              value={last_name}
              onChangeText={(last_name) => setLastName(last_name)}
            />
          </View> : null}
          {props.loginMode ? <Button title="login" onPress={() => props.login(email, password)}/> : null}
          {!props.loginMode ?
            <Button title="Register" onPress={() => props.createUser(email, password, first_name, last_name)}/> : null}
        </View>
      </View>
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
