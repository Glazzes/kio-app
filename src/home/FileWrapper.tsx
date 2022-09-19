import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ViewStyle,
  Pressable,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  BounceIn,
  FadeIn,
  FadeOut,
  measure,
  runOnJS,
  runOnUI,
  useAnimatedRef,
  ZoomOut,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import {getPositionForMenu} from '../shared/functions/getPositionForMenu';
import {Modals} from '../navigation/Modals';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';

type FileWrapperProps = {
  index: number;
};

const {width} = Dimensions.get('window');

const SIZE = (width * 0.9 - 10) / 2;

const FileWrapper: React.FC<FileWrapperProps> = ({children, index}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const aref = useAnimatedRef();

  const showMenu = () => {
    runOnUI(() => {
      'worklet';
      const {
        width: iconWidth,
        height: iconHeight,
        pageX,
        pageY,
      } = measure(aref);
      const {x, y} = getPositionForMenu(
        iconWidth,
        iconHeight,
        pageX,
        pageY,
        185,
        390,
      );

      runOnJS(openMenu)(x, y);
    })();
  };

  const openMenu = (x: number, y: number) => {
    Navigation.showModal({
      component: {
        name: Modals.FILE_MENU,
        passProps: {x, y},
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
    }
  };

  const onLongPressSelect = async () => {
    await impactAsync(ImpactFeedbackStyle.Medium);
    setIsSelected(s => !s);
  };

  return (
    <View style={[styles.root, wrapperMargin]}>
      <Pressable onPress={onPress} onLongPress={onLongPressSelect}>
        {children}
        {isSelected && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={{
              width: SIZE,
              height: SIZE,
              position: 'absolute',
              backgroundColor: 'rgba(51, 102, 255, 0.2)',
              borderRadius: 5,
            }}
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
          onPress={showMenu}
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
