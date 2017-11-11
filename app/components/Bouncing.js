import PropTypes from 'prop-types';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  }
});

class Bouncing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iterationCount: 0
    };
  }
  componentDidMount() {
    const prefName = `bouncing-${this.props.configName}`;
    DefaultPreference.get(prefName).then(c => {
      const iterationCount = c === undefined ? 3 : parseInt(c, 10);
      if (this.state.iterationCount !== iterationCount) {
        this.setState({
          iterationCount
        });
        if (iterationCount > 0) {
          DefaultPreference.set(prefName, `${iterationCount - 1}`);
        }
      }
    });
  }
  render() {
    if (this.state.iterationCount > 0) {
      return (
        <Animatable.View
          style={styles.wrapper}
          animation="bounce"
          iterationCount={this.state.iterationCount}
        >
          {this.props.children}
        </Animatable.View>
      );
    }
    return <View style={styles.wrapper}>{this.props.children}</View>;
  }
}

Bouncing.propTypes = {
  children: PropTypes.node.isRequired,
  configName: PropTypes.string.isRequired
};

export default Bouncing;
