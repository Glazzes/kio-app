import {View, Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import emitter from '../../utils/emitter';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';

type ControlsProps = {};

const {width, height} = Dimensions.get('window');
const H_PADDING = 15;
const V_PADDING = H_PADDING * 2;

const Controls: React.FC<ControlsProps> = ({}) => {
  const haptic = () => impactAsync(ImpactFeedbackStyle.Light);

  const toggleFlash = () => {
    emitter.emit('toggle.flash');
    haptic();
  };

  const flipCamera = () => {
    emitter.emit('flip.camera');
    haptic();
  };

  return (
    <View style={styles.controls}>
      <View>
        <TouchableWithoutFeedback onPress={toggleFlash} style={styles.icon}>
          <Icon name={'flash'} size={25} color={'#fff'} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={flipCamera} style={styles.icon}>
          <Icon name={'camera-switch-outline'} size={25} color={'#fff'} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    width,
    height: height - V_PADDING * 2 - 100,
    paddingHorizontal: H_PADDING,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  icon: {
    marginVertical: 10,
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Controls;
