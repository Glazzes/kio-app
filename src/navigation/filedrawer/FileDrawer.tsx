/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Navigation,
  NavigationComponentListener,
  NavigationFunctionComponent,
} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import DrawerImageThumbnail from './DrawerImageThumbnail';
import {useSnapshot} from 'valtio';
import {navigationState} from '../../store/navigationStore';
import {convertBytesToRedableUnit} from '../../shared/functions/convertBytesToRedableUnit';
import authState from '../../store/authStore';
import {File} from '../../shared/types';
import {convertCurrentTimeToTextTime} from '../../audio_player/utils/functions/convertCurrentTimeToTextTime';
import Avatar from '../../misc/Avatar';
import {Screens} from '../../enums/screens';
import {axiosInstance} from '../../shared/requests/axiosInstance';
import {folderSizeUrl} from '../../shared/requests/contants';
import {mmkv} from '../../store/mmkv';
import emitter from '../../utils/emitter';

const CollapsableText: React.FC<{text: string}> = ({text}) => {
  return (
    <Text style={styles.data} ellipsizeMode={'tail'} numberOfLines={1}>
      {text}
    </Text>
  );
};

type FileDrawerProps = {
  file?: File;
};

const {width} = Dimensions.get('window');
const PREVIEW_SIZE = width * 0.75 - 15;

const FileDrawer: NavigationFunctionComponent<FileDrawerProps> = ({
  componentId,
  file,
}) => {
  const user = useSnapshot(authState.user);
  const {folders} = useSnapshot(navigationState);
  const last = folders[folders.length - 1];

  const [folderSize, setFolderSize] = useState<number>(1);

  useEffect(() => {
    const listener: NavigationComponentListener = {
      componentDidDisappear: _ => {
        Navigation.updateProps(Screens.FILE_DRAWER, {file: undefined});
        emitter.emit('show');
      },
      componentWillAppear: _ => {
        emitter.emit('hide');
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

  useEffect(() => {
    if (last) {
      const size = mmkv.getNumber(last.folder.id);
      if (size) {
        setFolderSize(size);
        return;
      }

      const uri = folderSizeUrl(last.folder.id);
      axiosInstance.get<number>(uri).then(({data}) => {
        setFolderSize(data);
        mmkv.set(last.folder.id, data);
      });
    }
  }, [last]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.name} numberOfLines={2} ellipsizeMode={'tail'}>
        {file ? file.name : last?.folder.name}
      </Text>
      <View style={styles.previewContainer}>
        {file ? (
          <DrawerImageThumbnail file={file} />
        ) : (
          <View style={styles.previewContainer}>
            <Icon name={'ios-folder-open'} color={'#3366ff'} size={100} />
          </View>
        )}
      </View>
      <Text style={styles.title}>Properties</Text>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Size</Text>
        <Text style={styles.data}>
          {file
            ? convertBytesToRedableUnit(file.size)
            : convertBytesToRedableUnit(folderSize)}
        </Text>
      </View>
      {file && (
        <View style={styles.textContainer}>
          <Text style={styles.item}>Type</Text>
          <Text style={styles.data}>{file.contentType}</Text>
        </View>
      )}
      {file?.details.dimensions && !file.contentType.endsWith('pdf') && (
        <View style={styles.textContainer}>
          <Text style={styles.item}>Dimensions</Text>
          <Text
            style={
              styles.data
            }>{`${file.details.dimensions[0]}x${file.details.dimensions[1]}`}</Text>
        </View>
      )}
      {file?.details.duration && (
        <View style={styles.textContainer}>
          <Text style={styles.item}>Duration</Text>
          <Text style={styles.data}>
            {convertCurrentTimeToTextTime(file?.details.duration ?? 0)}
          </Text>
        </View>
      )}
      {file?.details.pages && (
        <View style={styles.textContainer}>
          <Text style={styles.item}>Pages</Text>
          <Text style={styles.data}>{file?.details.pages}</Text>
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.item}>Created</Text>
        <Text style={styles.data}>
          {file ? file?.createdAt : last?.folder.createdAt}
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Modified</Text>
        <Text style={styles.data}>
          {file ? file?.lastModified : last?.folder.lastModified}
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Visibility</Text>
        <Text style={styles.data}>Public</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Location</Text>
        <View style={styles.ownerContainer}>
          <Icon
            name={'ios-folder-open'}
            size={35}
            color={'#354259'}
            style={styles.margin}
          />
          <CollapsableText
            text={
              folders[folders.length - 1]
                ? folders[folders.length - 1].folder.name
                : 'Root folder'
            }
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.item}>Owner</Text>
        <View style={styles.ownerContainer}>
          <Avatar username={user.username} size={35} />
          <CollapsableText
            text={file?.ownerId === user.id ? 'You' : user.username}
          />
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
  margin: {
    marginRight: 10,
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
