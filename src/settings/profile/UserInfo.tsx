import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useEffect, useState} from 'react';
import {Navigation} from 'react-native-navigation';
import emitter from '../../utils/emitter';

type UserInfoProps = {
  parentComponentId: string;
};

const {width} = Dimensions.get('window');
const IMAGE_SIZE = 85;

const UserInfo: React.FC<UserInfoProps> = ({parentComponentId}) => {
  const [newPic, setNewPic] = useState<string | undefined>(undefined);

  const editProfile = () => {
    Navigation.push(parentComponentId, {
      component: {
        name: 'Edit.Profile',
        options: {
          animations: {
            push: {
              sharedElementTransitions: [
                {
                  fromId: 'ppf',
                  toId: 'ppf-edit',
                  duration: 450,
                },
              ],
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    const listener = emitter.addListener('np', (pic: string) => {
      setNewPic(pic);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <View style={styles.infoContainer}>
      <Image
        nativeID="ppf"
        style={styles.image}
        source={{
          uri: newPic ?? 'https://randomuser.me/api/portraits/men/32.jpg',
        }}
        resizeMode={'cover'}
      />
      <View style={styles.userInfoContainer}>
        <View style={styles.margin}>
          <Text
            style={styles.username}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            Glaze
          </Text>
          <Text style={styles.email} numberOfLines={1} ellipsizeMode={'tail'}>
            Glaze@outlook.es
          </Text>
        </View>
      </View>
      <Pressable onPress={editProfile}>
        <Icon name={'pencil'} size={23} color={'#9E9EA7'} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    width: width * 0.9,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    backgroundColor: '#9E9EA7',
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontFamily: 'UberBold',
    fontSize: 18,
    color: '#000',
  },
  email: {
    fontFamily: 'Uber',
    color: '#9E9EA7',
  },
  margin: {
    marginHorizontal: 10,
  },
});

export default UserInfo;
