import React, { Component } from 'react';
import { Dimensions, StyleSheet, Image, Text, View } from 'react-native';
import moment from 'moment';

import Status from './Status';

const d3 = require('d3-geo');

const markerGlyph = '❌';

const imageSize = {
  width: 375,
  height: 667
};

/* eslint-disable global-require */
const placeData = {
  temps: {
    loadingImage: require('../images/temps.png'),
    title: 'San Francisco'
  },
  northbay: {
    loadingImage: require('../images/northbay.png'),
    title: 'North Bay'
  },
  eastbay: {
    loadingImage: require('../images/eastbay.png'),
    title: 'East Bay'
  },
  southbay: {
    loadingImage: require('../images/southbay.png'),
    title: 'South Bay'
  },
  bayarea: {
    loadingImage: require('../images/bayarea.png'),
    title: 'Bay Area'
  }
};
/* eslint-enable global-require */

class TemperatureLabels extends Component {
  constructor(props) {
    super(props);

    const dimensions = Dimensions.get('window');
    this.screenHeight = dimensions.height;
    this.screenWidth = dimensions.width;
    const heightScale = dimensions.height / imageSize.height;
    const widthScale = dimensions.width / imageSize.width;
    this.scale = Math.max(heightScale, widthScale);
    this.state = {
      loading: true,
      dimensions: {},
      title: placeData[props.location].title,
      loading_image: placeData[props.location].loadingImage
    };

    this.locationToXY = coords =>
      this.state
        .projection([coords.longitude, coords.latitude])
        .map(i => Math.round(i));

    this.updateMarker = position => {
      this.setState(state => {
        if (!('places' in state)) {
          return {};
        }
        const xy = this.locationToXY(position);
        const marker = {
          name: markerGlyph,
          isMarker: true,
          latlon: [position.latitude, position.longitude],
          temp_in_c: '0',
          x: xy[0],
          y: xy[1]
        };
        const filteredPlaces = state.places.filter(p => !p.isMarker);
        filteredPlaces.unshift(marker);
        return {
          places: filteredPlaces
        };
      });
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

    this.formatTemperature = c => {
      if (this.props.temperatureMode === 'F') {
        return 32 + parseFloat(c, 10) * 9.0 / 5.0;
      }
      return parseFloat(c, 10);
    };

    this.formatTemperatureWithUnit = input =>
      `${this.formatTemperature(input).toFixed(0)}${this.props.temperatureMode}`;

    this.fontSize = () =>
      Math.round(this.scale * (this.props.displayMode === 'temp' ? 13 : 10));

    this.format = place => {
      if (place.isMarker) {
        return place.name;
      }
      const name = place.name;
      const temp = `${Math.round(this.formatTemperature(place.temp_in_c))}`;
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

    this.scaleXY = (x, y, offsetX, offsetY) => {
      const xx = parseInt(x, 10) / 2;
      const yy = parseInt(y, 10) / 2;
      return {
        left: this.scale * (xx - imageSize.width / 2) +
          this.screenWidth / 2 -
          offsetX,
        top: this.scale * (yy - imageSize.height / 2) +
          this.screenHeight / 2 -
          offsetY
      };
    };

    this.styles = StyleSheet.create({
      text: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fontWeight: 'bold',
        position: 'absolute',
        textAlign: 'center',
        width: 65 * this.scale
      },
      container: {
        alignItems: 'center'
      },
      map: {
        width: dimensions.width,
        height: dimensions.height,
        resizeMode: 'cover'
      }
    });
  }
  componentWillMount() {
    this.getData();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.setState({
        dimensions: {},
        title: placeData[nextProps.location].title,
        loading_image: placeData[nextProps.location].loadingImage,
        loading: true
      });
      this.getData(nextProps.location);
      return;
    }
    if (this.props.displayMode !== nextProps.displayMode) {
      this.setState({
        dimensions: {}
      });
    }
    if (this.props.version !== nextProps.version) {
      this.getData();
    }
    if (
      this.props.currentPosition.timestamp !==
      nextProps.currentPosition.timestamp
    ) {
      this.updateMarker(nextProps.currentPosition);
    }
  }
  getData(location) {
    console.log(
      `https://tempmap.s3.amazonaws.com/${location || this.props.location}.json?${this.props.version}`
    );
    fetch(
      `https://tempmap.s3.amazonaws.com/${location || this.props.location}.json?${this.props.version}`
    )
      .then(response => response.json())
      .then(data => {
        this.setState(
          {
            ...data,
            image_url: `https://tempmap.s3.amazonaws.com/${data.png}`,
            when: moment(data.timestamp).local().format('MMMM Do YYYY [at] ha'),
            projection: d3
              .geoMercator()
              .scale(data.d3.scale)
              .translate(data.d3.translate),
            loading: false
          },
          () => {
            this.updateMarker(this.props.currentPosition);
          }
        );
      });
  }
  render() {
    if (this.state.places && !this.state.loading) {
      return (
        <View>
          <Image
            style={this.styles.map}
            source={{
              uri: this.state.image_url,
              cache: 'force-cache'
            }}
            defaultSource={this.state.loading_image}
          >
            <Status
              formatTemperature={this.formatTemperatureWithUnit}
              title={this.state.title}
              scale={this.scale}
              min_in_c={this.state.min_in_c}
              max_in_c={this.state.max_in_c}
              average_in_c={this.state.average_in_c}
              when={this.state.when}
              onTouch={this.props.onStatusClick}
            />
            {this.state.places.map(place => {
              let offsetX;
              let offsetY;
              let color;
              if (this.state.dimensions[place.name]) {
                offsetX = this.state.dimensions[place.name][0] / 2;
                offsetY = this.state.dimensions[place.name][1] / 2;
                color = 'rgba(0, 0, 0, 0.6)';
              } else {
                offsetX = 0;
                offsetY = 0;
                color = 'rgba(0, 0, 0, 0)';
              }
              return (
                <Text
                  key={place.name}
                  onLayout={this.onLayout(place.name)}
                  style={[
                    this.styles.text,
                    {
                      color,
                      fontSize: this.fontSize()
                    },
                    this.scaleXY(place.x, place.y, offsetX, offsetY)
                  ]}
                >
                  {this.format(place)}
                </Text>
              );
            })}
          </Image>
        </View>
      );
    }
    return (
      <View style={this.styles.container}>
        <Image style={this.styles.map} source={this.state.loading_image} />
      </View>
    );
  }
}
TemperatureLabels.propTypes = {
  version: React.PropTypes.string,
  currentPosition: React.PropTypes.shape({
    latitude: React.PropTypes.number,
    longitude: React.PropTypes.number,
    timestamp: React.PropTypes.number
  }),
  displayMode: React.PropTypes.string,
  location: React.PropTypes.string,
  temperatureMode: React.PropTypes.string,
  onStatusClick: React.PropTypes.func
};
TemperatureLabels.defaultProps = {
  version: '',
  displayMode: 'temps',
  temperatureMode: 'F',
  location: 'sf',
  currentPosition: {},
  onStatusClick: undefined
};

export default TemperatureLabels;
