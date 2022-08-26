import {View, StyleSheet, Dimensions, Text} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Appbar from './profile/Appbar';
import UserInfo from './profile/UserInfo';
import UnitInfo from './profile/UnitInfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

type Action = {
  title: string;
  icon: string;
};

const actions: Action[] = [
  {
    icon: 'account',
    title: 'Account Management',
  },
  {
    icon: 'information',
    title: 'Information',
  },
  {
    icon: 'arrow-right-bold',
    title: 'Log Out',
  },
];

const Settings: NavigationFunctionComponent = ({componentId}) => {
  return (
    <View style={styles.root}>
      <Appbar title={'My Profile'} parentComponentId={componentId} />
      <UserInfo parentComponentId={componentId} />
      <UnitInfo />

      <View style={styles.options}>
        {actions.map((action, index) => {
          return (
            <View
              style={styles.optionContaier}
              key={`${action.title}-${index}`}>
              <View style={styles.optionIconContainer}>
                <Icon name={action.icon} size={25} color={'#000'} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.optionText}>{action.title}</Text>
              </View>
              <Icon name="chevron-right" size={25} color={'#000'} />
            </View>
          );
        })}
      </View>
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
    backgroundColor: '#FAFAFB',
    alignItems: 'center',
  },
  options: {
    marginTop: 20,
    flex: 1,
    width,
    paddingVertical: width * 0.05,
    paddingHorizontal: width * 0.05,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  optionContaier: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  optionIconContainer: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F3F3F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  optionText: {
    color: '#000',
    fontFamily: 'UberBold',
  },
});

export default Settings;
