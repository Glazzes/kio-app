import {View, Text, StyleSheet, Pressable, Dimensions} from 'react-native';
import React from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Modals} from '../../../navigation/screens/modals';
import Icon from 'react-native-vector-icons/Ionicons';
import {File} from '../../../shared/types';

type GenericFileDetailsProps = {
  file: File;
};

const {width} = Dimensions.get('window');
const {statusBarHeight} = Navigation.constantsSync();

const GenericFileDetails: NavigationFunctionComponent<
  GenericFileDetailsProps
> = ({componentId, file}) => {
  const pop = () => {
    Navigation.pop(componentId);
  };

  const openFileMenu = () => {
    Navigation.showModal({
      component: {
        name: Modals.FILE_MENU,
      },
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.appbar}>
        <Pressable hitSlop={20} onPress={pop}>
          <Icon name={'ios-arrow-back'} size={22} color={'#000'} />
        </Pressable>
        <Pressable hitSlop={20} onPress={openFileMenu}>
          <Icon name={'ios-ellipsis-vertical'} size={22} color={'#000'} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <Icon name={'ios-document'} size={120} color={'#3366ff'} />
        <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
          {file.name}
        </Text>
        <Text style={styles.size}>5Mb</Text>

        <Text style={styles.message}>
          This file format is not supported for visualization, read about it{' '}
          <Text style={styles.link}>here</Text>
        </Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Download</Text>
        </Pressable>
      </View>
    </View>
  );
};

GenericFileDetails.options = {
  statusBar: {
    visible: false,
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
  appbar: {
    width: width * 0.9,
    height: statusBarHeight * 3,
    paddingTop: statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 20,
  },
  size: {
    fontFamily: 'UberBold',
    color: '#000',
    marginBottom: 20,
  },
  message: {
    fontFamily: 'UberBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    fontFamily: 'UberBold',
    color: '#3366ff',
  },
  button: {
    width: width * 0.9,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#3366ff',
  },
  buttonText: {
    fontFamily: 'UberBold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default GenericFileDetails;
