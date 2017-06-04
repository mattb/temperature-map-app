import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  box: {
    left: 10,
    bottom: 10,
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
  when
}) =>
  <TouchableOpacity onPress={onTouch} style={styles.box}>
    <Text
      style={[
        styles.label,
        {
          fontSize: 10 * scale
        }
      ]}
    >
      {title}{'\n'}
      min {formatTemperature(min_in_c)} average {' '}
      {formatTemperature(average_in_c)} max {formatTemperature(max_in_c)}
      {'\n'}last updated {when}
    </Text>
  </TouchableOpacity>;

Status.propTypes = {
  title: React.PropTypes.string.isRequired,
  scale: React.PropTypes.number.isRequired,
  min_in_c: React.PropTypes.string.isRequired,
  average_in_c: React.PropTypes.number.isRequired,
  max_in_c: React.PropTypes.string.isRequired,
  when: React.PropTypes.string.isRequired,
  onTouch: React.PropTypes.func,
  formatTemperature: React.PropTypes.func.isRequired
};

Status.defaultProps = {
  onTouch: undefined
};

export default Status;
