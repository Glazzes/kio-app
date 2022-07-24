import {View, StyleSheet, Dimensions, Image, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Navigation,
  NavigationComponentListener,
  NavigationFunctionComponent,
} from 'react-native-navigation';
import {useSharedValue, withSpring, withTiming} from 'react-native-reanimated';
import ImagePicker from './picker/ImagePicker';
import emitter from '../utils/emitter';
import {Asset} from 'expo-media-library';
import {Screens} from '../enums/screens';
import Appbar from './profile/Appbar';
import UserInfo from './profile/UserInfo';
import UnitInfo from './profile/UnitInfo';

const {width, height} = Dimensions.get('window');
const IMAGE_SIZE = 90;

const Settings: NavigationFunctionComponent = ({componentId}) => {
  const [newPicture, setNewPicture] = useState<string | undefined>(undefined);

  const translateY = useSharedValue<number>(0);

  const showSheet = () => {
    translateY.value = withSpring(-height / 2);
  };

  useEffect(() => {
    const sub = emitter.addListener('picture.selected', (asset: Asset) => {
      // translateY.value = withTiming(0);
      Navigation.push(componentId, {
        component: {
          name: Screens.EDITOR,
          passProps: {asset},
          options: {
            animations: {
              push: {
                content: {
                  alpha: {
                    from: 0,
                    to: 1,
                    duration: 600,
                  },
                },
                sharedElementTransitions: [
                  {
                    fromId: `asset-${asset.uri}`,
                    toId: `asset-${asset.uri}-dest`,
                    duration: 450,
                  },
                ],
              },
            },
          },
        },
      });
    });

    const listener = Navigation.events().registerComponentDidDisappearListener(
      () => {
        translateY.value = withTiming(0);
      },
    );

    return () => {
      sub.remove();
      listener.remove();
    };
  });

  return (
    <View style={styles.root}>
      <Appbar parentComponentId={componentId} />
      <UserInfo parentComponentId={componentId} />
      <UnitInfo />
    </View>
  );
};

Settings.options = {
  statusBar: {
    visible: false,
    drawBehind: false,
  },
  topBar: {
    visible: false,
  },
  sideMenu: {
    right: {
      enabled: false,
    },
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});

export default Settings;
