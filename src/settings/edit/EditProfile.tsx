import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  Text,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Appbar from '../profile/Appbar';
import emitter from '../../utils/emitter';
import ImagePicker from '../picker/ImagePicker';
import Animated, {
  BounceIn,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Screens} from '../../enums/screens';
import {Asset} from 'expo-media-library';
import {push, removeByComponentId} from '../../store/navigationStore';
import Icon from 'react-native-vector-icons/Ionicons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import {ScrollView} from 'react-native-gesture-handler';
import {Notification} from '../../enums/notification';

type EditProfileProps = {};

const {statusBarHeight} = Navigation.constantsSync();
const {width, height} = Dimensions.get('window');

const IMAGE_SIZE = 90;
const BAGDE_SIZE = IMAGE_SIZE / 3.5;
const ANGLE = -Math.PI / 4;

const EditProfile: NavigationFunctionComponent<EditProfileProps> = ({
  componentId,
}) => {
  const [isSecure, setIsSecure] = useState<boolean>(true);
  const [newPic, setNewPic] = useState<string | undefined>(undefined);

  const translateY = useSharedValue<number>(0);

  const toggleIsSecure = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setIsSecure(s => !s);
  };

  const onDeleteAccount = () => {
    Navigation.showModal({
      component: {
        name: 'Generic',
        passProps: {
          title: 'Delete account',
          message:
            'Deleting your account will delete all information associated with you, including your files, this action can not be undone',
        },
      },
    });
  };

  const onSavedChanges = () => {
    Navigation.showOverlay({
      component: {
        name: Screens.TOAST,
        passProps: {
          title: 'Saved changes',
          message: 'Your account has been updated successfully',
          type: Notification.SUCCESS,
        },
      },
    });
  };

  const openSheet = () => {
    translateY.value = withSpring(-height / 2);
  };

  useEffect(() => {
    const sub = emitter.addListener('picture.selected', (asset: Asset) => {
      Navigation.push(componentId, {
        component: {
          name: Screens.EDITOR,
          passProps: {
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
          },
        },
      });
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
      pushToCamera.remove();
      sub.remove();
      removeByComponentId(componentId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView style={styles.root} stickyHeaderIndices={[0]}>
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
              <Icon name="camera" size={15} color={'#fff'} />
            </Animated.View>
          </Pressable>
          <Text style={styles.username}>Glaze</Text>
          <Text style={styles.emailText}>glaze@demo.com</Text>
        </View>

        <View style={styles.editContainer}>
          <Text style={styles.username}>Account info</Text>

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-at'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput style={styles.textInput} placeholder={'Email'} />
          </View>

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-person'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput style={styles.textInput} placeholder={'Username'} />
          </View>

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-lock-closed'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Password'}
              secureTextEntry={isSecure}
            />
            <Pressable onPress={toggleIsSecure} hitSlop={40}>
              <Icon
                name={isSecure ? 'eye' : 'eye-off'}
                size={22}
                color={'#9E9EA7'}
              />
            </Pressable>
          </View>

          <Text style={styles.username}>Danger zone</Text>
          <Pressable
            style={[styles.button, styles.deleteAccountButton]}
            onPress={onDeleteAccount}>
            <Text style={styles.deleteAccountText}>Delete account</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.confirmButton]}
            onPress={onSavedChanges}>
            <Text style={styles.confirmButtonText}>Save changes</Text>
          </Pressable>
        </View>
      </ScrollView>

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
  content: {
    paddingBottom: statusBarHeight,
  },
  imageContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {},
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
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    top: IMAGE_SIZE / 2 + -Math.sin(ANGLE) * (IMAGE_SIZE / 2) - BAGDE_SIZE / 2,
    left: IMAGE_SIZE / 2 + Math.cos(ANGLE) * (IMAGE_SIZE / 2) - BAGDE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailText: {
    fontFamily: 'Uber',
    color: '#d5d5d5',
  },
  editContainer: {
    alignSelf: 'center',
    width: width * 0.9,
  },
  username: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 15,
    marginTop: 10,
  },
  textInputContainer: {
    height: 45,
    width: width * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F4',
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },

  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 45,
    fontFamily: 'Uber',
    backgroundColor: '#F3F3F4',
    color: '#C5C8D7',
  },
  button: {
    height: 45,
    width: width * 0.9,
    padding: 10,
    marginVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#3366ff',
  },
  confirmButtonText: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
  deleteAccountButton: {
    borderWidth: 1,
    borderColor: '#ee3060',
  },
  deleteAccountText: {
    fontFamily: 'UberBold',
    color: '#ee3060',
  },
});

export default EditProfile;
