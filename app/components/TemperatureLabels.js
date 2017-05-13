import React, { Component } from 'react';
import { Text, View } from 'react-native';

const stylePropType = require('react-style-proptype');

class TemperatureLabels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: {}
    };
    this.onLayout = name => event => {
      if (this.state.dimensions[name]) return; // layout was already called
      const { width, height } = event.nativeEvent.layout;
      this.setState(state => ({
        dimensions: Object.assign({}, state.dimensions, {
          [name]: [width, height]
        })
      }));
    };
    this.format = place => {
      const name = place.name;
      const c = parseFloat(place.temp_in_c, 10);
      const f = 32 + c * 9.0 / 5.0;
      const temp = `${f.toFixed(0)}`;
      return `${name}\n${temp}`;
    };
  }
  componentWillMount() {
    fetch('https://tempmap.s3.amazonaws.com/temps.json')
      .then(response => response.json())
      .then(data => {
        this.setState({
          places: data.places
        });
      });
  }
  render() {
    if (this.state.places) {
      return (
        <View style={this.props.style}>
          {this.state.places.map(place => {
            let offset = 0;
            let color = 'rgba(0, 0, 0, 0)';
            if (this.state.dimensions[place.name]) {
              offset = this.state.dimensions[place.name][0] / 2;
              color = 'rgba(0, 0, 0, 0.6)';
            }
            return (
              <Text
                key={place.name}
                onLayout={this.onLayout(place.name)}
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color,
                  width: 55,
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  position: 'absolute',
                  left: parseInt(place.x, 10) / 2 - offset,
                  top: parseInt(place.y, 10) / 2
                }}
              >
                {this.format(place)}
              </Text>
            );
          })}
        </View>
      );
    }
    return <View style={this.props.style} />;
  }
}
TemperatureLabels.propTypes = {
  style: stylePropType.isRequired
};

export default TemperatureLabels;
