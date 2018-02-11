import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const styles = StyleSheet.create({
  box: {
    left: 10,
    ...ifIphoneX(
      {
        bottom: 34
      },
      {
        bottom: 10
      }
    ),
    backgroundColor: 'rgba(230, 230, 230, 0.7)',
    position: 'absolute',
    padding: 3,
    borderRadius: 5
  },
  label: {
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'left'
  }
});

const Status = ({
  formatTemperature,
  onTouch,
  title,
  scale,
  min_in_c,
  average_in_c,
  max_in_c,
  when,
  sunriseSunset
}) => (
  <TouchableOpacity
    onPress={onTouch}
    style={styles.box}
    testID="status"
    accessible
    accessibilityLabel="status"
  >
    <Text
      style={[
        styles.label,
        {
          fontSize: 10 * scale
        }
      ]}
    >
      {title}
      {'\n'}
      min {formatTemperature(min_in_c)} average{' '}
      {formatTemperature(average_in_c)} max {formatTemperature(max_in_c)}
      {'\n'}
      {sunriseSunset}
      {'\n'}last updated {when}
    </Text>
  </TouchableOpacity>
);

Status.propTypes = {
  title: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  min_in_c: PropTypes.string.isRequired,
  average_in_c: PropTypes.number.isRequired,
  max_in_c: PropTypes.string.isRequired,
  when: PropTypes.string.isRequired,
  sunriseSunset: PropTypes.string.isRequired,
  onTouch: PropTypes.func,
  formatTemperature: PropTypes.func.isRequired
};

Status.defaultProps = {
  onTouch: undefined
};

export default Status;
