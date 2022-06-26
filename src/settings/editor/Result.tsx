import {View, StyleSheet, Pressable, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import FAB from '../../misc/filefab/FAB';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {Screens} from '../../enums/screens';
import {Event} from '../../enums/events';
import {Notification} from '../../enums/notification';

type ResultProps = {
  uri?: string;
};

const Result: NavigationFunctionComponent<ResultProps> = ({
  uri,
  componentId,
}) => {
  useEffect(() => {
    impactAsync(ImpactFeedbackStyle.Medium);
  }, []);

  const [opacity, setOpacity] = useState<number>(1);

  return (
    <View style={[styles.root]}>
      <Pressable
        onPress={() => {
          Navigation.showModal({
            component: {
              name: Screens.IMAGE_DETAILS,
              options: {
                animations: {
                  showModal: {
                    sharedElementTransitions: [
                      {
                        fromId: 'img',
                        toId: 'img-dest',
                        duration: 300,
                      },
                    ],
                  },
                },
              },
            },
          });

          setOpacity(0);
        }}>
        <Image
          source={{uri: 'file:///storage/sdcard0/Descargas/fox.jpg'}}
          style={[styles.box, {opacity}]}
          resizeMode={'cover'}
          resizeMethod={'scale'}
          nativeID={'img'}
        />
      </Pressable>
      <FAB />
    </View>
  );
};

Result.options = {
  sideMenu: {
    right: {
      enabled: true,
    },
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    height: 100,
    width: 100,
    backgroundColor: 'orange',
  },
});

export default Result;
