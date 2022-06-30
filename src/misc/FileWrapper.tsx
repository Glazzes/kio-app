import {View, Image, Dimensions, StyleSheet} from 'react-native';
import React from 'react';

type FileWrapperProps = {};

const {width, height} = Dimensions.get('window');

const FileWrapper: React.FC<FileWrapperProps> = ({}) => {
  return (
    <View style={styles.file}>
      <Image source={require('./glaceon.jpg')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  file: {
    width: width * 0.9,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#F3F3F4',
    marginVertical: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
});

export default React.memo(FileWrapper);
