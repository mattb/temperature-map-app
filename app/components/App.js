import React, { Component } from 'react';
import { Provider } from 'react-redux';

import MainScreen from './MainScreen';
import configureStore from '../redux/configureStore';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainScreen />
      </Provider>
    );
  }
}

export default App;
