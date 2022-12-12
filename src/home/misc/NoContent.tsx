import {View, Dimensions, StyleSheet, Text} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

type NoContentProps = {
  files: number;
  folders: number;
  searchTerm: string;
  isFetching: boolean;
};

const {width} = Dimensions.get('window');

const NoContent: React.FC<NoContentProps> = ({
  files,
  folders,
  isFetching,
  searchTerm,
}) => {
  if (!isFetching && searchTerm !== '' && files === 0 && folders === 0) {
    return (
      <View style={styles.root}>
        <LottieView
          source={require('./assets/notfound.json')}
          style={{width: width * 0.75, height: width * 0.75}}
          autoPlay={true}
          loop={true}
        />
        <Text style={[styles.message, styles.margin]}>
          No results was found for {`"${searchTerm}"`}
        </Text>
      </View>
    );
  }

  if (isFetching) {
    return (
      <View style={styles.root}>
        <LottieView
          source={require('./assets/loading.json')}
          style={{width: width * 0.85, height: width * 0.85}}
          autoPlay={true}
          loop={true}
        />
      </View>
    );
  }

  if (files === 0) {
    return (
      <View style={styles.root}>
        <LottieView
          source={require('./assets/nocontent.json')}
          style={{width: width * 0.85, height: width * 0.85}}
          autoPlay={true}
          loop={true}
        />
        {folders === 0 && files === 0 && (
          <Text style={styles.message}>This folder is currently empty</Text>
        )}
        {files === 0 && folders !== 0 && (
          <Text style={styles.message}>This folder has no files yet</Text>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: width,
  },
  message: {
    fontFamily: 'UberBold',
    textAlign: 'center',
  },
  margin: {
    marginTop: 20,
  },
});

export default NoContent;
