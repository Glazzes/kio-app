import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ViewStyle,
  Pressable,
} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {OnBoardingScreens} from '../screens';
import {mmkv} from '../../store/mmkv';
import RNBootSplash from 'react-native-bootsplash';

const {width} = Dimensions.get('window');

const folders: {color: string; offset: number}[] = [
  {color: '#abd1ff', offset: 0.35},
  {color: '#0075ff', offset: 0.15},
  {color: '#014daa', offset: -0.05},
  {color: '#011734', offset: -0.25},
];

const GetStarted: NavigationFunctionComponent = ({componentId}) => {
  mmkv.set('Get.Started', true);
  const pushToLogin = () => {
    Navigation.push(componentId, {
      component: {
        name: OnBoardingScreens.LOGIN,
      },
    });
  };

  useEffect(() => {
    RNBootSplash.hide({fade: true});
  }, []);

  return (
    <View style={styles.root}>
      {folders.map(({color, offset}, index) => {
        const folderStyle: ViewStyle = {
          width: width * 1.2,
          position: 'absolute',
          bottom: width * offset,
          transform: [{translateX: -width * 0.15}],
        };

        return (
          <View style={folderStyle} key={`${color}-${index}`}>
            <Icon name={'folder'} size={width * 1.3} color={color} />
          </View>
        );
      })}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>The easiest way to manage your data</Text>
        <Text style={styles.subTitle}>
          The file manager to make your life easier
        </Text>
      </View>
      <Pressable
        onPress={pushToLogin}
        style={({pressed}) => {
          return {
            ...styles.button,
            opacity: pressed ? 0.75 : 1,
          };
        }}>
        <Text>Get Started</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    position: 'absolute',
    bottom: width * 0.4,
    left: 0,
    paddingLeft: width * 0.05,
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 25,
    maxWidth: width * 0.75,
    color: '#fff',
    marginVertical: 10,
  },
  subTitle: {
    fontFamily: 'Uber',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    maxWidth: width * 0.75,
  },
  button: {
    position: 'absolute',
    right: width * 0.05,
    bottom: width * 0.05,
    width: width * 0.5,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GetStarted;
