import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {User} from '../shared/types';
import Avatar from '../shared/components/Avatar';

type UserSearchProps = {
  user: User;
};

const SIZE = 50;

const UserSearch: React.FC<UserSearchProps> = ({user}) => {
  return (
    <View style={styles.root}>
      <Avatar user={user} includeBorder={false} size={45} />
      <View style={styles.container}>
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
  container: {
    paddingHorizontal: 10,
  },
  username: {
    fontFamily: 'UberBold',
    color: '#000',
    textTransform: 'capitalize',
  },
  email: {
    fontFamily: 'Uber',
  },
});

export default UserSearch;
