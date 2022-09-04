import {View, Text} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';

type DownloadProgressProps = {};

const DownloadProgress: NavigationFunctionComponent<
  DownloadProgressProps
> = ({}) => {
  return (
    <View>
      <Text>Welcome to DownloadProgress</Text>
    </View>
  );
};

DownloadProgress.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

export default DownloadProgress;
