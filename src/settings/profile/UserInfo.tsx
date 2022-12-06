import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Screens} from '../../enums/screens';
import {useSnapshot} from 'valtio';
import authState from '../../store/authStore';
import Avatar from '../../shared/components/Avatar';

type UserInfoProps = {
  parentComponentId: string;
};

const {width} = Dimensions.get('window');
const IMAGE_SIZE = 60;

const UserInfo: React.FC<UserInfoProps> = ({parentComponentId}) => {
  const {user} = useSnapshot(authState);

  const pushToEditProfile = () => {
    Navigation.push(parentComponentId, {
      component: {
        name: Screens.EDIT_PROFILE,
      },
    });
  };

  return (
    <View style={styles.infoContainer}>
      <Avatar
        nativeId={'pfp'}
        user={user}
        size={IMAGE_SIZE}
        includeBorder={false}
        fontSize={20}
      />
      <View style={styles.userInfoContainer}>
        <View style={styles.margin}>
          <Text
            style={styles.username}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {user.username}
          </Text>
          <Text style={styles.email} numberOfLines={1} ellipsizeMode={'tail'}>
            {user.email}
          </Text>
        </View>
      </View>
      <Pressable onPress={pushToEditProfile} hitSlop={30}>
        <Icon name={'pencil'} size={20} color={'#000'} />
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
    textTransform: 'capitalize',
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
