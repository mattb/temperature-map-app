import codePush from 'react-native-code-push';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import TemperatureLabels from './TemperatureLabels';

const styles = StyleSheet.create({
  labels: {
    width: 375,
    height: 667
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hour: (new Date().getTime() / 1000 / 60 / 60).toFixed(0),
      displayMode: 'name'
    };
    setInterval(() => {
      this.setState({
        hour: (new Date().getTime() / 1000 / 60 / 60).toFixed(0)
      });
    }, 1000 * 60);
    const displayModes = ['name', 'temp']; // 'all', 'none'
    let displayModeIndex = 0;
    this.viewClick = () => {
      displayModeIndex = (displayModeIndex + 1) % displayModes.length;
      this.setState({
        displayMode: displayModes[displayModeIndex],
        hour: (new Date().getTime() / 1000 / 60 / 60).toFixed(0)
      });
    };
  }
  render() {
    return (
      <TouchableOpacity onPress={this.viewClick} activeOpacity={1}>
        <TemperatureLabels
          style={styles.labels}
          hour={this.state.hour}
          displayMode={this.state.displayMode}
        />
      </TouchableOpacity>
    );
  }
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};
export default codePush(codePushOptions)(App);
