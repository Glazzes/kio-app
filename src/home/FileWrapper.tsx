import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ViewStyle,
  Pressable,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedRef,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import {Modals} from '../navigation/Modals';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import emitter from '../utils/emitter';
import {Screens} from '../enums/screens';
import FileSkeleton from './misc/FileSkeleton';
import {TypingEvent} from './types';

type FileWrapperProps = {
  index: number;
  parentComponentId: string;
};

const {width} = Dimensions.get('window');

const SIZE = (width * 0.9 - 10) / 2;

const FileWrapper: React.FC<FileWrapperProps> = ({
  children,
  index,
  parentComponentId,
}) => {
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const aref = useAnimatedRef();

  const openMenu = () => {
    Navigation.showModal({
      component: {
        name: Modals.FILE_MENU,
      },
    });
  };

  const wrapperMargin: ViewStyle = useMemo(() => {
    return {marginLeft: index % 2 === 0 ? width * 0.05 : 5};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPress = () => {
    if (isSelected) {
      setIsSelected(false);
      emitter.emit('slr', `file-${index}`);
      return;
    }

    if (index % 2 === 1 || index === 0) {
      emitter.emit(`push-${index}`);
    }

    if (index % 2 === 0 && index >= 4) {
      goToAudioPlayer();
    }
  };

  const goToAudioPlayer = () => {
    Navigation.push(parentComponentId, {
      component: {
        name: Screens.AUDIO_PLAYER,
      },
    });
  };

  const onLongPressSelect = async () => {
    await impactAsync(ImpactFeedbackStyle.Medium);
    const swap = !isSelected;
    setIsSelected(swap);

    if (swap) {
      emitter.emit('sl', `file-${index}`);
    } else {
      emitter.emit('slr', `file-${index}`);
    }
  };

  useEffect(() => {
    const onTyping = emitter.addListener(
      TypingEvent.BEGIN_TYPING,
      (text: string) => {
        setShowSkeleton(true);
      },
    );

    const onEndTyping = emitter.addListener(TypingEvent.END_TYPING, () => {
      setShowSkeleton(false);
    });

    const unselect = emitter.addListener('unselect-file', () => {
      setIsSelected(false);
    });

    return () => {
      unselect.remove();
      onTyping.remove();
      onEndTyping.remove();
    };
  }, []);

  if (showSkeleton) {
    return <FileSkeleton index={index} />;
  }

  return (
    <View style={[styles.root, wrapperMargin]}>
      <Pressable onPress={onPress} onLongPress={onLongPressSelect}>
        {children}
        {isSelected && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.selected}
          />
        )}
      </Pressable>
      <View style={styles.infoContainer}>
        <View style={styles.flex}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
            Glaceon.png
          </Text>
          <Text style={styles.subtitle}>1MB</Text>
        </View>
        <Pressable
          ref={aref}
          onPress={openMenu}
          hitSlop={50}
          style={({pressed}) => ({
            opacity: pressed ? 0.3 : 1,
          })}>
          <Icon
            name={'dots-vertical'}
            size={20}
            color={'#282828'}
            style={styles.icon}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    marginVertical: 10,
    alignSelf: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  flex: {
    flex: 1,
  },
  title: {
    flex: 1,
    color: '#282828',
    fontFamily: 'Uber',
  },
  subtitle: {
    color: '#AAAAAA',
    fontFamily: 'Uber',
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  selected: {
    width: SIZE,
    height: SIZE,
    position: 'absolute',
    backgroundColor: 'rgba(51, 102, 255, 0.35)',
    borderRadius: 5,
  },
  selectionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  selectedIcon: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    backgroundColor: '#3366ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FileWrapper;
