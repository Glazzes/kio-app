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
import {Dimension, File, Folder, Page, User} from '../shared/types';
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
  removeNavigationScreenByComponentId,
} from '../store/navigationStore';
import {displayToast, loadContentError} from '../shared/toast';
import {getFolderCoowners} from './utils/functions/getFolderCoowners';

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
  const ref = useRef<FlashList<File>>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [folder, setFolder] = useState<Folder | undefined>(currentFolder);
  const [coownersPage, setCoownersPage] = useState<Page<User[]>>({
    content: [],
    last: false,
    pageNumber: 0,
    totalPages: 0,
  });

  const [filteredFolderPageContent, setFilteredFolderPageContent] = useState<
    Folder[]
  >([]);
  const [foldersPage, setFoldersPage] = useState<Page<Folder[]>>({
    content: [],
    last: false,
    pageNumber: 0,
    totalPages: 0,
  });

  const [filteredFilesPageContent, setFilteredFilesPageContent] = useState<
    File[]
  >([]);
  const [filesPage, setFilesPage] = useState<PageFile>({
    content: [],
    last: false,
    pageNumber: 0,
    totalPages: 0,
  });

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
        coowners={coownersPage.content}
        folders={filteredFolderPageContent}
        isFetching={isFetching}
      />
    );
  };

  const renderLoadingScreen = () => {
    return (
      <NoContent
        folders={filteredFolderPageContent.length}
        files={filesPage.content.length}
        searchTerm={searchTerm}
        isFetching={isFetching}
      />
    );
  };

  const onThresholdReachedFiles = async () => {
    if (filesPage.last) {
      return;
    }

    if (folder) {
      try {
        const {data} = await getFolderFiles(folder, filesPage.pageNumber + 1);
        setFilesPage(page => {
          const content = [...page.content, ...data.content];
          return {...data, content};
        });
      } catch (e) {}
    }
  };

  const onThresholdReachedFolders = async () => {
    if (foldersPage.last) {
      return;
    }

    if (folder) {
      try {
        const {data} = await getFolderSubFolders(
          folder,
          foldersPage.pageNumber + 1,
        );
        setFoldersPage(page => {
          const content = [...page.content, ...data.content];
          return {...data, content};
        });
      } catch (e) {}
    }
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
    const eventName = getTextSearchEndTypingEventName(folder?.id ?? '');
    const onEndTyping = emitter.addListener(eventName, (text: string) => {
      setSearchTerm(text);
      setFilteredFilesPageContent(files => {
        return files.filter(f =>
          f.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()),
        );
      });

      setFilteredFolderPageContent(folders => {
        return folders.filter(f =>
          f.name.toLocaleLowerCase().includes(text.toLocaleLowerCase()),
        );
      });
    });

    const cleanSearchEventName = getClenTextSearchEventName(folder?.id ?? '');
    const cleanSearch = emitter.addListener(cleanSearchEventName, () => {
      setFilteredFilesPageContent(filesPage.content);
      setFilteredFolderPageContent(foldersPage.content);
      setSearchTerm('');
    });

    return () => {
      onEndTyping.remove();
      cleanSearch.remove();
    };
  }, [folder]);

  useEffect(() => {
    const addFilesEventName = getFolderAddFilesEventName(folder?.id!!);
    const addFiles = emitter.addListener(
      addFilesEventName,
      (newFiles: File[]) => {
        setFilesPage(p => ({...p, content: [...newFiles, ...p.content]}));
        if (searchTerm === '') {
          setFilteredFilesPageContent(content => [...newFiles, ...content]);
        }
      },
    );

    const deleteFilesEventName = getFolderDeleteFilesEventName(folder?.id!!);
    const deleteFiles = emitter.addListener(
      deleteFilesEventName,
      (ids: string[]) => {
        if (searchTerm === '') {
          setFilteredFilesPageContent(files =>
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
        setFoldersPage(p => {
          const content = p.content.map(f => {
            if (f.id === updatedFolder.id) {
              return updatedFolder;
            }

            return f;
          });

          return {...p, content};
        });
      },
    );

    const updateFileEventName = getFolderUpdateFileEventName(folder?.id ?? '');
    const updateFile = emitter.addListener(
      updateFileEventName,
      (file: File) => {
        setFilteredFilesPageContent(files =>
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
      (newfolders: Folder[]) => {
        setFoldersPage(p => ({...p, content: [...newfolders, ...p.content]}));
        if (searchTerm === '') {
          setFilteredFolderPageContent(c => [...newfolders, ...c]);
        }
      },
    );

    const deleteFoldersEventName = getFolderDeleteFoldersEventName(
      folder?.id!!,
    );
    const deleteFolders = emitter.addListener(
      deleteFoldersEventName,
      (ids: string[]) => {
        setFoldersPage(p => {
          const content = p.content.filter(f => !ids.includes(f.id));
          return {...p, content};
        });

        setFilteredFolderPageContent(sfs =>
          sfs.filter(s => !ids.includes(s.id)),
        );
      },
    );

    return () => {
      addFiles.remove();
      addFolder.remove();
      deleteFiles.remove();
      deleteFolders.remove();
      updateFile.remove();
      updateFolder.remove();
    };
  }, [folder, searchTerm]);

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
      removeNavigationScreenByComponentId(componentId);
    };
  }, []);

  useEffect(() => {
    if (folder) {
      const filesPromise = getFolderFiles(folder, 0);
      const subFoldersPromise = getFolderSubFolders(folder, 0);
      const coownersPromise = getFolderCoowners(folder.id, 0);

      Promise.all([filesPromise, subFoldersPromise, coownersPromise])
        .then(([filesResponse, subFoldersReponse, coownersResponse]) => {
          setFilesPage(filesResponse.data);
          setFilteredFilesPageContent(filesResponse.data.content);

          setFoldersPage(subFoldersReponse.data);
          setFilteredFolderPageContent(subFoldersReponse.data.content);

          setCoownersPage(coownersResponse.data);
        })
        .catch(_ => {
          const message = loadContentError(folder.name);
          displayToast(message);
        })
        .finally(() => setIsFetching(false));
    }
  }, [folder]);

  return (
    <NavigationContextProvider componentId={componentId} folder={folder}>
      <View style={styles.root}>
        <Appbar scrollY={scrollY} />

        {filteredFilesPageContent.length > 0 &&
        filteredFolderPageContent.length > 0 &&
        !isFetching ? (
          <AnimatedFlashList
            ref={ref}
            data={filteredFilesPageContent}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            nestedScrollEnabled={true}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderLoadingScreen}
            estimatedItemSize={SIZE}
            estimatedListSize={{
              width: windowWidth,
              height: (filesPage.content.length / 2) * SIZE,
            }}
            contentContainerStyle={styles.content}
            onScroll={onScroll}
            onEndReachedThreshold={0.3}
            onEndReached={onThresholdReachedFiles}
          />
        ) : (
          <NoContent
            files={filteredFilesPageContent.length}
            folders={filteredFolderPageContent.length}
            isFetching={isFetching}
            searchTerm={searchTerm}
          />
        )}

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
