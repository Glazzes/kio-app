import {View, StyleSheet, Dimensions, Pressable, Text} from 'react-native';
import React from 'react';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

type AppbarProps = {
  title: string;
  parentComponentId: string;
  backgroundColor?: string;
};

const {width} = Dimensions.get('window');
const {statusBarHeight} = Navigation.constantsSync();

const Appbar: React.FC<AppbarProps> = ({
  title,
  parentComponentId,
  backgroundColor,
}) => {
  const goBack = async () => {
    await Navigation.pop(parentComponentId);
  };

  return (
    <View style={[styles.appbar, {backgroundColor}]}>
      <View style={styles.container}>
        <Pressable onPress={goBack} style={styles.pressable} hitSlop={50}>
          <Icon name={'ios-arrow-back'} size={22} color={'#000'} />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appbar: {
    width,
    paddingTop: statusBarHeight,
    height: statusBarHeight * 3,
  },
  container: {
    width,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    height: statusBarHeight * 2,
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
