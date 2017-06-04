import DefaultPreference from 'react-native-default-preference';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  View,
  ActionSheetIOS,
  AppState,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import TemperatureLabels from './TemperatureLabels';
import Settings from './Settings';
import map from '../redux/map';
import settings from '../redux/settings';

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: (new Date().getTime() / 1000 / 60).toFixed(0),
      temperatureMode: 'F'
    };
  }
  componentWillMount() {
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
          DefaultPreference.set(
            'temperature-mode',
            temperatureMode
          ).then(() => {
            console.log('temperatureMode set done', temperatureMode);
          });
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
          this.props.setLocation(location);
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
      this.setState({
        version: (new Date().getTime() / 1000 / 60).toFixed(0)
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
        this.setState({
          version: (new Date().getTime() / 1000 / 60).toFixed(0)
        });
      }
    });

    setInterval(() => {
      this.setState({
        version: (new Date().getTime() / 1000 / 60).toFixed(0)
      });
    }, 1000 * 60);
    this.watchID = navigator.geolocation.watchPosition(
      position => this.props.setMarker(position.coords, position.timestamp),
      () => {}, // error
      { distanceFilter: 250 }
    );
  }
  render() {
    console.log('dimensions', this.props.dimensions);
    if (this.state.location) {
      return (
        <TouchableOpacity onPress={this.modeClick} activeOpacity={1}>
          <TemperatureLabels
            version={this.state.version}
            displayMode={this.props.displayMode}
            formatTemperature={this.props.formatCelsiusTemperature}
            location={this.state.location}
            currentPosition={this.props.currentPosition}
            onStatusClick={this.locationClick}
          />
          <Settings onTouch={this.settingsClick} />
        </TouchableOpacity>
      );
    }
    return <View />;
  }
}

MainScreen.propTypes = {
  setLocation: React.PropTypes.func.isRequired,
  setMarker: React.PropTypes.func.isRequired,
  setUnit: React.PropTypes.func.isRequired,
  setDisplayMode: React.PropTypes.func.isRequired,
  updateDimensions: React.PropTypes.func.isRequired,
  formatCelsiusTemperature: React.PropTypes.func.isRequired,
  currentPosition: React.PropTypes.shape({
    longitude: React.PropTypes.number,
    latitude: React.PropTypes.number,
    timestamp: React.PropTypes.number
  }),
  dimensions: React.PropTypes.shape({
    height: React.PropTypes.number,
    width: React.PropTypes.number
  }),
  displayMode: React.PropTypes.string.isRequired
};
MainScreen.defaultProps = {
  dimensions: {},
  currentPosition: {}
};

export default connect(
  state => ({
    currentPosition: map.selectors.currentPosition(state),
    displayMode: settings.selectors.displayMode(state),
    dimensions: settings.selectors.dimensions(state),
    scale: settings.selectors.scale(state),
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
