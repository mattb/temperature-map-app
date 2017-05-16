import codePush from 'react-native-code-push';
import React, { Component } from 'react';
import { AppState, TouchableOpacity } from 'react-native';
import TemperatureLabels from './TemperatureLabels';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: (new Date().getTime() / 1000 / 60).toFixed(0),
      displayMode: 'name'
    };

    AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        this.setState({
          version: (new Date().getTime() / 1000 / 60).toFixed(0)
        });
      }
    });

    setInterval(() => {
      this.setState({
        version: (new Date().getTime() / 1000 / 60).toFixed(0)
      });
    }, 1000 * 60);
    const displayModes = ['name', 'temp']; // 'all', 'none'
    let displayModeIndex = 0;
    this.viewClick = () => {
      displayModeIndex = (displayModeIndex + 1) % displayModes.length;
      this.setState({
        displayMode: displayModes[displayModeIndex],
        version: (new Date().getTime() / 1000 / 60).toFixed(0)
      });
    };
  }
  render() {
    return (
      <TouchableOpacity onPress={this.viewClick} activeOpacity={1}>
        <TemperatureLabels
          version={this.state.version}
          displayMode={this.state.displayMode}
        />
      </TouchableOpacity>
    );
  }
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
};
export default codePush(codePushOptions)(App);
