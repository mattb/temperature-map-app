import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import SvgUri from 'react-native-svg-uri';

const gear = require('../images/settings.svg');

const styles = StyleSheet.create({
  box: {
    right: 10,
    ...ifIphoneX(
      {
        bottom: 34
      },
      {
        bottom: 10
      }
    ),
    backgroundColor: 'rgba(230, 230, 230, 1.0)',
    position: 'absolute',
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 4,
    borderRadius: 5,
    opacity: 0.7
  }
});

const Settings = ({ onTouch }) => (
  <TouchableOpacity
    onPress={onTouch}
    style={styles.box}
    testID="settings-box"
    accessible
    accessibilityLabel="settings"
  >
    <SvgUri style={{ opacity: 0.8 }} width="25" height="25" source={gear} />
  </TouchableOpacity>
);

Settings.propTypes = {
  onTouch: PropTypes.func
};

Settings.defaultProps = {
  onTouch: undefined
};

export default Settings;
