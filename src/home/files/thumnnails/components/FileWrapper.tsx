import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ViewStyle,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  BounceIn,
  FadeIn,
  FadeOut,
  ZoomOut,
} from 'react-native-reanimated';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import {NavigationContext} from '../../../../navigation/components/NavigationContextProvider';
import emitter, {
  emitPushToImageDetails,
  getClearSelectionEventName,
  getFavoriteEventName,
  getTextSearchEndTypingEventName,
  getTextSearchEventName,
} from '../../../../shared/emitter';
import {getSimpleMimeType} from '../../../../shared/functions/getMimeType';
import {MimeType} from '../../../../shared/enum/MimeType';
import {pushToScreen} from '../../../../navigation/functionts/pushToScreen';
import {Screens} from '../../../../enums/screens';
import {convertBytesToRedableUnit} from '../../../../shared/functions/convertBytesToRedableUnit';
import FileSkeleton from './FileSkeleton';
import {File} from '../../../../shared/types';
import SearchableText from '../../../../misc/SearchableText';
import {
  addFileToSelection,
  fileSelectionState,
  removeFileFromSelection,
  updateSourceSelection,
} from '../../../../store/fileSelection';
import {useSnapshot} from 'valtio';
import {displayFileOptions} from '../../../../navigation/functionts/displayFileOptions';

type FileWrapperProps = {
  index: number;
  file: File;
  searchTerm: string;
};

const {width} = Dimensions.get('window');

const SIZE = (width * 0.9 - 10) / 2;

const FileWrapper: React.FC<FileWrapperProps> = ({
  children,
  index,
  file,
  searchTerm,
}) => {
  const selection = useSnapshot(fileSelectionState);
  const {componentId, folder} = useContext(NavigationContext);

  const [isFavorite, setIsFavorite] = useState<boolean>(file.isFavorite);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

  const wrapperMargin: ViewStyle = {
    marginLeft: index % 2 === 0 ? width * 0.05 : 10,
  };

  const openMenu = async () => {
    if (folder && !selection.inProgress) {
      displayFileOptions({
        file,
        parentFolderId: folder.id,
        previousComponentId: componentId,
        isModal: false,
        fromDetails: false,
      });
    }
  };

  const onPress = () => {
    if (selection.inProgress) {
      if (isSelected) {
        removeFileFromSelection(file.id);
      } else {
        updateSourceSelection(folder?.id!!);
        addFileToSelection(file);
      }

      setIsSelected(s => !s);
      return;
    }

    const mimeType = getSimpleMimeType(file.contentType);
    switch (mimeType) {
      case MimeType.AUDIO:
        file.isFavorite = isFavorite;
        pushToScreen(componentId, Screens.AUDIO_PLAYER, {file});
        return;

      case MimeType.IMAGE:
        emitPushToImageDetails(file.id);
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
      updateSourceSelection(folder?.id!!);
      addFileToSelection(file);
    } else {
      removeFileFromSelection(file.id);
    }
  };

  useEffect(() => {
    /*
    const cleanTextSearchEventName = getClenTextSearchEventName(
      folder?.id ?? '',
    );
    const clean = emitter.addListener(cleanTextSearchEventName, () => {
      setSearchTerm('');
    })
    */

    const textSearchEventName = getTextSearchEventName(folder?.id ?? '');
    const onTyping = emitter.addListener(textSearchEventName, (_: string) => {
      setShowSkeleton(true);
      // setSearchTerm(text);
    });

    const textSearchEndTypingEventName = getTextSearchEndTypingEventName(
      folder?.id ?? '',
    );
    const onEndTyping = emitter.addListener(
      textSearchEndTypingEventName,
      () => {
        setShowSkeleton(false);
      },
    );

    const favoriteEventName = getFavoriteEventName(file.id);
    const favoriteFile = emitter.addListener(favoriteEventName, () => {
      setIsFavorite(s => !s);
    });

    return () => {
      onTyping.remove();
      onEndTyping.remove();
      favoriteFile.remove();
      // clean.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, file]);

  useEffect(() => {
    const unselectEventName = getClearSelectionEventName(folder?.id!!);
    const unselect = emitter.addListener(unselectEventName, () => {
      setIsSelected(false);
    });

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
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={styles.selected}
          />
        )}
      </Pressable>
      <View style={styles.infoContainer}>
        <View style={styles.flex}>
          {searchTerm === '' ? (
            <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
              {file.name}
            </Text>
          ) : (
            <SearchableText
              text={file.name}
              searchTerm={searchTerm}
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
