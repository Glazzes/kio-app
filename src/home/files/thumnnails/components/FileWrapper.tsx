import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ViewStyle,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  BounceIn,
  FadeIn,
  FadeOut,
  ZoomOut,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import {NavigationContext} from '../../../../navigation/NavigationContextProvider';
import {Modals} from '../../../../navigation/screens/modals';
import emitter from '../../../../utils/emitter';
import {getSimpleMimeType} from '../../../../shared/functions/getMimeType';
import {MimeType} from '../../../../shared/enum/MimeType';
import {pushToScreen} from '../../../../shared/functions/navigation/pushToScreen';
import {Screens} from '../../../../enums/screens';
import {TypingEvent} from '../../../utils/types';
import {convertBytesToRedableUnit} from '../../../../shared/functions/convertBytesToRedableUnit';
import FileSkeleton from './FileSkeleton';
import {File} from '../../../../shared/types';
import SearchableText from '../../../../misc/SearchableText';
import {
  addFileToSelection,
  fileSelectionState,
  removeFileFromSelection,
} from '../../../../store/fileSelection';
import {useSnapshot} from 'valtio';

type FileWrapperProps = {
  index: number;
  file: File;
};

const {width} = Dimensions.get('window');

const SIZE = (width * 0.9 - 10) / 2;

const FileWrapper: React.FC<FileWrapperProps> = ({children, index, file}) => {
  const selection = useSnapshot(fileSelectionState);

  const searchTerm = useRef<string>('');
  const {componentId, folder} = useContext(NavigationContext);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

  const openMenu = async () => {
    if (folder) {
      Navigation.showOverlay({
        component: {
          name: Modals.FILE_MENU,
          passProps: {
            file,
            parentFolderId: folder.id,
          },
        },
      });
    }
  };

  const wrapperMargin: ViewStyle = useMemo(() => {
    return {marginLeft: index % 2 === 0 ? width * 0.05 : 10};
  }, [index]);

  const onPress = () => {
    if (isSelected) {
      setIsSelected(false);
      removeFileFromSelection(file.id);
      return;
    }

    const mimeType = getSimpleMimeType(file.contentType);
    switch (mimeType) {
      case MimeType.AUDIO:
        pushToScreen(componentId, Screens.AUDIO_PLAYER, {file});
        return;

      case MimeType.IMAGE:
        emitter.emit(`push-${file.id}-image`);
        return;

      case MimeType.PDF:
        pushToScreen(componentId, Screens.PDF_READER, {file});
        return;

      case MimeType.VIDEO:
        pushToScreen(componentId, Screens.VIDEO_PLAYER, {file});
        return;

      default:
        pushToScreen(componentId, Screens.GENERIC_DETAILS, {file});
        return;
    }
  };

  const onLongPressSelect = async () => {
    if (selection.locked) {
      return;
    }

    await impactAsync(ImpactFeedbackStyle.Medium);
    const swap = !isSelected;
    setIsSelected(swap);

    if (swap) {
      addFileToSelection(file);
    } else {
      removeFileFromSelection(file.id);
    }
  };

  useEffect(() => {
    const onTyping = emitter.addListener(
      TypingEvent.IS_TYPING,
      (text: string) => {
        setShowSkeleton(true);
        searchTerm.current = text;
      },
    );

    const onEndTyping = emitter.addListener(TypingEvent.END_TYPING, () => {
      setShowSkeleton(false);
    });

    const favoriteFile = emitter.addListener(`favorite-${file.id}`, () => {
      setIsFavorite(s => !s);
    });

    return () => {
      onTyping.remove();
      onEndTyping.remove();
      favoriteFile.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unselect = emitter.addListener(
      `clear-selection-${folder?.id}`,
      () => {
        setIsSelected(false);
      },
    );

    return () => {
      unselect.remove();
    };
  }, [folder]);

  if (showSkeleton) {
    return (
      <View style={[styles.root, wrapperMargin]}>
        <FileSkeleton />
      </View>
    );
  }

  return (
    <Animated.View
      style={[styles.root, wrapperMargin]}
      exiting={FadeOut.duration(300)}>
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
          {searchTerm.current === '' ? (
            <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
              {file.name}
            </Text>
          ) : (
            <SearchableText
              text={file.name}
              searchTerm={searchTerm.current}
              style={styles.title}
              selectedColor={'#3366ff'}
            />
          )}
          <Text style={styles.subtitle}>
            {convertBytesToRedableUnit(file.size)}
          </Text>
        </View>
        <Pressable
          onPress={openMenu}
          hitSlop={25}
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
    </Animated.View>
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

export default React.memo(FileWrapper);
