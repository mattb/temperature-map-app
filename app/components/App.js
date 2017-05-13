import React, { Component } from 'react';
import { StyleSheet, Image, View } from 'react-native';
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
      hour: (new Date().getTime() / 1000 / 60 / 60).toFixed(0)
    };
    setInterval(() => {
      this.setState({
        hour: (new Date().getTime() / 1000 / 60 / 60).toFixed(0)
      });
    }, 1000 * 60 * 60);
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.map}
          source={{
            uri: `https://tempmap.s3.amazonaws.com/temps.png?${this.state.hour}`
          }}
        >
          <TemperatureLabels style={styles.labels} hour={this.state.hour} />
        </Image>
      </View>
    );
  }
}
