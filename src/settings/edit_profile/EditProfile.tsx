import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  Text,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Navigation,
  NavigationComponentListener,
  NavigationFunctionComponent,
} from 'react-native-navigation';
import Appbar from '../profile/Appbar';
import emitter, {updatePictureEventName} from '../../shared/emitter';
import ImagePicker from './ImagePicker';
import Animated, {
  BounceIn,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Screens} from '../../enums/screens';
import {Asset} from 'expo-media-library';
import {
  pushNavigationScreen,
  removeByComponentId,
} from '../../store/navigationStore';
import Icon from 'react-native-vector-icons/Ionicons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import {ScrollView} from 'react-native-gesture-handler';
import {EditUserRequest, Folder, User, UserExists} from '../../shared/types';
import {displayGenericModal} from '../../navigation/functionts/displayGenericModal';
import {
  displayToast,
  genericErrorMessage,
  nothingToSaveInfoMessage,
  savedProfileChangesSuccessMessage,
} from '../../shared/toast';
import {useSnapshot} from 'valtio';
import authState, {updateUser} from '../../store/authStore';
import Button from '../../shared/components/Button';
import {axiosInstance} from '../../shared/requests/axiosInstance';
import {
  apiUsersEditUrl,
  apiUsersExistsUrl,
} from '../../shared/requests/contants';
import Avatar from '../../shared/components/Avatar';
import {AxiosResponse} from 'axios';

type EditProfileProps = {};

const {statusBarHeight} = Navigation.constantsSync();
const {width, height} = Dimensions.get('window');

const IMAGE_SIZE = 90;
const BAGDE_SIZE = IMAGE_SIZE / 3.3;
const ANGLE = -Math.PI / 4;

type Edit = {
  username: string;
  email: string;
  password: string;
  confirmation: string;
};

type Errors = {
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
};

type Field = keyof Edit;

const EditProfile: NavigationFunctionComponent<EditProfileProps> = ({
  componentId,
}) => {
  const {user} = useSnapshot(authState);

  const [isSecure, setIsSecure] = useState<boolean>(true);
  const [newPic, setNewPic] = useState<string | undefined>(undefined);
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [errors, setErrors] = useState<Errors>({
    username: undefined,
    email: undefined,
    password: undefined,
  });

  const [info, setInfo] = useState<Edit>({
    username: user.username,
    email: user.email,
    password: '',
    confirmation: '',
  });

  const onChangeTextWithTimer = (text: string, field: Field) => {
    setInfo(i => {
      i[field] = text;
      return {...i};
    });

    setErrors(prev => ({...prev, [field]: undefined}));

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(async () => {
      const normalizedText = text.toLocaleLowerCase();
      const normalizedUsername = user.username.toLocaleLowerCase();
      const normalizedEmail = user.email.toLocaleLowerCase();

      try {
        const {data} = await axiosInstance.get<UserExists>(apiUsersExistsUrl, {
          params: {
            username: text.toLocaleLowerCase(),
            email: text.toLocaleLowerCase(),
          },
        });

        setErrors(err => {
          if (
            data.existsByUsername &&
            field === 'username' &&
            normalizedText !== normalizedUsername
          ) {
            err.username = '* This username is already taken';
          }

          if (
            data.existsByEmail &&
            field === 'email' &&
            normalizedText !== normalizedEmail
          ) {
            err.email = '* An account is already registered with this email';
          }

          return {...err};
        });
      } catch (e) {
      } finally {
        clearTimeout(newTimer);
      }
    }, 500);

    setTimer(newTimer);
  };

  const onChangeText = (text: string, field: Field) => {
    setInfo(i => {
      i[field] = text;
      return {...i};
    });

    if (info.password !== info.confirmation) {
      setErrors(err => ({...err, password: '* Passwords do not match'}));
    } else {
      setErrors(err => ({...err, password: undefined}));
    }
  };

  const translateY = useSharedValue<number>(0);

  const toggleIsSecure = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setIsSecure(s => !s);
  };

  const onDeleteAccount = () => {
    displayGenericModal({
      title: 'Delete account',
      message:
        'Deleting your account will delete all information associated with you, including your files, this action can not be undone',
      action: () => {},
    });
  };

  const pop = () => {
    Navigation.pop(componentId);
  };

  const onSavedChanges = async () => {
    if (
      newPic === undefined &&
      user.username === info.username &&
      user.email === info.email &&
      info.password === '' &&
      info.confirmation === ''
    ) {
      displayToast(nothingToSaveInfoMessage);
      return;
    }

    try {
      const request: EditUserRequest = {
        username: info.username,
        email: info.email,
        password: info.password !== '' ? info.password : undefined,
      };

      const formData = new FormData();
      formData.append('request', JSON.stringify(request));
      if (newPic) {
        formData.append('file', {
          name: 'picture.jpg',
          type: 'image/jpeg',
          uri: newPic,
        });
      }

      const {data} = await axiosInstance.patch<User>(
        apiUsersEditUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      updateUser(data);
      displayToast(savedProfileChangesSuccessMessage);
    } catch ({response}) {
      const res = response as AxiosResponse;
      if (res.status === 400) {
        setErrors(err => ({...err, ...res.data}));
        return;
      }

      displayToast(genericErrorMessage);
    }
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

    const listener = emitter.addListener(
      updatePictureEventName,
      (uri: string) => {
        setNewPic(uri);
      },
    );

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

    pushNavigationScreen({
      componentId,
      folder: {id: Screens.EDIT_PROFILE, name: Screens.EDIT_PROFILE} as Folder,
    });

    return () => {
      listener.remove();
      pushToCamera.remove();
      sub.remove();
      removeByComponentId(componentId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const componentListener: NavigationComponentListener = {
      navigationButtonPressed: ({buttonId}) => {
        if (buttonId === 'RNN.hardwareBackButton') {
          console.log(newPic);
          if (
            info.username !== user.username ||
            info.email !== user.email ||
            newPic !== undefined ||
            info.password !== '' ||
            info.confirmation !== ''
          ) {
            displayGenericModal({
              title: 'Discard changes',
              message:
                "You've got unsaved changes. Do you want to discard these changes?",
              action: pop,
            });

            return;
          }
        }

        pop();
      },
    };

    const navigationListener = Navigation.events().registerComponentListener(
      componentListener,
      componentId,
    );

    return () => {
      navigationListener.remove();
      if (timer) {
        clearTimeout(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, newPic, timer]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        stickyHeaderIndices={[0]}>
        <Appbar
          title={'Edit Profile'}
          parentComponentId={componentId}
          backgroundColor={'#fff'}
        />
        <View style={styles.imageContainer}>
          <Pressable onPress={openSheet}>
            <Avatar
              size={IMAGE_SIZE}
              user={user}
              includeBorder={false}
              listenToUpdateEvent={true}
              fontSize={30}
              nativeId={'pfp-dest'}
            />
            <Animated.View
              style={styles.badge}
              entering={BounceIn.delay(1000).duration(300)}>
              <Icon name="camera" size={15} color={'#fff'} />
            </Animated.View>
          </Pressable>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>

        <View style={styles.editContainer}>
          <Text style={styles.title}>Account info</Text>

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-at'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              onChangeText={text => onChangeTextWithTimer(text, 'email')}
              style={styles.textInput}
              placeholder={'Email'}
              value={info.email}
              autoCapitalize={'none'}
            />
          </View>
          {errors.email ? (
            <Text style={styles.error}>{errors.email}</Text>
          ) : null}

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-person'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              onChangeText={text => onChangeTextWithTimer(text, 'username')}
              style={styles.textInput}
              placeholder={'Username'}
              value={info.username}
              autoCapitalize={'none'}
            />
          </View>
          {errors.username ? (
            <Text style={styles.error}>{errors.username}</Text>
          ) : null}

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-lock-closed'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              onChangeText={text => onChangeText(text, 'password')}
              style={styles.textInput}
              placeholder={'Password'}
              secureTextEntry={isSecure}
              autoCapitalize={'none'}
            />
            <Pressable onPress={toggleIsSecure} hitSlop={40}>
              <Icon
                name={isSecure ? 'eye' : 'eye-off'}
                size={22}
                color={'#9E9EA7'}
              />
            </Pressable>
          </View>

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-lock-closed'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              onChangeText={text => onChangeText(text, 'confirmation')}
              style={styles.textInput}
              placeholder={'Password confirmation'}
              secureTextEntry={isSecure}
              autoCapitalize={'none'}
            />
            <Pressable onPress={toggleIsSecure} hitSlop={40}>
              <Icon
                name={isSecure ? 'eye' : 'eye-off'}
                size={22}
                color={'#9E9EA7'}
              />
            </Pressable>
          </View>
          {errors.password ? (
            <Text style={styles.error}>{errors.password}</Text>
          ) : null}

          <View>
            <Button
              text="Save changes"
              disabled={
                (errors.email ||
                  errors.username ||
                  errors.password) as unknown as boolean
              }
              width={width * 0.9}
              onPress={onSavedChanges}
              extraStyle={{marginVertical: 15}}
            />

            <View>
              <Text style={[styles.title]}>Danger zone</Text>
              <Text style={styles.privacy}>
                For more information on account deletion read our{' '}
                <Text style={styles.date}>privacy policy</Text>{' '}
              </Text>
              <Pressable
                style={[styles.button, styles.deleteAccountButton]}
                onPress={onDeleteAccount}>
                <Text style={styles.deleteAccountText}>Delete account</Text>
              </Pressable>
            </View>

            <Text style={styles.joined}>
              Joined <Text style={styles.date}>21 oct, 2020</Text>{' '}
            </Text>
          </View>
        </View>
      </ScrollView>

      <ImagePicker translateY={translateY} />
    </View>
  );
};

EditProfile.options = {
  hardwareBackButton: {
    popStackOnPress: false,
  },
  statusBar: {
    visible: true,
    drawBehind: true,
    backgroundColor: '#fff',
    style: 'dark',
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
  username: {
    textTransform: 'capitalize',
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 20,
    marginTop: 10,
  },
  emailText: {
    fontFamily: 'Uber',
    color: '#9E9EA7',
  },
  editContainer: {
    alignSelf: 'center',
    width: width * 0.9,
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 14,
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
  error: {
    fontFamily: 'UberBold',
    marginLeft: 10,
    marginBottom: 10,
    color: '#ee3060',
    fontSize: 12,
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
  privacy: {
    fontSize: 12,
    fontFamily: 'UberBold',
    marginTop: 15,
  },
  joined: {
    fontSize: 12,
    fontFamily: 'UberBold',
    alignSelf: 'center',
  },
  date: {
    fontSize: 12,
    fontFamily: 'UberBold',
    color: '#3366ff',
  },
});

export default EditProfile;
