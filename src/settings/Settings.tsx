import {View, StyleSheet, Button, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useSharedValue, withSpring} from 'react-native-reanimated';
import ImagePicker from './picker/ImagePicker';
import {Box, NativeBaseProvider} from 'native-base';
import emitter from '../utils/emitter';
import {Asset} from 'expo-media-library';
import {Screens} from '../enums/screens';

const {bottomTabsHeight} = Navigation.constantsSync();
const {width, height} = Dimensions.get('window');

const Settings: NavigationFunctionComponent = ({componentId}) => {
  const translateY = useSharedValue<number>(0);

  const showSheet = () => {
    translateY.value = withSpring(-height / 2);
  };

  useEffect(() => {
    const sub = emitter.addListener('picture.selected', (asset: Asset) => {
      Navigation.push(componentId, {
        component: {
          name: Screens.EDITOR,
          passProps: {asset},
        },
      });
    });

    return () => sub.remove();
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
  bottomTabs: {
    elevation: 5,
  },
  statusBar: {
    visible: true,
    drawBehind: true,
    backgroundColor: 'lime',
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
