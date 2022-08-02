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
import {Screens} from '../../enums/screens';
import SearchBar from './SearchBar';

type AppbarProps = {
  parentComponentId: string;
};

const {statusBarHeight} = Navigation.constantsSync();
const {width} = Dimensions.get('window');
const IMAGE_SIZE = 40;

const Appbar: React.FC<AppbarProps> = ({scrollY, parentComponentId}) => {
  const toProfile = () => {
    Navigation.push(parentComponentId, {
      component: {
        name: Screens.SETTINGS,
      },
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.appbar}>
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
      <SearchBar />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: width,
    paddingTop: statusBarHeight + 5,
    backgroundColor: '#fff',
  },
  appbar: {
    width,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
