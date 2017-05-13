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
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.map}
          source={{
            cache: 'reload',
            uri: 'https://tempmap.s3.amazonaws.com/temps.png'
          }}
        >
          <TemperatureLabels style={styles.labels} />
        </Image>
      </View>
    );
  }
}
