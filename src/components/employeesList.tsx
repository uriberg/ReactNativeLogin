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
    <Text>{first_name} {last_name}</Text>
    <Text style={styles.subheading}>{email}</Text>
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

  const renderSeparator = () => {
    return <View style={styles.itemSeparator}></View>;
  };

  const renderHeader = () => {
    return (
        <View>
          <Text style={styles.header}>Employees</Text>
        </View>
    );
  };

  const renderItem = ({item}) => (
    <TouchableHighlight onPress={() => {
      setIsModalVisible(true);
      setInputFirstName(item.first_name);
      setEditedItem(item.email);
    }}
                        underlayColor={'#f1f1f1'}>
      <View style={styles.listItem}>
        <Item email={item.email} first_name={item.first_name} last_name={item.last_name} key={item.email}/>
        <View  style={styles.itemOptions}>
          {props.adminPermissions ? <Button title="Delete" onPress={() => props.deleteEmployee(item.email)}/> : null}
          <View>
            <View style={{marginVertical: 5}}>
              {props.adminPermissions && !editMode ?

                <Button title="Edit employee" onPress={() => {
                  setIsModalVisible(true);
                  setInputFirstName(item.first_name);
                  setInputLastName(item.last_name);
                  setEditedItem(item.email);
                }}/> : null}</View>
            <View >
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
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 5,
    backgroundColor: "white"
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  itemOptions: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  itemText: {
    justifyContent: 'center',
    maxWidth: 150
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  itemSeparator: {
    backgroundColor: 'green',
    height: 1,
  },
  header: {
    fontSize: 30,
    paddingVertical: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#DCDCDC',
  },
  heading2: {
    fontSize: 18,
  },
  subheading: {
    color: 'grey',
  },
});

export default EmployeesList;
