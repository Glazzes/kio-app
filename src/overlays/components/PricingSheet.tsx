import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import React, {useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {snapPoint} from 'react-native-redash';
import Icon from 'react-native-vector-icons/Ionicons';
import {clamp} from '../../shared/functions/animations/clamp';
import Button from '../../shared/components/Button';
import {PricingPlan} from '../../shared/enums';
import {updatePlan} from '../utils/updatePlan';
import {
  displayToast,
  genericErrorMessage,
  storagePlanUpdatedMessage,
} from '../../shared/toast';
import {emitUpdatedStorage} from '../../shared/emitter';

type PricingSheetProps = {};

type Plan = {
  name: string;
  price: number;
  message: string;
  isPopular: boolean;
};

const {width, height} = Dimensions.get('window');

const plans: Plan[] = [
  {
    name: PricingPlan.BASIC,
    price: 0,
    message: '1Gb free of storage',
    isPopular: false,
  },
  {
    name: PricingPlan.PRO,
    price: 9.99,
    message: '5Gb storage, cancel at anytime',
    isPopular: true,
  },
  {
    name: PricingPlan.PREMIUM,
    price: 14.99,
    message: '10Gb storage, cancel at anytime',
    isPopular: false,
  },
];

const PricingSheet: NavigationFunctionComponent<PricingSheetProps> = ({
  componentId,
}) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [sheetHeight, setsheetHeight] = useState<number>(0);
  const [plan, setPlan] = useState<'Basic' | 'Pro' | 'Premium'>('Basic');

  const onLayout = ({
    nativeEvent: {
      layout: {height: h},
    },
  }: LayoutChangeEvent) => {
    setsheetHeight(h);
    backgroundColor.value = withTiming('rgba(0, 0, 0, 0.3)');
    translateY.value = withTiming(-1 * h);
  };

  const dissmis = () => {
    Navigation.dismissModal(componentId);
  };

  const backgroundColor = useSharedValue<string>('transparent');
  const translateY = useSharedValue<number>(0);
  const offsetY = useSharedValue<number>(0);

  const changePlan = () => {
    setIsUpdating(true);
    updatePlan(plan.toUpperCase())
      .then(({data}) => {
        const message = storagePlanUpdatedMessage(plan);
        displayToast(message);
        emitUpdatedStorage(data);

        translateY.value = withTiming(0, undefined, finished => {
          if (finished) {
            runOnJS(dissmis)();
          }
        });
      })
      .catch(_ => {
        displayToast(genericErrorMessage);
      })
      .finally(() => setIsUpdating(false));
  };

  const translation = useDerivedValue(() => {
    return clamp(translateY.value, -sheetHeight, 0);
  }, [translateY, sheetHeight]);

  const pan = Gesture.Pan()
    .onStart(_ => {
      offsetY.value = translation.value;
    })
    .onChange(e => {
      translateY.value = e.translationY + offsetY.value;
    })
    .onEnd(({velocityY}) => {
      const snap = snapPoint(translateY.value, velocityY, [-sheetHeight, 0]);
      if (snap === 0) {
        backgroundColor.value = withTiming(
          'transparent',
          undefined,
          finished => {
            if (finished) {
              runOnJS(dissmis)();
            }
          },
        );

        translateY.value = withTiming(0);
      }

      translateY.value = withTiming(snap);
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translation.value}],
    };
  });

  const rContainerStyles = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  return (
    <Animated.View style={[styles.root, rContainerStyles]}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.sheet, rStyle]} onLayout={onLayout}>
          <Text style={styles.title}>Choose your plan</Text>
          {plans.map((p, index) => {
            return (
              <Pressable
                onPress={() => setPlan(p.name as any)}
                style={[
                  styles.plan,
                  plan === p.name ? styles.activePlan : styles.inactivePlan,
                ]}
                key={`${p.name}-${index}`}>
                <View style={styles.planTitleContainer}>
                  <View style={styles.infoContainer}>
                    {plan === p.name ? (
                      <Icon
                        name={'ios-checkmark-circle'}
                        size={22}
                        color={'#3366ff'}
                        style={styles.icon}
                      />
                    ) : (
                      <View style={[styles.iconPlaceHolder, styles.icon]} />
                    )}

                    <Text style={styles.planName}>{p.name}</Text>
                  </View>
                  <Text style={styles.pricing}>
                    $
                    <Text
                      style={[
                        styles.price,
                        p.name === plan ? styles.activePricing : undefined,
                      ]}>
                      {p.price}
                    </Text>
                    /month
                  </Text>
                </View>

                <View style={styles.secondaryInfoContainer}>
                  <Text style={styles.freeTime}>Free for 30 days</Text>
                  {p.isPopular && <Text style={styles.popular}>Popular</Text>}
                </View>

                <Text style={styles.message}>{p.message}</Text>
              </Pressable>
            );
          })}
          <Button
            text={'Confirm'}
            width={width * 0.9}
            disabled={isUpdating}
            onPress={changePlan as any}
            extraStyle={styles.button}
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    top: height,
    backgroundColor: '#fff',
    width,
    paddingVertical: 10,
    paddingHorizontal: width * 0.05,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 15,
    marginVertical: 10,
  },
  plan: {
    width: width * 0.9,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  activePlan: {
    borderWidth: 1,
    borderColor: '#3366ff',
  },
  inactivePlan: {
    borderWidth: 1,
    borderColor: '#afb3b1',
  },
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceHolder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#afb3b1',
  },
  icon: {
    marginRight: 10,
  },
  planName: {
    textTransform: 'capitalize',
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 15,
  },
  pricing: {
    fontFamily: 'UberBold',
  },
  price: {
    fontFamily: 'UberBold',
    fontSize: 15,
  },
  activePricing: {
    color: '#000',
  },
  secondaryInfoContainer: {
    flexDirection: 'row',

    marginVertical: 5,
  },
  freeTime: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#daeee3',
    color: '#78c29c',
    fontFamily: 'UberBold',
    marginRight: 5,
  },
  popular: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#e4e7fd',
    color: '#3366ff',
    fontFamily: 'UberBold',
  },
  message: {
    fontFamily: 'UberBold',
  },
  button: {
    marginTop: 10,
  },
});

export default PricingSheet;
