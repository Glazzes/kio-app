import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ViewStyle,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  BounceIn,
  FadeIn,
  FadeOut,
  ZoomOut,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import {Modals} from '../navigation/screens/modals';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import emitter from '../utils/emitter';
import {Screens} from '../enums/screens';
import FileSkeleton from './misc/FileSkeleton';
import {TypingEvent} from './types';
import {NavigationContext} from '../navigation/NavigationContextProvider';
import {SelectAction} from './utils/enums';

type FileWrapperProps = {
  index: number;
};

const {width} = Dimensions.get('window');

const SIZE = (width * 0.9 - 10) / 2;

const FileWrapper: React.FC<FileWrapperProps> = ({children, index}) => {
  const componentId = useContext(NavigationContext);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

  const openMenu = () => {
    Navigation.showModal({
      component: {
        name: 'SM', //Modals.FILE_MENU,
        passProps: {
          index,
        },
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
      emitter.emit(
        `${SelectAction.UNSELECT_FILE}-${componentId}`,
        `file-${index}`,
      );
      return;
    }

    if (index === 0) {
      Navigation.push(componentId, {
        component: {
          name: 'GF',
        },
      });
    }

    if (index % 2 === 1) {
      emitter.emit(`push-${index}-${componentId}`);
    }

    if (index % 2 === 0 && index >= 4) {
      goToAudioPlayer();
    }
  };

  const goToAudioPlayer = () => {
    Navigation.push(componentId, {
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
      emitter.emit(
        `${SelectAction.SELECT_FILE}-${componentId}`,
        `file-${index}`,
      );
    } else {
      emitter.emit(
        `${SelectAction.SELECT_FILE}-${componentId}`,
        `file-${index}`,
      );
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

    const unselect = emitter.addListener(`unselect-file`, () => {
      setIsSelected(false);
    });

    const favoriteFile = emitter.addListener(`favorite-${index}`, () => {
      setIsFavorite(s => !s);
    });

    return () => {
      unselect.remove();
      onTyping.remove();
      onEndTyping.remove();
      favoriteFile.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showSkeleton) {
    return (
      <View style={[styles.root, wrapperMargin]}>
        <FileSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.root, wrapperMargin]}>
      <Pressable onPress={onPress} onLongPress={onLongPressSelect}>
        {children}
        {isFavorite && (
          <Animated.View
            entering={BounceIn.duration(300)}
            exiting={ZoomOut.duration(300)}
            style={styles.heart}>
            <Icon name={'ios-heart'} size={25} color={'#ee3060'} />
          </Animated.View>
        )}
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
          onPress={openMenu}
          hitSlop={50}
          style={({pressed}) => ({
            opacity: pressed ? 0.3 : 1,
          })}>
          <Icon
            name={'ellipsis-vertical'}
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
  heart: {
    position: 'absolute',
    top: 5,
    left: 5,
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
