/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  Navigation,
  NavigationComponentListener,
  NavigationFunctionComponent,
} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DrawerImageThumbnail from './DrawerImageThumbnail';
import {useSnapshot} from 'valtio';
import {navigationState, popFile} from '../../store/navigationStore';
import {convertBytesToRedableUnit} from '../../shared/functions/convertBytesToRedableUnit';
import authState from '../../store/authStore';

const CollapsableText: React.FC<{text: string}> = ({text}) => {
  return (
    <Text style={styles.data} ellipsizeMode={'tail'} numberOfLines={1}>
      {text}
    </Text>
  );
};

const {width} = Dimensions.get('window');
const PREVIEW_SIZE = width * 0.75 - 15;

const FileDrawer: NavigationFunctionComponent = ({componentId}) => {
  const snap = useSnapshot(navigationState);
  const authSnap = useSnapshot(authState);

  useEffect(() => {
    const listener: NavigationComponentListener = {
      componentDidDisappear: e => {
        popFile();
      },
    };

    const s = Navigation.events().registerComponentListener(
      listener,
      componentId,
    );

    return () => {
      s.remove();
    };
  }, []);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.name}>
        {snap.file ? snap.file.name : 'Last folder name'}
      </Text>
      <View style={styles.previewContainer}>
        <DrawerImageThumbnail
          contentType="image"
          uri={'https://wallpaperaccess.com/full/4339739.jpg'}
          dimensions={{width: 1080, height: 1920}}
        />
      </View>
      <Text style={styles.title}>Properties</Text>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Size</Text>
        <Text style={styles.data}>
          {snap.file ? convertBytesToRedableUnit(snap.file!!.size) : '1MB'}
        </Text>
      </View>
      {snap.file && (
        <View style={styles.textContainer}>
          <Text style={styles.item}>Type</Text>
          <Text style={styles.data}>{snap.file.contentType}</Text>
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.item}>Dimensions</Text>
        <Text style={styles.data}>1334x1817</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Created</Text>
        <Text style={styles.data}>{snap.file?.createdAt}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Modified</Text>
        <Text style={styles.data}>{snap.file?.lastModified}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Visibility</Text>
        <Text style={styles.data}>Public</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Location</Text>
        <View style={styles.ownerContainer}>
          <Icon
            name={'folder'}
            size={35}
            color={'#354259'}
            style={{marginRight: 10}}
          />
          <CollapsableText text="Pictures" />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Owner</Text>
        <View style={styles.ownerContainer}>
          <Image
            source={{uri: 'file:///storage/sdcard0/Descargas/glaceon.jpg'}}
            style={styles.avatar}
          />
          <CollapsableText text={authSnap.user.username} />
        </View>
      </View>
    </ScrollView>
  );
};

FileDrawer.options = {
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
    backgroundColor: '#fff',
  },
  content: {
    padding: 15,
  },
  name: {
    fontSize: 15,
    fontFamily: 'UberBold',
    // fontWeight: 'bold',
    color: '#354259',
    marginBottom: 10,
  },
  previewContainer: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    height: PREVIEW_SIZE,
    width: (1000 / 1500) * PREVIEW_SIZE,
    borderRadius: 5,
  },
  textContainer: {
    flexDirection: 'row',
    paddingVertical: 3,
    alignItems: 'center',
  },
  item: {
    flex: 0.7,
    fontWeight: '600',
    color: '#748DA6',
    fontFamily: 'Uber',
  },
  data: {
    fontFamily: 'Uber',
    color: '#354259',
    flex: 1,
  },
  ownerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    fontFamily: 'UberBold',
    color: '#354259',
  },
  contributor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  contiburtorAvatar: {
    alignSelf: 'flex-end',
  },
});

export default FileDrawer;
