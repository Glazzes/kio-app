import {View, Text, Dimensions, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {BlurMask, Canvas, RoundedRect} from '@shopify/react-native-skia';
import AvatarGroup from '../../misc/AvatarGroup';

type FolderProps = {};

const {width} = Dimensions.get('window');
const WIDTH = width * 0.75;
const HEIGHT = 150;

const Folder: React.FC<FolderProps> = ({}) => {
  return (
    <View style={styles.root}>
      <Canvas style={styles.canvas}>
        <RoundedRect
          y={HEIGHT * 0.53}
          x={(WIDTH * 0.25) / 2}
          width={WIDTH * 0.75}
          height={52}
          color={'#0b4199'}>
          <BlurMask blur={18} style={'normal'} />
        </RoundedRect>
        <RoundedRect
          x={0}
          y={0}
          width={WIDTH}
          height={HEIGHT}
          r={5}
          color={'#3366ff'}
        />
      </Canvas>
      <View style={styles.container}>
        <View style={styles.decorationContainer}>
          <Icon name="folder" color={'#fff'} size={40} />
          <AvatarGroup photos={[]} />
        </View>
        <View style={styles.titleContainer}>
          <Text
            style={styles.folderName}
            ellipsizeMode={'tail'}
            numberOfLines={2}>
            My Developments
          </Text>

          <Icon color={'#fff'} name={'dots-vertical'} size={25} />
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemSubtitle}>
            <Text style={styles.itemText}>20</Text> folders and{' '}
          </Text>
          <Text style={styles.itemSubtitle}>
            <Text style={styles.itemText}>50</Text> files
          </Text>
        </View>
        <View style={styles.created}>
          <Text style={styles.itemSubtitle}>
            Created: <Text style={styles.itemText}>20th October, 2022</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: WIDTH,
    height: HEIGHT + 30,
  },
  canvas: {
    width: WIDTH,
    height: HEIGHT + 30,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  container: {
    width: WIDTH,
    height: HEIGHT,
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
});

export default React.memo(Folder);