import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {User} from '../shared/types';

type UserSearchProps = {
  user: User;
};

const SIZE = 50;

const UserSearch: React.FC<UserSearchProps> = ({user}) => {
  return (
    <View style={styles.root}>
      <Image
        source={{uri: 'https://randomuser.me/api/portraits/men/32.jpg'}}
        style={styles.image}
      />
      <View>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    marginRight: 10,
  },
  username: {
    fontFamily: 'UberBold',
    color: '#000',
  },
  email: {
    fontFamily: 'Uber',
  },
});

export default UserSearch;
