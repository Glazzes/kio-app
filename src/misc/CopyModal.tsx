import {
  Text,
  Dimensions,
  StyleSheet,
  LayoutChangeEvent,
  View,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import emitter from '../utils/emitter';
import {Screens} from '../enums/screens';
import {Event} from '../enums/events';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalWrapper from '../shared/components/ModalWrapper';
import {
  clearSelection,
  fileSelectionState,
  toggleSelectionLock,
} from '../store/fileSelection';
import {useSnapshot} from 'valtio';
import {navigationState} from '../store/navigationStore';

type CopyModalProps = {};

const {width} = Dimensions.get('window');

const CopyModal: NavigationFunctionComponent<CopyModalProps> = ({
  componentId,
}) => {
  const navigation = useSnapshot(navigationState);
  const selection = useSnapshot(fileSelectionState);
  const [dimensions, setdimensions] = useState({width: 1, height: 1});

  const onLayout = ({
    nativeEvent: {
      layout: {height: h, width: w},
    },
  }: LayoutChangeEvent) => {
    setdimensions({width: w, height: h});
  };

  const dissmis = () => {
    emitter.emit(Event.FAB_MOVE_DOWN);
    Navigation.dismissOverlay(componentId);
  };

  const dissmisSelection = () => {
    clearSelection();
    toggleSelectionLock();

    translateY.value = withTiming(100, undefined, finished => {
      if (finished) {
        runOnJS(dissmis)();
      }
    });
  };

  const translateY = useSharedValue<number>(100);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  useEffect(() => {
    translateY.value = withTiming(0);

    const show = emitter.addListener('show', () => {
      translateY.value = withTiming(0);
    });

    const hide = emitter.addListener('hide', () => {
      translateY.value = withTiming(100);
    });

    return () => {
      show.remove();
      hide.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    emitter.emit(Event.FAB_MOVE_UP, dimensions.height + 10);

    const listener = Navigation.events().registerComponentDidAppearListener(
      e => {
        if (e.componentName === Screens.MY_UNIT) {
          emitter.emit(Event.FAB_MOVE_UP, dimensions.height + 10);
        }
      },
    );

    return () => {
      listener.remove();
    };
  }, [dimensions.height]);

  return (
    <Animated.View style={[styles.root, rStyle]} onLayout={onLayout}>
      <ModalWrapper witdh={width * 0.9}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View>
            <Text style={styles.title}>
              Paste in{' '}
              {`"${navigation.folders[navigation.folders.length - 1].name}"`}
            </Text>
            <Text style={styles.subtitle}>{selection.files.length} files</Text>
          </View>
          <View style={styles.row}>
            <Pressable onPress={dissmisSelection}>
              <Icon
                name={'ios-close-circle-outline'}
                size={30}
                color={'#C5C8D7'}
                style={styles.icon}
              />
            </Pressable>
            <Icon
              name={'ios-checkmark-circle-outline'}
              size={30}
              color={'#3366ff'}
            />
          </View>
        </View>
      </ModalWrapper>
    </Animated.View>
  );
};

CopyModal.options = {
  statusBar: {
    visible: true,
  },
  overlay: {
    interceptTouchOutside: false,
  },
};

const styles = StyleSheet.create({
  root: {
    width: width * 0.9,
    position: 'absolute',
    bottom: width * 0.05,
    marginHorizontal: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
  },
  subtitle: {
    fontFamily: 'UberBold',
    fontSize: 12,
  },
});

export default CopyModal;
