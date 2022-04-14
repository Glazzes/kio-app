import {View, StyleSheet, Button, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useSharedValue, withSpring} from 'react-native-reanimated';
import ImagePicker from './ImagePicker';
import {Box, NativeBaseProvider} from 'native-base';

const {bottomTabsHeight} = Navigation.constantsSync();
const {width, height} = Dimensions.get('window');

const Settings: NavigationFunctionComponent = ({}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const translateY = useSharedValue<number>(0);

  const showSheet = () => {
    setShowModal(true);
    translateY.value = withSpring(height / 2);
  };

  return (
    <NativeBaseProvider>
      <Box flex={1} bgColor={'#fff'}>
        <View style={styles.container}>
          <Button title={'Sheet'} onPress={showSheet} />
        </View>
        {showModal && (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {backgroundColor: 'rgba(0, 0,0, 0.3)'},
            ]}
          />
        )}
        <ImagePicker translateY={translateY} />
      </Box>
    </NativeBaseProvider>
  );
};

Settings.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    width,
    height: height - bottomTabsHeight,
    backgroundColor: '#fff',
  },
  container: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Settings;
