import {View, StyleSheet, Image, Pressable, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Appbar from '../profile/Appbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import emitter from '../../utils/emitter';
import ImagePicker from '../picker/ImagePicker';
import Animated, {
  BounceIn,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Screens} from '../../enums/screens';
import {Asset} from 'expo-media-library';
import {push, removeByComponentId} from '../../store/navigationStore';

type EditProfileProps = {};

const {height} = Dimensions.get('window');

const IMAGE_SIZE = 90;
const BAGDE_SIZE = IMAGE_SIZE / 3;
const ANGLE = -Math.PI / 4;

const EditProfile: NavigationFunctionComponent<EditProfileProps> = ({
  componentId,
}) => {
  const [newPic, setNewPic] = useState<string | undefined>(undefined);

  const translateY = useSharedValue<number>(0);

  const openSheet = () => {
    translateY.value = withSpring(-height / 2);
  };

  useEffect(() => {
    const sub = emitter.addListener('picture.selected', (asset: Asset) => {
      console.log(asset);
      Navigation.push(componentId, {
        component: {
          name: Screens.EDITOR,
          passProps: {
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
          },
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
              },
            },
          },
        },
      });
    });

    const navigationListener =
      Navigation.events().registerComponentDidDisappearListener(() => {
        translateY.value = withTiming(0);
      });

    const listener = emitter.addListener('np', (pic: string) => {
      setNewPic(pic);
    });

    const pushToCamera = emitter.addListener('push.camera', () => {
      Navigation.push(componentId, {
        component: {
          name: Screens.CAMERA,
          passProps: {
            singlePicture: true,
          },
        },
      });
    });

    push({name: 'Edit.Profile', componentId});

    return () => {
      listener.remove();
      navigationListener.remove();
      pushToCamera.remove();
      sub.remove();
      removeByComponentId(componentId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <Appbar title={'Edit Profile'} parentComponentId={componentId} />
      <View style={styles.imageContainer}>
        <Pressable onPress={openSheet}>
          <Image
            nativeID="pfp-dest"
            style={styles.image}
            source={{
              uri: newPic ?? 'https://randomuser.me/api/portraits/men/32.jpg',
            }}
            resizeMode={'cover'}
          />
          <Animated.View
            style={styles.badge}
            entering={BounceIn.delay(1000).duration(300)}>
            <Icon name="camera" size={18} color={'#fff'} />
          </Animated.View>
        </Pressable>
      </View>

      <ImagePicker translateY={translateY} />
    </View>
  );
};

EditProfile.options = {
  statusBar: {
    visible: true,
    drawBehind: true,
  },
  topBar: {
    visible: false,
  },
  sideMenu: {
    right: {
      enabled: false,
    },
  },
  animations: {
    push: {
      sharedElementTransitions: [
        {
          fromId: 'pfp',
          toId: 'pfp-dest',
          duration: 300,
        },
      ],
    },
    pop: {
      sharedElementTransitions: [
        {
          fromId: 'pfp-dest',
          toId: 'pfp',
          duration: 300,
        },
      ],
    },
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
  badge: {
    height: BAGDE_SIZE,
    width: BAGDE_SIZE,
    borderRadius: BAGDE_SIZE / 2,
    backgroundColor: '#3366ff',
    borderWidth: 3,
    borderColor: '#fff',
    position: 'absolute',
    top: IMAGE_SIZE / 2 + -Math.sin(ANGLE) * (IMAGE_SIZE / 2) - BAGDE_SIZE / 2,
    left: IMAGE_SIZE / 2 + Math.cos(ANGLE) * (IMAGE_SIZE / 2) - BAGDE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfile;
