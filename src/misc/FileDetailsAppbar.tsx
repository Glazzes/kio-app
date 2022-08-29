import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import emitter from '../utils/emitter';

type FileDetailsAppbarProps = {
  parentComponentId: string;
};

const {width} = Dimensions.get('window');
const {statusBarHeight} = Navigation.constantsSync();

const FileDetailsAppbar: React.FC<FileDetailsAppbarProps> = ({
  parentComponentId,
}) => {
  const isHidden = useRef(false);
  const translateY = useSharedValue<number>(0);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  useEffect(() => {
    const listener = emitter.addListener('st', () => {
      translateY.value = withTiming(
        isHidden.current ? 0 : -statusBarHeight * 3,
      );

      Navigation.mergeOptions(parentComponentId, {
        statusBar: {
          visible: isHidden.current,
        },
      });

      isHidden.current = !isHidden.current;
    });

    return () => {
      listener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.root, rStyle]}>
      <View style={styles.infoContainer}>
        <Icon
          name={'chevron-left'}
          size={25}
          color={'#fff'}
          style={styles.icon}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
            Super_ULtra-EPIC_PPUPYHuksy.png
          </Text>
        </View>
      </View>
      <View style={styles.leftContainer}>
        <Icon
          name={'picture-in-picture-top-right'}
          size={25}
          color={'#fff'}
          style={styles.pictureInPicture}
        />
        <Icon name={'dots-vertical'} size={25} color={'#fff'} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height: statusBarHeight * 3,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingTop: statusBarHeight,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  icon: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 20,
  },
  title: {
    color: '#fff',
    fontFamily: 'Uber',
    fontSize: 17,
    marginLeft: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pictureInPicture: {
    marginRight: 10,
  },
});

export default FileDetailsAppbar;
