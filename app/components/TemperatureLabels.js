import React, { Component } from 'react';
import { Dimensions, StyleSheet, Image, Text, View } from 'react-native';
import moment from 'moment';

class TemperatureLabels extends Component {
  constructor(props) {
    super(props);

    const { height, width } = Dimensions.get('window');
    this.heightScale = height / 667.0;
    this.widthScale = width / 375.0;
    console.log(this.heightScale, this.widthScale);
    this.styles = StyleSheet.create({
      map: {
        width,
        height,
        resizeMode: 'cover'
      }
    });

    this.state = {
      dimensions: {}
    };
    this.onLayout = name => event => {
      if (this.state.dimensions[name]) return; // layout was already called
      const w = event.nativeEvent.layout.width;
      const h = event.nativeEvent.layout.height;
      this.setState(state => ({
        dimensions: Object.assign({}, state.dimensions, {
          [name]: [w, h]
        })
      }));
    };
    this.f = c => 32 + parseFloat(c, 10) * 9.0 / 5.0;
    this.fontSize = () => (this.props.displayMode === 'temp' ? 13 : 10);
    this.format = place => {
      const name = place.name;
      const temp = `${Math.round(this.f(place.temp_in_c))}`;
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
    if (this.props.version !== nextProps.version) {
      this.getData();
    }
  }
  getData() {
    console.log(
      `https://tempmap.s3.amazonaws.com/temps.json?${this.props.version}`
    );
    fetch(`https://tempmap.s3.amazonaws.com/temps.json?${this.props.version}`, {
      headers: {
        pragma: 'no-cache',
        'cache-control': 'no-cache'
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          ...data,
          image_url: `https://tempmap.s3.amazonaws.com/${data.png}`,
          when: moment(data.timestamp).local().format('MMMM Do YYYY [at] ha')
        });
      });
  }
  render() {
    if (this.state.places) {
      return (
        <View style={this.styles.container}>
          <Image
            style={this.styles.map}
            source={{
              uri: this.state.image_url
            }}
          >
            <Text
              style={{
                fontSize: 10,
                left: 10,
                bottom: 10,
                color: 'rgba(0, 0, 0, 0.7)',
                backgroundColor: 'rgba(230, 230, 230, 0.7)',
                position: 'absolute',
                textAlign: 'left',
                padding: 3
              }}
            >
              {'min '}
              {this.f(this.state.min_in_c).toFixed(0)}
              {'F average '}
              {this.f(this.state.average_in_c).toFixed(0)}
              {'F max '}
              {this.f(this.state.max_in_c).toFixed(0)}
              {'F\nlast updated '}
              {this.state.when}
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
                    fontSize: this.fontSize(),
                    fontWeight: 'bold',
                    left: this.widthScale * parseInt(place.x, 10) / 2 - offsetX,
                    top: this.heightScale * parseInt(place.y, 10) / 2 - offsetY,
                    position: 'absolute',
                    textAlign: 'center',
                    width: 65
                  }}
                >
                  {this.format(place)}
                </Text>
              );
            })}
          </Image>
        </View>
      );
    }
    return <View />;
  }
}
TemperatureLabels.propTypes = {
  version: React.PropTypes.string,
  displayMode: React.PropTypes.string
};
TemperatureLabels.defaultProps = {
  version: '',
  displayMode: 'name'
};

export default TemperatureLabels;
