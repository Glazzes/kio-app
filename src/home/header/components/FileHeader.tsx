import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';

type FileHeaderProps = {
  title: 'Folders' | 'Files';
  itemLength: number;
};

const {width} = Dimensions.get('window');

const FileHeader: React.FC<FileHeaderProps> = ({title, itemLength}) => {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    width: width * 0.9,
    marginTop: 10,
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 15,
    color: '#000',
  },
  subtitle: {
    fontFamily: 'UberBold',
    fontSize: 12,
    color: '#000',
  },
  count: {
    fontFamily: 'Uber',
    color: '#3366ff',
    fontSize: 12,
  },
});

export default FileHeader;
