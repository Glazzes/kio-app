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
    marginLeft: width * 0.05,
    marginVertical: 5,
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 16,
    color: '#9Ba4b3',
  },
  subtitle: {
    fontFamily: 'UberBold',
    fontSize: 12,
    color: '#9Ba4b3',
  },
  count: {
    fontFamily: 'Uber',
    color: '#3366ff',
    fontSize: 12,
  },
});

export default FileHeader;
