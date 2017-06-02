import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import SvgUri from 'react-native-svg-uri';

const gear = require('../images/settings.svg');

const styles = StyleSheet.create({
  box: {
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(230, 230, 230, 1.0)',
    position: 'absolute',
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 4,
    borderRadius: 5,
    opacity: 0.7
  },
  gear: {
    opacity: 0.8
  }
});

const Settings = ({ onTouch }) => (
  <TouchableOpacity onPress={onTouch} style={styles.box}>
    <SvgUri style={styles.gear} width="25" height="25" source={gear} />
  </TouchableOpacity>
);

Settings.propTypes = {
  onTouch: React.PropTypes.func
};

Settings.defaultProps = {
  onTouch: undefined
};

export default Settings;
