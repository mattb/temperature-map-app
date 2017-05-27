import React, { Component } from 'react';
import codePush from 'react-native-code-push';
import MainScreen from './MainScreen';

class App extends Component {
  render() {
    return <MainScreen />;
  }
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
};
export default codePush(codePushOptions)(App);
