import {View, StyleSheet, Dimensions, Pressable, Text} from 'react-native';
import React from 'react';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type AppbarProps = {
  parentComponentId: string;
};

const {width} = Dimensions.get('window');
const {statusBarHeight} = Navigation.constantsSync();

const Appbar: React.FC<AppbarProps> = ({parentComponentId}) => {
  const goBack = async () => {
    await Navigation.pop(parentComponentId);
  };

  return (
    <View style={styles.appbar}>
      <Pressable onPress={goBack} style={styles.pressable}>
        <Icon name={'chevron-left'} size={23} color={'#000'} />
      </Pressable>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Profile</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appbar: {
    width,
    marginTop: statusBarHeight,
    height: statusBarHeight * 2,
    flexDirection: 'row',
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
  },
  pressable: {
    position: 'absolute',
    left: width * 0.05,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Uber',
    fontSize: 15,
    color: '#000',
  },
});

export default Appbar;
