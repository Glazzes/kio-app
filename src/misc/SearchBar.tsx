import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Pressable,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import emitter from '../utils/emitter';
import {TypingEvent} from '../enums/events';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';

const {width} = Dimensions.get('window');
const CLOSE_ICON_SIZE = 20;
const DURATION = 200;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SearchBar: React.FC = ({}) => {
  const ref = useRef<TextInput>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [lastTextLength, setLastTextLength] = useState<number>(0);

  const onChangeText = (text: string) => {
    setSearchTerm(text);

    if (Math.abs(lastTextLength - text.length) === 1) {
      emitter.emit(TypingEvent.TYPING);
    }

    if (timer) {
      clearTimeout(timer);
    }

    const showResults = setTimeout(() => {
      setLastTextLength(text.length);
      emitter.emit(TypingEvent.STOPPED_TYPIMG, text);
    }, 600);

    setTimer(showResults);
  };

  const restoreTextInput = () => {
    ref.current?.clear();
    Keyboard.dismiss();
    setSearchTerm('');
  };

  useEffect(() => {
    const kListener = Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss();
    });

    return () => {
      kListener.remove();
    };
  }, []);

  return (
    <View style={styles.root}>
      <Icon name={'magnify'} color={'#9E9EA7'} size={20} style={styles.icon} />
      <TextInput
        ref={ref}
        onChangeText={onChangeText}
        placeholder="Search"
        style={styles.searchbar}
      />
      {searchTerm.length > 0 && (
        <AnimatedPressable
          entering={ZoomIn.duration(DURATION)}
          exiting={ZoomOut.duration(DURATION)}
          style={[styles.icon, styles.closeIcon]}
          onPress={restoreTextInput}>
          <Icon
            name={'plus'}
            size={15}
            color={'#fff'}
            style={{transform: [{rotate: '45deg'}]}}
          />
        </AnimatedPressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: width * 0.89,
    height: 40,
    backgroundColor: '#F3F3F4',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  searchbar: {
    flex: 1,
    fontFamily: 'Uber',
    backgroundColor: '#F3F3F4',
    color: '#C5C8D7',
  },
  closeIcon: {
    backgroundColor: '#000',
    height: CLOSE_ICON_SIZE,
    width: CLOSE_ICON_SIZE,
    borderRadius: CLOSE_ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;
