import * as React from 'react';
import {
  StyleSheet,
  StatusBar,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import {Provider} from 'react-redux';
import MainContainer from './src/containers/mainContainer';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import employeesReducer from './store/reducers/employees';
import loginReducer from './store/reducers/login';

const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const rootReducer = combineReducers({
  employees: employeesReducer,
  login: loginReducer
});

export const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

function App() {
  return (
    <>
      <Provider store={store}>
        <StatusBar barStyle="dark-content"/>
           <MainContainer/>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
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

export default App;
