import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import {withKeyboard} from '../../shared/hoc';
import {NotificationType} from '../../enums/notification';
import axios, {AxiosResponse} from 'axios';
import {
  apiUsersExistsUrl,
  apiUsersUrl,
  host,
} from '../../shared/requests/contants';
import Button from '../../shared/components/Button';
import {UserExists} from '../../shared/types';
import {displayToast, genericErrorMessage} from '../../shared/toast';

const {width} = Dimensions.get('window');
const {statusBarHeight} = Navigation.constantsSync();

type AccountCreationErrors = {
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
};

const CreateAccount: NavigationFunctionComponent = ({componentId}) => {
  const info = useRef({username: '', password: '', email: ''});

  const [isSecure, setIsSecure] = useState<boolean>(true);
  const [fieldErrors, setFieldErrors] = useState<AccountCreationErrors>({
    username: undefined,
    email: undefined,
    password: undefined,
  });

  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const toggleIsSecure = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setIsSecure(s => !s);
  };

  const goBack = () => {
    Navigation.pop(componentId);
  };

  const onChangeWithCheck = (text: string, field: 'username' | 'email') => {
    info.current[field] = text;
    setFieldErrors(errors => ({...errors, [field]: undefined}));

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(async () => {
      try {
        const {data} = await axios.get<UserExists>(
          `${host}${apiUsersExistsUrl}`,
          {
            params: {
              username: text.toLocaleLowerCase(),
              email: text.toLocaleLowerCase(),
            },
          },
        );

        setFieldErrors(err => {
          if (data.existsByUsername && field === 'username') {
            err.username = '* This username is already taken';
          }

          if (data.existsByEmail && field === 'email') {
            err.email = '* An account is already registered with this email';
          }

          return {...err};
        });
      } catch (e) {
        console.log(e);
      }
    }, 1000);

    setTimer(newTimer);
  };

  const onChangeText = (text: string, field: 'username' | 'password') => {
    info.current[field] = text;
    setFieldErrors(err => ({...err, [field]: undefined}));
  };

  const createAccount = async () => {
    try {
      await axios.post(`${host}${apiUsersUrl}`, info.current);

      displayToast({
        title: 'Account created',
        message:
          'Your account has been created successfuly, you can now login!',
        type: NotificationType.SUCCESS,
      });

      Navigation.pop(componentId);
    } catch ({response}) {
      const res = response as AxiosResponse;
      if (res.status === 400) {
        setFieldErrors(err => ({...err, ...res.data}));
        return;
      }

      displayToast(genericErrorMessage);
    }
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      stickyHeaderIndices={[0]}>
      <View style={styles.topbar}>
        <Pressable onPress={goBack} hitSlop={40}>
          <Icon name={'ios-arrow-back'} color={'#000'} size={22} />
        </Pressable>
      </View>

      <Image source={require('../assets/kotlin.png')} style={styles.logo} />

      <Text style={styles.signUp}>Sign up</Text>

      <View>
        <View style={styles.textInputContainer}>
          <Icon
            name={'ios-at'}
            size={22}
            color={'#9E9EA7'}
            style={styles.icon}
          />
          <TextInput
            style={styles.textInput}
            placeholder={'Email'}
            onChangeText={text => onChangeWithCheck(text, 'email')}
            autoCapitalize={'none'}
          />
        </View>
        {fieldErrors.email && (
          <Text style={styles.error}>{fieldErrors.email}</Text>
        )}
      </View>

      <View>
        <View style={styles.textInputContainer}>
          <Icon
            name={'ios-person'}
            size={22}
            color={'#9E9EA7'}
            style={styles.icon}
          />
          <TextInput
            style={styles.textInput}
            placeholder={'Username'}
            onChangeText={text => onChangeWithCheck(text, 'username')}
            autoCapitalize={'none'}
          />
        </View>
        {fieldErrors.username && (
          <Text style={styles.error}>{fieldErrors.username}</Text>
        )}
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
          onChangeText={text => onChangeText(text, 'password')}
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
      {fieldErrors.password && (
        <Text style={styles.error}>{fieldErrors.password}</Text>
      )}

      <View style={styles.buttonContainer}>
        <Text style={styles.joined}>
          By signing up, you're agree to{' '}
          <Text style={styles.login}>terms and conditions</Text> and our{' '}
          <Text style={styles.login}>privicy policy.</Text>
        </Text>

        <Button
          text="Confirm"
          disabled={
            (fieldErrors.username ||
              fieldErrors.email ||
              fieldErrors.password) as unknown as boolean
          }
          width={width * 0.9}
          onPress={createAccount}
          extraStyle={styles.buttonMargin}
        />

        <View style={styles.joinedContainer}>
          <Text style={styles.joined}>Joined us before?</Text>
          <Pressable hitSlop={20} onPress={goBack}>
            <Text style={styles.login}> Login</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

CreateAccount.options = {
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
  content: {
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
    marginBottom: 30,
    alignSelf: 'center',
  },
  signUp: {
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
  error: {
    fontFamily: 'UberBold',
    marginLeft: 10,
    marginBottom: 10,
    color: '#ee3060',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonMargin: {
    marginVertical: 10,
  },
  joinedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  joined: {
    fontFamily: 'UberBold',
    fontSize: 12,
  },
  login: {
    fontFamily: 'UberBold',
    color: '#3366ff',
    fontSize: 12,
  },
});

export default withKeyboard(CreateAccount);
