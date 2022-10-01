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
import emitter from '../../utils/emitter';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {withKeyboard} from '../../utils/hoc';
import {TypingEvent} from '../types';

const {width} = Dimensions.get('window');
const CLOSE_ICON_SIZE = 20;
const DURATION = 200;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SearchBar: React.FC = ({}) => {
  const ref = useRef<TextInput>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const lastTextLength = useRef<number>(0);

  const onChangeText = (text: string) => {
    if (Math.abs(lastTextLength.current - text.length) === 1) {
      emitter.emit(TypingEvent.BEGIN_TYPING);
    }

    if (timer) {
      clearTimeout(timer);
    }

    const showResults = setTimeout(() => {
      emitter.emit(TypingEvent.END_TYPING, text);
    }, 1000);

    setSearchTerm(text);
    setTimer(showResults);
    lastTextLength.current = text.length;
  };

  const restoreTextInput = () => {
    ref.current?.clear();
    Keyboard.dismiss();
    setSearchTerm('');
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    width: width * 0.9,
    height: 40,
    backgroundColor: '#F3F3F4',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 10,
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

export default withKeyboard(SearchBar);
