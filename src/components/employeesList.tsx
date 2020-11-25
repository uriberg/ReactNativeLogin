import * as React from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  View,
  Modal,
  TextInput,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import {useState} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Item = ({email, first_name, last_name}) => (
  <View style={styles.itemText}>
    <Text>{email}</Text>
    <Text>{first_name}</Text>
    <Text>{last_name}</Text>
  </View>
);

interface Employee {
  email: string,
  first_name: string,
  last_name: string
}


interface EmployeesListProps {
  employeesData: Employee[],
  adminPermissions: boolean,
  deleteEmployee: (id) => void,
  updateEmployee: (id, first_name, last_name) => void
}

const EmployeesList = (props: EmployeesListProps) => {
  const [editMode, setEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [editedItem, setEditedItem] = useState(0);

  const handleEditItem = (editedItem) => {
    console.log(editedItem);
    for (let i = 0; i < props.employeesData.length; i++) {
      if (props.employeesData[i].email === editedItem) {
        console.log('MATCH!!!!!!!!!!!!!!!!!');
        props.updateEmployee(editedItem, inputFirstName, inputLastName);
        break;
      }
    }
  };

  const renderItem = ({item}) => (
    <TouchableHighlight onPress={() => {
      setIsModalVisible(true);
      setInputFirstName(item.first_name);
      setEditedItem(item.email);
    }}
                        underlayColor={'#f1f1f1'} style={styles.listItemWrapper}>
      <View style={styles.listItem}>
        <Item email={item.email} first_name={item.first_name} last_name={item.last_name} key={item.email}/>
        <View  style={styles.itemOptions}>
          {props.adminPermissions ? <Button title="Delete" onPress={() => props.deleteEmployee(item.email)}/> : null}
          <View>
            <View>
              {props.adminPermissions && !editMode ?

                <Button title="Edit employee" onPress={() => {
                  setIsModalVisible(true);
                  setInputFirstName(item.first_name);
                  setInputLastName(item.last_name);
                  setEditedItem(item.email);
                }}/> : null}</View>
            <View>
              {editMode ? <Button title="Update employee" onPress={() => {
                setEditMode(false);
                props.deleteEmployee(item.email);
              }}/> : null}</View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={props.employeesData}
        renderItem={renderItem}
        keyExtractor={item => item.email}
        contentContainerStyle={{
          flexGrow: 1,
        }}/>
      <Modal animationType="fade" visible={isModalVisible}
             onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalView}>
          <Text>Change First Name:</Text>
          <TextInput
            onChangeText={(text) => {
              setInputFirstName(text);
              console.log('state ', inputFirstName);
            }}
            defaultValue={inputFirstName}
            editable={true}
            multiline={false}
            maxLength={200}
          />
          <Text>Change Last Name:</Text>
          <TextInput
            onChangeText={(text) => {
              setInputLastName(text);
              console.log('state ', inputLastName);
            }}
            defaultValue={inputLastName}
            editable={true}
            multiline={false}
            maxLength={200}
          />
          <TouchableHighlight onPress={() => {
            handleEditItem(editedItem);
            setIsModalVisible(false);
          }}
                              style={[{backgroundColor: 'orange'}]} underlayColor={'#f1f1f1'}>
            <Text>Save</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  listItemWrapper: {
    marginBottom: 35
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemOptions: {
    flexDirection: 'column',
  },
  itemText: {
    justifyContent: 'space-between'
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});

export default EmployeesList;
