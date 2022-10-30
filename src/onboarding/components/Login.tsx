import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import {Screens} from '../../enums/screens';
import {Notification} from '../../enums/notification';
import {OnBoardingScreens} from '../screens';
import {mmkv} from '../../store/mmkv';
import axios from 'axios';
import {host} from '../../shared/constants';
import {TokenResponse} from '../../shared/types';
import authState from '../../store/authStore';
import {axiosInstance} from '../../shared/requests/axiosInstance';
import {withKeyboard} from '../../utils/hoc';
import {mainRoot} from '../../navigation/roots';
import RNBootSplash from 'react-native-bootsplash';

const {width} = Dimensions.get('window');
const {statusBarHeight} = Navigation.constantsSync();
const hasGottenStarted = mmkv.getBoolean('Get.Started');

type UsernamePasswordLogin = {
  username: string;
  password: string;
};

const Login: NavigationFunctionComponent = ({componentId}) => {
  const login = useRef<UsernamePasswordLogin>({username: '', password: ''});
  const [isSecure, setisSecure] = useState<boolean>(true);

  const toggleIsSecure = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setisSecure(s => !s);
  };

  const goBack = () => {
    Navigation.pop(componentId);
  };

  const onChangeText = (text: string, type: 'username' | 'password') => {
    if (type === 'username') {
      login.current.username = text;
    }

    if (type === 'password') {
      login.current.password = text;
    }
  };

  const signIn = async () => {
    try {
      const {data}: {data: TokenResponse} = await axios.post(
        `${host}/api/v1/auth/login`,
        login.current,
      );

      authState.tokens = data;
      mmkv.set('tokens', JSON.stringify(data));

      const {data: user} = await axiosInstance.get('/api/v1/users/me');
      authState.user = user;

      Navigation.setRoot(mainRoot);
    } catch (e) {
      Navigation.showOverlay({
        component: {
          name: Screens.TOAST,
          passProps: {
            title: 'Failed Login',
            message:
              'You provided invalid credentials, invalid username or password',
            type: Notification.ERROR,
          },
        },
      });
    }
  };

  const pushToCreateAccount = () => {
    Navigation.push(componentId, {
      component: {
        name: OnBoardingScreens.CREATE_ACCOUNT,
      },
    });
  };

  useEffect(() => {
    RNBootSplash.hide({fade: true});
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.topbar}>
        <Pressable
          onPress={goBack}
          hitSlop={40}
          style={{opacity: !hasGottenStarted ? 1 : 0}}>
          <Icon name={'ios-arrow-back'} color={'#000'} size={22} />
        </Pressable>
      </View>

      <View style={styles.loginContainer}>
        <Image source={require('../assets/kotlin.png')} style={styles.logo} />

        <View>
          <Text style={styles.login}>Login</Text>

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-person'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Email / Username'}
              onChangeText={t => onChangeText(t, 'username')}
              autoCapitalize={'none'}
            />
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
              secureTextEntry={isSecure}
              placeholder={'Password'}
              onChangeText={t => onChangeText(t, 'password')}
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

          <View style={styles.buttonContainer}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
            <Pressable style={styles.loginButton} onPress={signIn}>
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
            <View style={styles.newToContainer}>
              <Text style={styles.newText}>New to Kio?</Text>
              <Pressable hitSlop={20} onPress={pushToCreateAccount}>
                <Text style={styles.register}> Register</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

Login.options = {
  statusBar: {
    visible: true,
    drawBehind: true,
    backgroundColor: '#fff',
    style: 'dark',
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: statusBarHeight,
  },
  topbar: {
    width,
    height: statusBarHeight * 2,
    paddingTop: statusBarHeight,
    justifyContent: 'center',
    //backgroundColor: 'pink',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  login: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 22,
    marginBottom: 10,
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
  forgotPassword: {
    fontFamily: 'UberBold',
    color: 'rgba(51, 102, 255, 0.65)',
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    marginTop: 15,
  },
  loginButton: {
    height: 45,
    width: width * 0.9,
    padding: 10,
    marginVertical: 15,
    backgroundColor: '#3366ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
  newToContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  newText: {
    fontFamily: 'UberBold',
  },
  register: {
    fontFamily: 'UberBold',
    color: '#3366ff',
  },
});

export default withKeyboard(Login);
