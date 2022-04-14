import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';

const Notifications: NavigationFunctionComponent = ({}) => {
  return (
    <View style={styles.root}>
      <Text>Welcome to Notifications</Text>
    </View>
  );
};

Notifications.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Notifications;
