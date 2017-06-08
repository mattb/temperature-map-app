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
    if (this.props.location === undefined) {
      this.props.setLocation('temps');
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
    if (this.state.location) {
      return (
        <TouchableOpacity onPress={this.modeClick} activeOpacity={1}>
          <TemperatureLabels
            data={this.props.data}
            isLoading={this.props.isLoading}
            image_url={this.props.image_url}
            when={this.props.when}
            projection={this.props.projection}
            dimensions={this.props.dimensions}
            screenScale={this.props.screenScale}
            title={this.props.title}
            loading_image={this.props.loading_image}
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
  location: React.PropTypes.string,
  currentPosition: React.PropTypes.shape({
    longitude: React.PropTypes.number,
    latitude: React.PropTypes.number,
    timestamp: React.PropTypes.number
  }),
  screenScale: React.PropTypes.number.isRequired,
  title: React.PropTypes.string,
  loading_image: React.PropTypes.node,
  dimensions: React.PropTypes.shape({
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }).isRequired,
  displayMode: React.PropTypes.string.isRequired,
  data: React.PropTypes.shape({
    average_in_c: React.PropTypes.number,
    png: React.PropTypes.string
  }),
  isLoading: React.PropTypes.bool,
  image_url: React.PropTypes.string,
  when: React.PropTypes.string,
  projection: React.PropTypes.func
};
MainScreen.defaultProps = {
  isLoading: true,
  image_url: '',
  when: '',
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
