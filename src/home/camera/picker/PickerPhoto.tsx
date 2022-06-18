import {StyleSheet, Dimensions, ImageBackground} from 'react-native';
import React, {useRef, useState} from 'react';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import emitter from '../../../utils/emitter';
import {Event} from '../../../enums/events';

type PickerPhotoProps = {
  uri: string;
  selected: boolean;
};

const {width} = Dimensions.get('window');

const PADDING = 5;
const SIZE = width / 3 - PADDING * 2;
const CIRCLE_SIZE = 20;

const PickerPhoto: React.FC<PickerPhotoProps> = ({uri, selected}) => {
  const [isSelected, setIsSelected] = useState(selected);

  const onSelectedPhoto = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    if (isSelected) {
      emitter.emit(Event.UNSELECT_PHOTO, uri);
    } else {
      emitter.emit(Event.SELECT_PHOTO, uri);
    }

    setIsSelected(s => !s);
  };

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderWidth: 2,
      borderColor: isSelected
        ? withTiming('#3366ff')
        : withTiming('rgba(51, 102, 255, 0)'),
    };
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      borderWidth: 2,
      borderColor: isSelected
        ? withTiming('rgba(51, 102, 255, 1)')
        : withTiming('rgba(255, 255, 255, 1)'),
      backgroundColor: isSelected
        ? withTiming('rgba(51, 102, 255, 1)')
        : withTiming('rgba(51, 102, 255, 0)'),
    };
  });

  return (
    <TouchableWithoutFeedback onPress={onSelectedPhoto}>
      <Animated.View style={[styles.tile, borderStyle]}>
        <ImageBackground source={{uri}} style={styles.image} resizeMode="cover">
          <Animated.View style={[styles.circle, rStyle]}>
            {isSelected && (
              <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}>
                <Icon name={'check'} color={'#fff'} size={15} />
              </Animated.View>
            )}
          </Animated.View>
        </ImageBackground>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: SIZE,
    height: SIZE,
    marginHorizontal: PADDING,
    marginVertical: PADDING,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  border: {
    borderWidth: 2,
    borderColor: '#3366ff',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    marginHorizontal: CIRCLE_SIZE / 4,
    marginVertical: CIRCLE_SIZE / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(PickerPhoto);
