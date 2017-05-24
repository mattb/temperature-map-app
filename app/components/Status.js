import React from 'react';
import { Text } from 'react-native';

const f = c => 32 + parseFloat(c, 10) * 9.0 / 5.0;

const Status = ({ scale, min_in_c, average_in_c, max_in_c, when }) => (
  <Text
    style={{
      fontSize: 10 * scale,
      left: 10,
      bottom: 10,
      color: 'rgba(0, 0, 0, 0.7)',
      backgroundColor: 'rgba(230, 230, 230, 0.7)',
      position: 'absolute',
      textAlign: 'left',
      padding: 3
    }}
  >
    {'min '}
    {f(min_in_c).toFixed(0)}
    {'F average '}
    {f(average_in_c).toFixed(0)}
    {'F max '}
    {f(max_in_c).toFixed(0)}
    {'F\nlast updated '}
    {when}
  </Text>
);

Status.propTypes = {
  scale: React.PropTypes.number.isRequired,
  min_in_c: React.PropTypes.string.isRequired,
  average_in_c: React.PropTypes.number.isRequired,
  max_in_c: React.PropTypes.string.isRequired,
  when: React.PropTypes.string.isRequired
};

export default Status;
