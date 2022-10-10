import {StyleSheet, View, ActivityIndicator, Dimensions} from 'react-native';
import React from 'react';

const {width, height} = Dimensions.get('window');

const PdfProgressIndicator: React.FC = () => {
  return (
    <View style={styles.root}>
      <ActivityIndicator size={'large'} color={'#3366ff'} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PdfProgressIndicator;
