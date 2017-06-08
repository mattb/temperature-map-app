import React, { Component } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';

const markerGlyph = '🔵';

const imageSize = {
  width: 375,
  height: 667
};

class MapWithLabels extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.locationToXY = coords =>
      this.props
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

    this.fontSize = () =>
      Math.round(
        this.props.screenScale * (this.props.displayMode === 'temp' ? 13 : 10)
      );

    this.format = place => {
      if (place.isMarker) {
        return place.name;
      }
      const name = place.name;
      const temp = `${this.props.formatTemperature(place.temp_in_c)}`;
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

    const wrapperWidth = 200;
    const wrapperHeight = 100;

    this.scaleXY = (x, y) => {
      const offsetX = wrapperWidth / 2;
      const offsetY = wrapperHeight / 2;
      const xx = parseInt(x, 10) / 2;
      const yy = parseInt(y, 10) / 2;
      return {
        left:
          this.props.screenScale * (xx - imageSize.width / 2) +
            this.props.dimensions.width / 2 -
            offsetX,
        top:
          this.props.screenScale * (yy - imageSize.height / 2) +
            this.props.dimensions.height / 2 -
            offsetY
      };
    };

    this.makeStyles = theProps =>
      StyleSheet.create({
        textWrapper: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          width: wrapperWidth,
          height: wrapperHeight
        },
        text: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fontWeight: 'bold',
          textAlign: 'center',
          width: 65 * theProps.screenScale,
          color: 'black'
        },
        container: {
          alignItems: 'center'
        },
        map: {
          width: theProps.dimensions.width,
          height: theProps.dimensions.height,
          resizeMode: 'cover'
        }
      });
    this.styles = this.makeStyles(props);
  }
  componentWillReceiveProps(nextProps) {
    this.styles = this.makeStyles(nextProps);
    if (
      this.props.currentPosition.timestamp !==
      nextProps.currentPosition.timestamp
    ) {
      this.updateMarker(nextProps.currentPosition);
    }
    if (this.props.data !== nextProps.data) {
      this.setState({ ...nextProps.data }, () => {
        this.updateMarker(nextProps.currentPosition);
      });
    }
  }
  render() {
    if (this.state.places && !this.props.isLoading) {
      return (
        <View>
          <Image
            style={this.styles.map}
            source={{
              uri: this.props.image_url,
              cache: 'force-cache'
            }}
            defaultSource={this.props.loading_image}
          >
            {this.state.places.map(place => {
              const opacity = place.isMarker ? 0.6 : 0.8;
              return (
                <View
                  key={place.name}
                  style={[
                    this.styles.textWrapper,
                    this.scaleXY(place.x, place.y)
                  ]}
                >
                  <Text
                    style={[
                      this.styles.text,
                      {
                        opacity,
                        fontSize: place.isMarker ? 12 : this.fontSize()
                      }
                    ]}
                  >
                    {this.format(place)}
                  </Text>
                </View>
              );
            })}
          </Image>
        </View>
      );
    }
    return (
      <View style={this.styles.container}>
        <Image style={this.styles.map} source={this.props.loading_image} />
      </View>
    );
  }
}
MapWithLabels.propTypes = {
  loading_image: React.PropTypes.node,
  currentPosition: React.PropTypes.shape({
    latitude: React.PropTypes.number,
    longitude: React.PropTypes.number,
    timestamp: React.PropTypes.number
  }),
  dimensions: React.PropTypes.shape({
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }).isRequired,
  displayMode: React.PropTypes.string,
  screenScale: React.PropTypes.number.isRequired,
  formatTemperature: React.PropTypes.func.isRequired,
  data: React.PropTypes.shape({
    average_in_c: React.PropTypes.number,
    png: React.PropTypes.string
  }),
  isLoading: React.PropTypes.bool,
  image_url: React.PropTypes.string,
  projection: React.PropTypes.func
};
MapWithLabels.defaultProps = {
  isLoading: true,
  image_url: '',
  projection: undefined,
  data: {},
  loading_image: undefined,
  displayMode: 'none',
  temperatureMode: 'F',
  currentPosition: {},
  onStatusClick: undefined
};

export default MapWithLabels;
