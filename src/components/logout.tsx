import * as React from 'react';
import {
    Button,
    Text,
    View,
    Modal,
    TextInput,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';

interface LogoutProps {
   logoff: () => void,
   user: any
}

const Logout = (props: LogoutProps) => {
    return (
        <View>
            <Button title={`logout ${props.user?.email}`} onPress={props.logoff}/>
            {/*<Text>Welcome {user.email}</Text>*/}
        </View>
    );
};

export default Logout;
