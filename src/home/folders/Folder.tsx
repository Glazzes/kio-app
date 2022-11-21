import {View, Text, Dimensions, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useContext, useEffect, useState} from 'react';
import {
  BlurMask,
  Canvas,
  LinearGradient,
  RoundedRect,
  vec,
} from '@shopify/react-native-skia';
import AvatarGroup from './AvatarGroup';
import {Navigation} from 'react-native-navigation';
import {Modals} from '../../navigation/screens/modals';
import {NavigationContext} from '../../navigation/NavigationContextProvider';
import {Screens} from '../../enums/screens';
import {Folder as FolderType} from '../../shared/types';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import emitter from '../../utils/emitter';
import {
  addFolderToSelection,
  fileSelectionState,
  removeFolderFromSelection,
  updateSourceSelection,
} from '../../store/fileSelection';
import {useSnapshot} from 'valtio';

type FolderProps = {
  folder: FolderType;
};

const {width} = Dimensions.get('window');
const WIDTH = width * 0.75;
const HEIGHT = 150;

const Folder: React.FC<FolderProps> = ({folder}) => {
  const selection = useSnapshot(fileSelectionState);
  const {componentId, folder: parentFolder} = useContext(NavigationContext);
  const [isSelected, setisSelected] = useState<boolean>(false);

  const pushFolder = () => {
    if (selection.inProgress) {
      if (isSelected) {
        removeFolderFromSelection(folder.id);
      } else {
        updateSourceSelection(parentFolder?.id);
        addFolderToSelection(folder);
      }

      setisSelected(t => !t);
    }

    if (!isSelected && !selection.inProgress) {
      Navigation.push(componentId, {
        component: {
          name: Screens.MY_UNIT,
          passProps: {
            folder,
          },
        },
      });
    }
  };

  const onLongPress = () => {
    if (selection.locked) {
      return;
    }

    if (isSelected) {
      removeFolderFromSelection(folder.id);
    } else {
      updateSourceSelection(parentFolder?.id);
      addFolderToSelection(folder);
    }

    setisSelected(t => !t);
    impactAsync(ImpactFeedbackStyle.Medium);
  };

  const onPress = () => {
    Navigation.showOverlay({
      component: {
        name: Modals.FILE_MENU,
        passProps: {
          parentFolderId: parentFolder?.id,
          file: folder,
        },
      },
    });
  };

  useEffect(() => {
    const unselect = emitter.addListener(
      `clear-selection-${parentFolder?.id}`,
      () => {
        setisSelected(false);
      },
    );

    return () => {
      unselect.remove();
    };
  }, [parentFolder]);

  return (
    <Pressable
      style={styles.container}
      onPress={pushFolder}
      onLongPress={onLongPress}>
      <Canvas style={styles.canvas}>
        <RoundedRect
          y={HEIGHT * 0.53}
          x={(WIDTH * 0.25) / 2}
          width={WIDTH * 0.75}
          height={55}
          color={'#0b4199'}>
          <BlurMask blur={18} style={'normal'} />
        </RoundedRect>
        <RoundedRect x={0} y={0} width={WIDTH} height={HEIGHT} r={5}>
          <LinearGradient
            colors={['#0b4199', '#3366ff']}
            start={vec(0, 0)}
            end={vec(WIDTH, HEIGHT)}
          />
        </RoundedRect>
      </Canvas>

      <View style={styles.decorationContainer}>
        <Icon name="ios-folder-open" color={'#fff'} size={40} />
        <AvatarGroup photos={[]} />
      </View>

      <View style={styles.titleContainer}>
        <Text
          style={styles.folderName}
          ellipsizeMode={'tail'}
          numberOfLines={2}>
          {folder.name}
        </Text>
        <Pressable hitSlop={20} onPress={onPress}>
          <Icon color={'#fff'} name={'ellipsis-vertical'} size={22} />
        </Pressable>
      </View>

      {folder.summary.files === 0 && folder.summary.folders === 0 ? (
        <View style={styles.itemContainer}>
          <Text style={styles.itemSubtitle}>Currently empty</Text>
        </View>
      ) : (
        <View style={styles.itemContainer}>
          {folder.summary.folders > 0 && (
            <Text style={styles.itemSubtitle}>
              <Text style={styles.itemText}>{folder.summary.folders}</Text>{' '}
              folders and{' '}
            </Text>
          )}
          {folder.summary.files > 0 && (
            <Text style={styles.itemSubtitle}>
              <Text style={styles.itemSubtitle}>
                <Text style={styles.itemText}>{folder.summary.files} </Text>
                file{folder.summary.files > 1 ? 's' : ''}
              </Text>
            </Text>
          )}
        </View>
      )}
      <View style={styles.created}>
        <Text style={styles.itemSubtitle}>
          Created: <Text style={styles.itemText}>{folder.createdAt}</Text>
        </Text>
      </View>

      {isSelected && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.selected}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
  },
  canvas: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT + 40,
  },
  decorationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  folderName: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'UberBold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  created: {
    paddingHorizontal: 10,
  },
  itemSubtitle: {
    fontFamily: 'UberBold',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  itemText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Uber',
    fontSize: 12,
  },
  selected: {
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
    backgroundColor: 'rgba(51, 102, 255, 0.45)',
    borderRadius: 5,
  },
});

export default React.memo(Folder);
