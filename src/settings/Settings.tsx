import {View, StyleSheet, Button, Dimensions} from 'react-native';
import React from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ImagePicker from './ImagePicker';
import {Box, NativeBaseProvider} from 'native-base';

const {bottomTabsHeight} = Navigation.constantsSync();
const {width, height} = Dimensions.get('window');

const Settings: NavigationFunctionComponent = ({}) => {
  const translateY = useSharedValue<number>(0);
  const translateModal = useSharedValue<number>(0);

  const showSheet = () => {
    translateModal.value = -height;
    translateY.value = withSpring(-height / 2);
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateModal.value}],
    };
  });

  return (
    <NativeBaseProvider>
      <Box style={styles.root}>
        <View style={styles.container}>
          <Button title={'Sheet'} onPress={showSheet} />
        </View>
        <ImagePicker translateY={translateY} />
      </Box>
    </NativeBaseProvider>
  );
};

Settings.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    width,
    height: height - bottomTabsHeight,
    backgroundColor: '#fff',
  },
  container: {
    width,
    height: height - bottomTabsHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'absolute',
    top: height,
    left: 0,
    width,
    height: height - bottomTabsHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});

export default Settings;
