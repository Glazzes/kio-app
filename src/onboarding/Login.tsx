import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {withKeyboard} from '../utils/hoc';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import {Screens} from '../enums/screens';
import {Notification} from '../enums/notification';

type LoginProps = {};

const {width} = Dimensions.get('window');
const {statusBarHeight} = Navigation.constantsSync();

const Login: NavigationFunctionComponent<LoginProps> = ({componentId}) => {
  const [isSecure, setisSecure] = useState<boolean>(true);

  const toggleIsSecure = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setisSecure(s => !s);
  };

  const goBack = () => {
    Navigation.pop(componentId);
  };

  const onInvalidCredentails = () => {
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
  };

  return (
    <View style={styles.root}>
      <View style={styles.topbar}>
        <Pressable onPress={goBack} hitSlop={40}>
          <Icon name={'ios-arrow-back'} color={'#000'} size={22} />
        </Pressable>
      </View>

      <View style={styles.loginContainer}>
        <Image source={require('./kotlin.png')} style={styles.logo} />

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
            <Pressable
              style={styles.loginButton}
              onPress={onInvalidCredentails}>
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
            <View style={styles.newToContainer}>
              <Text style={styles.newText}>New to Kio?</Text>
              <Pressable hitSlop={20}>
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
    height: statusBarHeight * 3,
    paddingTop: statusBarHeight,
    justifyContent: 'center',
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
