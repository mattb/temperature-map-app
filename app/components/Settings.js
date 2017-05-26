import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  box: {
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(230, 230, 230, 0.7)',
    position: 'absolute',
    padding: 3,
    borderRadius: 5
  },
  label: {
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
    fontSize: 15
  }
});

const Settings = ({ onTouch }) => (
  <TouchableOpacity onPress={onTouch} style={styles.box}>
    <Text style={[styles.label]}>
      ⚙️
    </Text>
  </TouchableOpacity>
);

Settings.propTypes = {
  onTouch: React.PropTypes.func
};

Settings.defaultProps = {
  onTouch: undefined
};

export default Settings;
