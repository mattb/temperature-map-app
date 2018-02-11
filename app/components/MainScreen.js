import DefaultPreference from 'react-native-default-preference';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  ActionSheetIOS,
  AppState,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import Bouncing from './Bouncing';
import Settings from './Settings';
import Status from './Status';
import MapWithLabels from './MapWithLabels';
import map from '../redux/map';
import settings from '../redux/settings';

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temperatureMode: 'F'
    };
    this.formatTemperatureWithUnit = c =>
      this.props.formatCelsiusTemperature(c, true);
  }
  componentWillMount() {
    if (this.props.location === undefined) {
      this.props.setLocation({
        location: 'temps',
        versionUpdate: true
      });
    } else {
      this.props.setLocation({
        versionUpdate: true
      });
    }
    this.props.updateDimensions();
    Dimensions.addEventListener('change', this.props.updateDimensions);

    const displayModes = ['name', 'temp'];
    const locations = [
      ['San Francisco', 'temps'],
      ['North Bay', 'northbay'],
      ['East Bay', 'eastbay'],
      ['South Bay', 'southbay'],
      ['Bay Area', 'bayarea']
    ];
    let displayModeIndex = 0;

    this.settingsClick = () => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Temperatures in C', 'Temperatures in F', 'Cancel'],
          cancelButtonIndex: 2
        },
        buttonIndex => {
          if (buttonIndex === 2) {
            return;
          }
          const temperatureMode = buttonIndex === 0 ? 'C' : 'F';
          this.props.setUnit(temperatureMode);
          this.setState({
            temperatureMode
          });
          DefaultPreference.set('temperature-mode', temperatureMode).then(
            () => {
              console.log('temperatureMode set done', temperatureMode);
            }
          );
        }
      );
    };

    this.locationClick = () => {
      const options = locations.map(l => l[0]);
      options.push('Cancel');
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: locations.length
        },
        buttonIndex => {
          if (buttonIndex === locations.length) {
            return;
          }
          const location = locations[buttonIndex][1];
          this.props.setLocation({
            location
          });
          this.setState({
            location
          });
          DefaultPreference.set('location', location).then(() => {
            console.log('location set done', location);
          });
        }
      );
    };

    this.modeClick = () => {
      displayModeIndex = (displayModeIndex + 1) % displayModes.length;
      this.props.setDisplayMode(displayModes[displayModeIndex]);
      this.props.setLocation({
        versionUpdate: true
      });
      DefaultPreference.set('display-mode', `${displayModeIndex}`).then(() => {
        console.log('displayMode set done');
      });
    };

    DefaultPreference.get('temperature-mode').then(temperatureMode => {
      this.setState({
        temperatureMode: temperatureMode || 'F'
      });
    });

    DefaultPreference.get('location').then(location => {
      this.setState({
        location: location || locations[0][1]
      });
    });

    AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        this.props.setLocation({
          versionUpdate: true
        });
      }
    });

    setInterval(() => {
      this.props.setLocation({
        versionUpdate: true
      });
    }, 1000 * 60);
    this.watchID = navigator.geolocation.watchPosition(
      position => this.props.setMarker(position.coords, position.timestamp),
      () => {}, // error
      { distanceFilter: 250 }
    );
  }
  render() {
    if (this.state.location) {
      return (
        <View>
          <TouchableOpacity
            onPress={this.modeClick}
            activeOpacity={1}
            testID="map"
            accessible
            accessibilityLabel="map"
          >
            <MapWithLabels
              data={this.props.data}
              isLoading={this.props.isLoading}
              image_url={this.props.image_url}
              when={this.props.when}
              projection={this.props.projection}
              dimensions={this.props.dimensions}
              screenScale={this.props.screenScale}
              loading_image={this.props.loading_image}
              displayMode={this.props.displayMode}
              formatTemperature={this.props.formatCelsiusTemperature}
              currentPosition={this.props.currentPosition}
              onStatusClick={this.locationClick}
            />
          </TouchableOpacity>
          <Settings onTouch={this.settingsClick} />
          {!this.props.isLoading && (
            <Bouncing configName="Statusbox">
              <Status
                formatTemperature={this.formatTemperatureWithUnit}
                title={this.props.title}
                scale={this.props.screenScale}
                min_in_c={this.props.data.min_in_c}
                max_in_c={this.props.data.max_in_c}
                average_in_c={this.props.data.average_in_c}
                when={this.props.when}
                sunriseSunset={this.props.sunriseSunset}
                onTouch={this.locationClick}
              />
            </Bouncing>
          )}
        </View>
      );
    }
    return <View />;
  }
}

MainScreen.propTypes = {
  setLocation: PropTypes.func.isRequired,
  setMarker: PropTypes.func.isRequired,
  setUnit: PropTypes.func.isRequired,
  setDisplayMode: PropTypes.func.isRequired,
  updateDimensions: PropTypes.func.isRequired,
  formatCelsiusTemperature: PropTypes.func.isRequired,
  location: PropTypes.string,
  currentPosition: PropTypes.shape({
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    timestamp: PropTypes.number
  }),
  screenScale: PropTypes.number.isRequired,
  title: PropTypes.string,
  loading_image: PropTypes.node,
  dimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }).isRequired,
  displayMode: PropTypes.string.isRequired,
  data: PropTypes.shape({
    average_in_c: PropTypes.number,
    min_in_c: PropTypes.string,
    max_in_c: PropTypes.string,
    png: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  image_url: PropTypes.string,
  when: PropTypes.string,
  sunriseSunset: PropTypes.string,
  projection: PropTypes.func
};
MainScreen.defaultProps = {
  isLoading: true,
  image_url: '',
  when: '',
  sunriseSunset: '',
  projection: undefined,
  data: {},
  title: '',
  loading_image: undefined,
  location: undefined,
  dimensions: {
    width: 0,
    height: 0
  },
  currentPosition: {}
};

export default connect(
  state => ({
    data: map.selectors.data(state),
    isLoading: map.selectors.isLoading(state),
    image_url: map.selectors.image_url(state),
    when: map.selectors.when(state),
    sunriseSunset: map.selectors.sunriseSunset(state),
    projection: map.selectors.projection(state),
    currentPosition: map.selectors.currentPosition(state),
    title: map.selectors.title(state),
    loading_image: map.selectors.loadingImage(state),
    displayMode: settings.selectors.displayMode(state),
    dimensions: settings.selectors.dimensions(state),
    screenScale: settings.selectors.scale(state),
    formatCelsiusTemperature: settings.selectors.formatCelsiusTemperature(state)
  }),
  dispatch => ({
    updateDimensions: () => dispatch(settings.actions.updateDimensions()),
    setUnit: unit => dispatch(settings.actions.setUnit(unit)),
    setDisplayMode: mode => dispatch(settings.actions.setDisplayMode(mode)),
    setLocation: l => dispatch(map.actions.setLocation(l)),
    setMarker: (coords, timestamp) =>
      dispatch(map.actions.setMarker(coords, timestamp))
  })
)(MainScreen);
