import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Navigation} from 'react-native-navigation';

type AppbarProps = {};

const {statusBarHeight} = Navigation.constantsSync();
const {width} = Dimensions.get('window');
const IMAGE_SIZE = 40;

const Appbar: React.FC<AppbarProps> = ({}) => {
  return (
    <View style={styles.root}>
      <View>
        <Text style={styles.hi}>Hi,</Text>
        <Text style={styles.username}>Glaze</Text>
      </View>
      <Image
        source={{
          uri: 'https://pettime.net/wp-content/uploads/2021/04/Dalmatian-2-10.jpg',
        }}
        style={styles.image}
        resizeMode={'cover'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: width * 0.9,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: statusBarHeight + 5,
    marginBottom: 0,
    marginHorizontal: width * 0.05,
  },
  hi: {
    fontFamily: 'Uber',
  },
  username: {
    fontFamily: 'UberBold',
    fontSize: 17,
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
});

export default Appbar;
