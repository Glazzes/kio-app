import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native';
import React, {useState, useMemo, useEffect, useRef} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import Contributor from './Contributor';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Canvas, RoundedRect, Shadow} from '@shopify/react-native-skia';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type ShareModalProps = {};

const {width} = Dimensions.get('window');
const WIDTH = width * 0.85;

const photos = [
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/men/81.jpg',
  'https://randomuser.me/api/portraits/men/68.jpg',
];

function renderItem(info: ListRenderItemInfo<string>) {
  return <Contributor index={info.index} imageUrl={info.item} name={'glaze'} />;
}

function keyExtractor(item: string, index: number): string {
  return `${item}-${index}`;
}

const ShareModal: NavigationFunctionComponent<ShareModalProps> = ({
  componentId,
}) => {
  const inputRef = useRef<TextInput>(null);

  const [text, setText] = useState<string>('');
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [dimensions, setDimensions] = useState({width: 1, height: 0});
  const [isStyping, setIsStyping] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

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

  const onLayout = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    setDimensions({width: layout.width, height: layout.height});
  };

  const onChangeText = (value: string) => {
    setIsStyping(true);
    setText(value);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(_ => setIsStyping(false))
        .catch(() => console.log('sos'))
        .finally(() => setHasFetched(true));
    }, 1000);

    setTimer(newTimer);
  };

  const dissmis = () => {
    Navigation.dismissModal(componentId);
  };

  const scale = useSharedValue<number>(0);
  const rStyle = useAnimatedStyle(() => {
    return {transform: [{scale: scale.value}]};
  });

  useEffect(() => {
    scale.value = withDelay(
      100,
      withTiming(1, {easing: Easing.bezierFn(0.34, 1.56, 0.64, 1)}),
    );

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.modal, rStyle]} onLayout={onLayout}>
        {dimensions.width !== 1 && (
          <Canvas style={canvaStyles}>
            <RoundedRect
              x={10}
              y={10}
              width={dimensions.width}
              height={dimensions.height}
              r={10}
              color={'#fff'}>
              <Shadow blur={10} dx={10} dy={12} color={'rgba(0, 0, 0, 0.2)'} />
            </RoundedRect>
          </Canvas>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Share file</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-at'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              ref={inputRef}
              onChangeText={onChangeText}
              style={styles.input}
              placeholder={'Email / Username'}
            />
          </View>
          <Pressable style={styles.addButton}>
            <Text style={styles.buttonText}>Add</Text>
          </Pressable>
        </View>

        {isStyping && (
          <View style={styles.placeHolderContainer}>
            <SkeletonPlaceholder speed={1200}>
              <View style={{flexDirection: 'row'}}>
                <SkeletonPlaceholder.Item
                  width={50}
                  height={50}
                  borderRadius={25}
                />
                <View
                  style={{
                    height: 50,
                    justifyContent: 'space-around',
                    marginLeft: 10,
                  }}>
                  <SkeletonPlaceholder.Item
                    height={15}
                    width={width * 0.55}
                    borderRadius={5}
                  />
                  <SkeletonPlaceholder.Item
                    height={15}
                    width={width * 0.3}
                    borderRadius={5}
                  />
                </View>
              </View>
            </SkeletonPlaceholder>
          </View>
        )}

        {!isStyping && hasFetched && text !== '' && (
          <View style={styles.noResultContainer}>
            <Text>No results found for "{text}"</Text>
          </View>
        )}

        <Text style={styles.listHeader}>Will share with</Text>
        <View style={styles.listContainer}>
          <FlashList
            data={photos}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={50}
            estimatedListSize={{width: 50 * photos.length, height: 50}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{width: 10}} />}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={dissmis}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.confirmButton]}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

ShareModal.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: WIDTH,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  inputContainer: {
    height: 40,
    borderRadius: 5,
    flexDirection: 'row',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
    overflow: 'hidden',
  },
  icon: {
    marginLeft: 10,
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'Uber',
    backgroundColor: '#F3F3F4',
    color: '#C5C8D7',
  },
  addButton: {
    backgroundColor: '#3366ff',
    borderRadius: 5,
    height: 40,
    width: 60,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'UberBold',
    color: '#fff',
    textAlign: 'center',
  },
  placeHolderContainer: {
    marginVertical: 10,
  },
  noResultContainer: {
    marginVertical: 10,
    height: 50,
    justifyContent: 'center',
  },
  listHeader: {
    fontFamily: 'UberBold',
    fontSize: 12,
    marginTop: 10,
  },
  listContainer: {
    height: 50,
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: WIDTH / 2 - 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
  },
  confirmButton: {
    backgroundColor: '#3366ff',
  },
  confirmButtonText: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#EDF1F7',
  },
  cancelButtonText: {
    fontFamily: 'UberBold',
    color: '#c3c3c3',
  },
});

export default ShareModal;
