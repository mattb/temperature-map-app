import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import TemperatureLabels from './TemperatureLabels';

const styles = StyleSheet.create({
  map: {
    width: 375,
    height: 667,
    resizeMode: 'cover'
  },
  labels: {
    width: 375,
    height: 667
  }
});

export default class App extends Component {
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
    }, 1000 * 60 * 60);
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
        <View style={styles.container}>
          <Image
            style={styles.map}
            source={{
              uri: `https://tempmap.s3.amazonaws.com/temps.png?${this.state.hour}`,
              cache: 'reload'
            }}
          >
            <TemperatureLabels
              style={styles.labels}
              hour={this.state.hour}
              displayMode={this.state.displayMode}
            />
          </Image>
        </View>
      </TouchableOpacity>
    );
  }
}
