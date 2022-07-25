import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Screens} from '../enums/screens';

type AppbarProps = {
  parentComponentId: string;
};

const {statusBarHeight} = Navigation.constantsSync();
const {width} = Dimensions.get('window');
const IMAGE_SIZE = 40;

const Appbar: React.FC<AppbarProps> = ({parentComponentId}) => {
  const toProfile = () => {
    Navigation.push(parentComponentId, {
      component: {
        name: Screens.SETTINGS,
      },
    });
  };

  return (
    <View style={styles.root}>
      <View>
        <Text style={styles.hi}>Hi,</Text>
        <Text style={styles.username}>Glaze</Text>
      </View>
      <Pressable onPress={toProfile}>
        <Image
          source={{
            uri: 'https://pettime.net/wp-content/uploads/2021/04/Dalmatian-2-10.jpg',
          }}
          style={styles.image}
          resizeMode={'cover'}
        />
      </Pressable>
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
    color: '#000',
  },
  username: {
    fontFamily: 'UberBold',
    fontSize: 17,
    color: '#000',
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
});

export default Appbar;
