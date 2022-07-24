import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type BreadCrumbsProps = {};

const {width} = Dimensions.get('window');
const folders = [
  'HomeHomeHomeHomeHomeHomeHomeHomeHomeHome',
  'Images',
  'Space',
  'Astronaut',
  'Home',
  'Images',
  'Space',
  'Astronaut',
];

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({}) => {
  return (
    <View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={styles.scrollview}>
        {folders.map((folder, index) => {
          return (
            <View key={`${folder}-${index}`} style={styles.container}>
              <Text
                style={styles.text}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {folder}
              </Text>
              {index !== folders.length - 1 && (
                <Icon name={'chevron-right'} color={'#354259'} size={20} />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollview: {
    height: 35,
    maxHeight: 35,
    width: width * 0.9,
    marginVertical: 5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'UberBold',
    fontSize: 12,
    maxWidth: 100,
  },
});

export default BreadCrumbs;
