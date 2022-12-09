import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Screens} from '../../../enums/screens';
import {Modals} from '../../../navigation/screens/modals';
import {logout} from '../../../shared/requests/functions/logout';

type UserMenuProps = {
  x: number;
  y: number;
  parentComponentId: string;
};

const PADDING = 10;
const COLOR = '#000';
const MENU_WIDTH = 215;

const UserMenu: NavigationFunctionComponent<UserMenuProps> = ({
  componentId,
  x,
  y,
  parentComponentId,
}) => {
  const [dimensions, setDimensions] = useState({width: 1, height: 1});

  const canvaStyles: ViewStyle = useMemo(
    () => ({
      width: dimensions.width + 60,
      height: dimensions.height + 60,
      position: 'absolute',
      transform: [{translateX: -10}, {translateY: -10}],
      backgroundColor: '#fff',
    }),
    [dimensions],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const {width: w, height: h} = e.nativeEvent.layout;
    setDimensions({width: w, height: h});
  };

  const logoutWrapper = () => {
    Navigation.dismissModal(componentId);
    logout();
  };

  const close = () => {
    Navigation.dismissModal(componentId);
  };

  const showPricingSheet = () => {
    Navigation.dismissModal(componentId);
    Navigation.showModal({
      component: {
        name: Modals.PRICING,
      },
    });
  };

  const pushToUserProfile = () => {
    Navigation.push(parentComponentId, {
      component: {
        name: Screens.SETTINGS,
      },
    });

    Navigation.dismissModal(componentId);
  };

  const scale = useSharedValue<number>(0);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  useEffect(() => {
    scale.value = withDelay(
      200,
      withTiming(1, {
        duration: 300,
        easing: Easing.bezierFn(0.34, 1.56, 0.64, 1), // https://easings.net/#easeOutBack
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Pressable style={styles.root} onPress={close}>
      <Animated.View
        style={[
          rStyle,
          styles.menu,
          {position: 'absolute', top: y, left: x - MENU_WIDTH},
        ]}
        onLayout={onLayout}>
        {dimensions.width !== 1 && (
          <Canvas style={canvaStyles}>
            <RoundedRect
              x={10}
              y={10}
              width={dimensions.width}
              height={dimensions.height}
              r={10}
              color={'#fff'}>
              <Shadow blur={15} dx={15} dy={15} color={'rgba(0, 0, 0, 0.2)'} />
            </RoundedRect>
          </Canvas>
        )}

        <View style={styles.notificationContainer}>
          <View style={styles.action}>
            <Icon name={'ios-notifications-outline'} size={20} color={COLOR} />
            <Text style={styles.actionText}>Notifications</Text>
          </View>
          <Animated.View style={styles.indicator} />
        </View>

        <Pressable style={styles.action} onPress={pushToUserProfile}>
          <Icon name={'ios-options'} size={20} color={COLOR} />
          <Text style={styles.actionText}>Settings</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={showPricingSheet}>
          <Text style={styles.buttonText}>Buy storage</Text>
        </Pressable>

        <Pressable style={styles.action} onPress={logoutWrapper}>
          <Icon name={'ios-exit-outline'} size={20} color={COLOR} />
          <Text style={styles.actionText}>Log out</Text>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  menu: {
    paddingVertical: 5,
    width: MENU_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  canvas: {
    position: 'absolute',
  },
  notificationContainer: {
    width: MENU_WIDTH - 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PADDING,
  },
  actionText: {
    marginLeft: 20,
    fontFamily: 'Uber',
    color: COLOR,
  },
  button: {
    marginLeft: 10,
    width: MENU_WIDTH - 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#3366ff',
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Uber',
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#3366ff',
    alignSelf: 'center',
  },
});

export default UserMenu;
