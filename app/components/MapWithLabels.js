import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Animated, StyleSheet, Image, Text, View } from 'react-native';

const markerGlyph = '🔵';

const imageSize = {
  width: 375,
  height: 667
};

const animationTime = 100;

class MapWithLabels extends Component {
  constructor(props) {
    super(props);

    this.loadingAnim = new Animated.Value(1);
    this.textAnim = Animated.add(1, Animated.multiply(this.loadingAnim, -1));
    console.log('CONSTRUCTOR');
    this.state = {
      image: props.loading_image,
      loading_image: props.loading_image
    };

    this.loadImage = uri => {
      if (this.state.image && this.state.image.uri === uri) {
        return;
      }
      console.log('PREFETCHING', uri);
      Image.prefetch(uri).then(success => {
        if (success) {
          this.loadingAnim.setValue(1);
          console.log(
            'TRANSITIONING',
            this.state.loading_image &&
            typeof this.state.loading_image === 'object'
              ? this.state.loading_image.uri
              : this.state.loading_image,
            uri
          );
          this.setState(
            {
              image: {
                uri
              }
            },
            () => setTimeout(this.transitionToImage, 1)
          );
        }
      });
    };

    this.transitionToImage = () => {
      Animated.timing(this.loadingAnim, {
        toValue: 0,
        duration: animationTime,
        useNativeDriver: true
      }).start(() => {
        this.setState(state => ({
          loading_image: state.image
        }));
      });
    };

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

    if (isIphoneX()) {
      this.safeAreas = {
        top: 44,
        bottom: this.props.dimensions.height - 72 - this.fontSize()
      };
    } else {
      this.safeAreas = {
        top: 0,
        bottom: this.props.dimensions.height - this.fontSize()
      };
    }

    this.format = place => {
      if (place.isMarker) {
        return place.name;
      }
      const temp = `${this.props.formatTemperature(place.temp_in_c)}`;
      if (this.props.displayMode === 'all') {
        return `${place.name}\n${temp}`;
      }
      if (this.props.displayMode === 'none') {
        return '';
      }
      if (this.props.displayMode === 'name') {
        return `${place.name}`;
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
    this.loadImage(this.props.image_url);
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
    if (this.props.image_url !== nextProps.image_url) {
      this.loadImage(nextProps.image_url);
    }
  }
  render() {
    if (this.state.places && !this.props.isLoading) {
      return (
        <View>
          <Image style={this.styles.map} source={this.state.image} />
          <Animated.Image
            style={[
              this.styles.map,
              {
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: this.loadingAnim
              }
            ]}
            source={this.state.loading_image}
          />
          {this.state.places.map(place => {
            const opacity = place.isMarker ? 0.6 : 0.8;
            const scaledXY = this.scaleXY(place.x, place.y);
            if (
              scaledXY.top < this.safeAreas.top ||
              scaledXY.top > this.safeAreas.bottom
            ) {
              return <View key={place.name} />;
            }
            return (
              <Animated.View
                key={place.name}
                style={[
                  this.styles.textWrapper,
                  scaledXY,
                  { opacity: this.textAnim }
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
              </Animated.View>
            );
          })}
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
MapWithLabels.propTypes = {
  loading_image: PropTypes.node,
  currentPosition: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    timestamp: PropTypes.number
  }),
  dimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }).isRequired,
  displayMode: PropTypes.string,
  screenScale: PropTypes.number.isRequired,
  formatTemperature: PropTypes.func.isRequired,
  data: PropTypes.shape({
    average_in_c: PropTypes.number,
    png: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  image_url: PropTypes.string,
  projection: PropTypes.func
};
MapWithLabels.defaultProps = {
  isLoading: true,
  image_url: '',
  projection: undefined,
  data: {},
  loading_image: undefined,
  displayMode: 'none',
  currentPosition: {}
};

export default MapWithLabels;
