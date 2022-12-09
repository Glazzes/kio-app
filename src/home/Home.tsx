/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Dimensions, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import AppHeader from './header/components/AppHeader';
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
} from '@shopify/flash-list';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Appbar from './header/components/Appbar';
import FAB from './misc/filefab/FAB';
import {Dimension, File, Folder, Page} from '../shared/types';
import FileWrapper from './files/thumnnails/components/FileWrapper';
import {
  ImageThumbnail,
  PinchableReflection,
  VideoThumbnail,
} from './files/thumnnails';
import AudioThumbnail from './files/thumnnails/components/AudioThumbnail';
import PdfThumnail from './files/thumnnails/components/PdfThumnail';
import {NavigationContextProvider} from '../navigation';
import NoContent from './misc/NoContent';
import GenericThumbnail from './files/thumnnails/components/GenericThumbnail';
import {getSimpleMimeType} from '../shared/functions/getMimeType';
import {MimeType} from '../shared/enum/MimeType';
import RNBootSplash from 'react-native-bootsplash';
import {SIZE} from './utils/constants';
import emitter, {
  getClenTextSearchEventName,
  getFolderAddFilesEventName,
  getFolderAddFoldersEventName,
  getFolderDeleteFilesEventName,
  getFolderDeleteFoldersEventName,
  getFolderUpdateFileEventName,
  getFolderUpdateFolderEventName,
  getTextSearchEndTypingEventName,
} from '../shared/emitter';
import {getFolder} from './utils/functions/getFolder';
import {getFolderFiles} from './utils/functions/getFolderFiles';
import {getFolderSubFolders} from './utils/functions/getFolderSubFolders';
import {
  pushNavigationScreen,
  removeByComponentId,
} from '../store/navigationStore';
import {displayToast, loadContentError} from '../shared/toast';

type HomeProps = {
  folder?: Folder;
};

type PageFile = Page<File[]>;

function keyExtractor(item: File): string {
  return item.id;
}

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<File>>(FlashList);

const Home: NavigationFunctionComponent<HomeProps> = ({
  componentId,
  folder: currentFolder,
}) => {
  const ref = useRef<typeof FlashList>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [fetchedFolders, setFetchedFolders] = useState<boolean>(false);
  const [fetchedFiles, setFetchedFiles] = useState<boolean>(false);

  const [folder, setFolder] = useState<Folder | undefined>(currentFolder);
  const [subFolders, setSubFolders] = useState<Folder[]>([]);

  const [filesPage, setFilesPage] = useState<PageFile>({
    content: [],
    last: true,
    pageNumber: 0,
    totalPages: 0,
  });

  const [filteredPageContent, setFilteredPageContent] = useState<File[]>([]);

  const onThresholdReached = async () => {
    if (filesPage.last) {
      return;
    }

    if (folder) {
      const {data} = await getFolderFiles(folder, filesPage.pageNumber + 1);
      setFilesPage(page => {
        const content = [...filesPage.content, ...data.content];
        return {...page, content};
      });
    }
  };

  // animation values
  const scrollY = useSharedValue<number>(0);
  const dimensions = useSharedValue<Dimension>({width: 1, height: 1});
  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const scale = useSharedValue<number>(1);
  const x = useSharedValue<number>(-windowHeight);
  const y = useSharedValue<number>(-windowHeight);

  const renderHeader = () => {
    return (
      <AppHeader
        fetchedFiles={fetchedFiles}
        fetchedFolders={fetchedFolders}
        folders={subFolders}
      />
    );
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const renderItem = useCallback(
    (info: ListRenderItemInfo<File>) => {
      const mimeType = getSimpleMimeType(info.item.contentType);

      const defineComponent = () => {
        switch (mimeType) {
          case MimeType.IMAGE:
            return (
              <ImageThumbnail
                file={info.item}
                dimensions={dimensions}
                translateX={translateX}
                translateY={translateY}
                x={x}
                y={y}
                scale={scale}
              />
            );

          case MimeType.AUDIO:
            return <AudioThumbnail samples={info.item.details.audioSamples} />;

          case MimeType.VIDEO:
            return <VideoThumbnail index={info.index} file={info.item} />;

          case MimeType.PDF:
            return <PdfThumnail file={info.item} />;

          default:
            return <GenericThumbnail mimeType="image" />;
        }
      };

      return (
        // @ts-ignore
        <FileWrapper
          index={info.index}
          file={info.item}
          searchTerm={searchTerm}>
          {defineComponent()}
        </FileWrapper>
      );
    },
    [searchTerm],
  );

  useEffect(() => {
    const addFilesEventName = getFolderAddFilesEventName(folder?.id!!);
    const addFiles = emitter.addListener(
      addFilesEventName,
      (newFiles: File[]) => {
        setFilesPage(p => ({...p, content: [...newFiles, ...p.content]}));
        if (searchTerm === '') {
          setFilteredPageContent(content => [...newFiles, ...content]);
        }
      },
    );

    const deleteFilesEventName = getFolderDeleteFilesEventName(folder?.id!!);
    const deleteFiles = emitter.addListener(
      deleteFilesEventName,
      (ids: string[]) => {
        if (searchTerm === '') {
          setFilteredPageContent(files =>
            files.filter(f => !ids.includes(f.id)),
          );
        }

        setFilesPage(page => {
          page.content = page.content.filter(c => !ids.includes(c.id));
          return {...page};
        });
      },
    );

    const updateFolderEventName = getFolderUpdateFolderEventName(
      folder?.id ?? '',
    );
    const updateFolder = emitter.addListener(
      updateFolderEventName,
      (updatedFolder: Folder) => {
        setSubFolders(subs =>
          subs.map(s => {
            if (s.id === updatedFolder.id) {
              return updatedFolder;
            }

            return s;
          }),
        );
      },
    );

    const updateFileEventName = getFolderUpdateFileEventName(folder?.id ?? '');
    const updateFile = emitter.addListener(
      updateFileEventName,
      (file: File) => {
        setFilteredPageContent(files =>
          files.map(f => {
            if (f.id === file.id) {
              return file;
            }

            return f;
          }),
        );

        setFilesPage(page => {
          page.content = page.content.map(f => {
            if (file.id === f.id) {
              return file;
            }

            return f;
          });

          return {...page};
        });
      },
    );

    const addFoldersEventName = getFolderAddFoldersEventName(folder?.id ?? '');
    const addFolder = emitter.addListener(
      addFoldersEventName,
      (newfolders: Folder[]) => setSubFolders(sfs => [...newfolders, ...sfs]),
    );

    const deleteFoldersEventName = getFolderDeleteFoldersEventName(
      folder?.id!!,
    );
    const deleteFolders = emitter.addListener(
      deleteFoldersEventName,
      (ids: string[]) => {
        setSubFolders(sfs => sfs.filter(s => !ids.includes(s.id)));
      },
    );

    const eventName = getTextSearchEndTypingEventName(folder?.id ?? '');
    const onEndTyping = emitter.addListener(eventName, (text: string) => {
      setSearchTerm(text);
      setFilteredPageContent(files => {
        return files.filter(f =>
          f.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()),
        );
      });
    });

    const cleanSearchEventName = getClenTextSearchEventName(folder?.id ?? '');
    const cleanSearch = emitter.addListener(cleanSearchEventName, () => {
      setFilteredPageContent(filesPage.content);
      setSearchTerm('');
    });

    return () => {
      addFiles.remove();
      addFolder.remove();
      deleteFiles.remove();
      deleteFolders.remove();
      updateFile.remove();
      updateFolder.remove();
      onEndTyping.remove();
      cleanSearch.remove();
    };
  }, [folder]);

  useEffect(() => {
    getFolder(folder).then(unit => {
      setFolder(unit);

      pushNavigationScreen({
        componentId,
        folder: unit,
      });
    });

    RNBootSplash.hide({fade: true});
    return () => {
      removeByComponentId(componentId);
    };
  }, []);

  useEffect(() => {
    if (folder) {
      const filesPromise = getFolderFiles(folder, 0);
      const subFoldersPromise = getFolderSubFolders(folder, 0);
      Promise.all([filesPromise, subFoldersPromise])
        .then(([filesResponse, subFoldersReponse]) => {
          setFilesPage(filesResponse.data);
          setFilteredPageContent(filesResponse.data.content);
          setSubFolders(subFoldersReponse.data.content);

          setFetchedFolders(true);
          setFetchedFiles(true);
        })
        .catch(_ => {
          const message = loadContentError(folder.name);
          displayToast(message);
        });
    }
  }, [folder]);

  return (
    <NavigationContextProvider componentId={componentId} folder={folder}>
      <View style={styles.root}>
        <Appbar scrollY={scrollY} />

        <Animated.FlatList
          ref={ref as any}
          data={filteredPageContent}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          nestedScrollEnabled={true}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={() => (
            <NoContent
              fetchComplete={fetchedFiles && fetchedFolders}
              folders={subFolders.length}
              files={filesPage.content.length}
            />
          )}
          estimatedItemSize={SIZE}
          estimatedListSize={{
            width: windowWidth,
            height: (filesPage.content.length / 2) * SIZE,
          }}
          contentContainerStyle={styles.content}
          onScroll={onScroll}
          onEndReachedThreshold={0.3}
          onEndReached={onThresholdReached}
        />

        <FAB />

        <PinchableReflection
          dimensions={dimensions}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
          x={x}
          y={y}
        />
      </View>
    </NavigationContextProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    height: windowHeight,
    width: windowWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 50 + windowWidth * 0.05,
  },
});

Home.options = {
  statusBar: {
    visible: true,
    drawBehind: true,
    backgroundColor: '#fff',
    style: 'dark',
  },
  topBar: {
    visible: false,
  },
  sideMenu: {
    right: {
      enabled: true,
    },
  },
  layout: {
    backgroundColor: 'transparent',
    componentBackgroundColor: 'transparent',
  },
};

export default Home;
