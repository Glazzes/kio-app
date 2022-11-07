import {View, Text, Dimensions, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useContext} from 'react';
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

type FolderProps = {
  folder: FolderType;
};

const {width} = Dimensions.get('window');
const WIDTH = width * 0.75;
const HEIGHT = 150;

const Folder: React.FC<FolderProps> = ({folder}) => {
  const {componentId} = useContext(NavigationContext);

  const pushFolder = () => {
    Navigation.push(componentId, {
      component: {
        name: Screens.MY_UNIT,
        passProps: {
          folder,
        },
      },
    });
  };

  const onPress = () => {
    Navigation.showModal({
      component: {
        name: Modals.FILE_MENU,
      },
    });
  };

  return (
    <Pressable style={styles.container} onPress={pushFolder}>
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
        <Icon name="folder" color={'#fff'} size={40} />
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
          <Icon color={'#fff'} name={'dots-vertical'} size={25} />
        </Pressable>
      </View>

      {folder.summary.files === 0 && folder.summary.folders === 0 ? (
        <View style={styles.itemContainer}>
          <Text style={styles.itemSubtitle}>Currently empty</Text>
        </View>
      ) : (
        <View style={styles.itemContainer}>
          <Text style={styles.itemSubtitle}>
            <Text style={styles.itemText}>20</Text> folders and{' '}
          </Text>
          <Text style={styles.itemSubtitle}>
            <Text style={styles.itemText}>50</Text> files
          </Text>
        </View>
      )}
      <View style={styles.created}>
        <Text style={styles.itemSubtitle}>
          Created: <Text style={styles.itemText}>{folder.createdAt}</Text>
        </Text>
      </View>
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
});

export default React.memo(Folder);
