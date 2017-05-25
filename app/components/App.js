import codePush from 'react-native-code-push';
import DefaultPreference from 'react-native-default-preference';
import React, { Component } from 'react';
import { View, ActionSheetIOS, AppState, TouchableOpacity } from 'react-native';
import TemperatureLabels from './TemperatureLabels';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: (new Date().getTime() / 1000 / 60).toFixed(0),
      displayMode: 'name'
    };
  }
  componentWillMount() {
    const displayModes = ['name', 'temp'];
    const locations = [
      ['San Francisco', 'temps'],
      ['North Bay', 'northbay'],
      ['East Bay', 'eastbay'],
      ['South Bay', 'southbay'],
      ['Bay Area', 'bayarea']
    ];
    let displayModeIndex = 0;

    this.locationClick = () => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: locations.map(l => l[0])
        },
        buttonIndex => {
          const location = locations[buttonIndex][1];
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
      this.setState({
        displayMode: displayModes[displayModeIndex],
        version: (new Date().getTime() / 1000 / 60).toFixed(0)
      });
      DefaultPreference.set('display-mode', `${displayModeIndex}`).then(() => {
        console.log('displayMode set done');
      });
    };

    DefaultPreference.get('location').then(location => {
      this.setState({
        location: location || locations[0][1]
      });
    });

    DefaultPreference.get('display-mode').then(idx => {
      if (idx !== undefined) {
        this.setState({
          displayMode: displayModes[idx]
        });
      } else {
        this.setState({
          displayMode: displayModes[0]
        });
      }
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
      position => {
        this.setState({
          currentPosition: Object.assign({}, position.coords, {
            timestamp: position.timestamp
          })
        });
      },
      () => {
        // error
      },
      { distanceFilter: 250 }
    );
  }
  render() {
    if (this.state.location) {
      return (
        <TouchableOpacity onPress={this.modeClick} activeOpacity={1}>
          <TemperatureLabels
            version={this.state.version}
            displayMode={this.state.displayMode}
            location={this.state.location}
            currentPosition={this.state.currentPosition}
            onStatusClick={this.locationClick}
          />
        </TouchableOpacity>
      );
    }
    return <View />;
  }
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
};
export default codePush(codePushOptions)(App);
