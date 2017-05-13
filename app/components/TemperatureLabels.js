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
      if (this.props.displayMode === 'all') {
        return `${name}\n${temp}`;
      }
      if (this.props.displayMode === 'none') {
        return '';
      }
      if (this.props.displayMode === 'name') {
        return `${name}`;
      }
      if (this.props.displayMode === 'temp') {
        return `${temp}`;
      }
      return '';
    };
  }
  componentWillMount() {
    this.getData();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.displayMode !== nextProps.displayMode) {
      this.setState({
        dimensions: {}
      });
    }
    if (this.props.hour !== nextProps.hour) {
      this.getData();
    }
  }
  getData() {
    console.log(
      `https://tempmap.s3.amazonaws.com/temps.json?${this.props.hour}`
    );
    fetch(`https://tempmap.s3.amazonaws.com/temps.json?${this.props.hour}`)
      .then(response => response.json())
      .then(data => {
        this.setState(data);
      });
  }
  render() {
    if (this.state.places) {
      return (
        <View style={this.props.style}>
          <Text
            style={{
              fontSize: 10,
              left: 20,
              bottom: 20,
              color: 'rgba(0, 0, 0, 1)',
              position: 'absolute',
              textAlign: 'center'
            }}
          >
            {this.state.timestamp}
          </Text>
          {this.state.places.map(place => {
            let offsetX = 0;
            let offsetY = 0;
            let color = 'rgba(0, 0, 0, 0)';
            if (this.state.dimensions[place.name]) {
              offsetX = this.state.dimensions[place.name][0] / 2;
              offsetY = this.state.dimensions[place.name][1] / 2;
              color = 'rgba(0, 0, 0, 0.6)';
            }
            return (
              <Text
                key={place.name}
                onLayout={this.onLayout(place.name)}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  color,
                  fontSize: 10,
                  fontWeight: 'bold',
                  left: parseInt(place.x, 10) / 2 - offsetX,
                  top: parseInt(place.y, 10) / 2 - offsetY,
                  position: 'absolute',
                  textAlign: 'center',
                  width: 65
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
  style: stylePropType.isRequired,
  hour: React.PropTypes.string,
  displayMode: React.PropTypes.string
};
TemperatureLabels.defaultProps = {
  hour: '',
  displayMode: 'all'
};

export default TemperatureLabels;
