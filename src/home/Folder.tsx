import {View, Text, Dimensions, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useEffect, useState} from 'react';
import AvatarGroup from '../misc/AvatarGroup';
import {ShadowView} from '@dimaportenko/react-native-shadow-view';
import OptionsMenu from '../misc/OptionsMenu';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
} from 'react-native-reanimated';
import emitter from '../utils/emitter';

type FolderProps = {};

const {width} = Dimensions.get('window');

const Folder: React.FC<FolderProps> = ({}) => {
  const containerRef = useAnimatedRef<View>();
  const iconRef = useAnimatedRef<Icon>();

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [position, setPosition] = useState<{
    cx: number;
    cy: number;
    ix: number;
    iy: number;
  }>({
    cx: 0,
    cy: 0,
    ix: 0,
    iy: 0,
  });

  const toggleMenu = async (cx: number, cy: number, ix: number, iy: number) => {
    await impactAsync(ImpactFeedbackStyle.Medium);
    setPosition({cx, cy, ix, iy});
    setShowMenu(s => !s);
  };

  const tap = Gesture.Tap().onStart(_ => {
    const {pageX: cx, pageY: cy} = measure(containerRef);
    const {pageX: ix, pageY: iy} = measure(iconRef);
    runOnJS(toggleMenu)(cx, cy, ix, iy);
  });

  useEffect(() => {
    const listener = emitter.addListener('close.options.menu', () => {
      setShowMenu(false);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <View ref={containerRef} collapsable={false}>
      <ShadowView style={styles.root}>
        <View style={styles.topContainer}>
          <View style={styles.iconContainer}>
            <Icon name="folder" color={'#fff'} size={40} />
          </View>
          <AvatarGroup photos={[]} />
        </View>
        <View style={styles.titleContainer}>
          <Text
            style={styles.folderName}
            ellipsizeMode={'tail'}
            numberOfLines={2}>
            My Developments
          </Text>
          <GestureDetector gesture={tap}>
            <Animated.View style={styles.iconContainer}>
              <Icon
                color={'#fff'}
                name={'dots-vertical'}
                size={25}
                style={styles.icon}
                ref={iconRef}
              />
            </Animated.View>
          </GestureDetector>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemSubtitle}>
            <Text style={styles.itemText}>20</Text> folders and{' '}
          </Text>
          <Text style={styles.itemSubtitle}>
            <Text style={styles.itemText}>50</Text> files
          </Text>
        </View>
        <Text style={styles.itemSubtitle}>
          Created: <Text style={styles.itemText}>20th October, 2022</Text>
        </Text>
      </ShadowView>
      {showMenu && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {backgroundColor: 'rgba(0, 0, 0, 0.3)'},
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: width * 0.75,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
    elevation: 1,
    backgroundColor: '#3366ff',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    overflow: 'visible',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  folderName: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'UberBold',
  },
  icon: {
    marginLeft: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default React.memo(Folder);
