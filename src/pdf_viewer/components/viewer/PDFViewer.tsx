import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Pdf from 'react-native-pdf';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {
  setPdfContents,
  setPdfIndexes,
  setPdfName,
} from '../../../store/pdfStore';
import emitter from '../../../shared/emitter';
import {PdfEvent} from '../../utils/enums';
import {convertTableContentsIntoIndexes} from '../../utils/functions/convertTableContentsIntoIndexes';
import PageIndicator from '../drawer/PageIndicator';
import {useSnapshot} from 'valtio';
import {File, Folder} from '../../../shared/types';
import authState from '../../../store/authStore';
import {staticFileUrl} from '../../../shared/requests/contants';
import ThumbnailLoadingIndicator from '../../../shared/components/ThumbnailLoadingIndicator';
import {
  pushNavigationScreen,
  removeNavigationScreenByComponentId,
} from '../../../store/navigationStore';
import {Screens} from '../../../enums/screens';

type PDFViewerProps = {
  file: File;
};

const {width, height} = Dimensions.get('window');

function onPageChanged(pageNumber: number) {
  emitter.emit(PdfEvent.PAGE_CHANGED, pageNumber);
}

const PDFViewer: NavigationFunctionComponent<PDFViewerProps> = ({
  componentId,
  file,
}) => {
  const uri = staticFileUrl(file.id);
  const {accessToken} = useSnapshot(authState.tokens);
  const ref = useRef<Pdf>();

  const mergeOptions = () => {
    Navigation.mergeOptions(componentId, {
      sideMenu: {
        left: {
          enabled: true,
          visible: true,
        },
      },
    });
  };

  useEffect(() => {
    pushNavigationScreen({
      componentId: Screens.PDF_READER,
      folder: {id: '1', name: 'PDF'} as Folder,
    });

    Navigation.updateProps(Screens.FILE_DRAWER, {file});

    const listener = emitter.addListener(
      PdfEvent.SET_PAGE,
      (pageNumber: number) => {
        ref.current?.setPage(pageNumber);
      },
    );

    return () => {
      listener.remove();
      removeNavigationScreenByComponentId(Screens.PDF_READER);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <Pdf
        ref={ref as any}
        style={styles.pdf}
        source={{
          uri,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }}
        trustAllCerts={false}
        renderActivityIndicator={() => (
          <ThumbnailLoadingIndicator file={file} />
        )}
        onPageChanged={onPageChanged}
        onLoadComplete={(pages, path, size, contents) => {
          if (contents !== undefined) {
            const indexes = convertTableContentsIntoIndexes(contents, pages);
            const pdfExtension = file.name.lastIndexOf('.pdf');
            setPdfName(file.name.slice(0, pdfExtension));
            setPdfContents(contents);
            setPdfIndexes(indexes);

            mergeOptions();
            emitter.emit(PdfEvent.NUMBER_OF_PAGES, pages);
            emitter.emit(PdfEvent.DISPLAY_INDICATOR);
          }
        }}
      />
      <PageIndicator />
    </View>
  );
};

PDFViewer.options = ({file}) => ({
  statusBar: {
    visible: true,
    drawBehind: true,
  },
  sideMenu: {
    right: {
      enabled: true,
    },
    left: {
      enabled: true,
    },
  },
  animations: {
    push: {
      sharedElementTransitions: [
        {
          fromId: `pdf-${file.id}`,
          toId: `pdf-${file.id}-dest`,
          duration: 300,
        },
      ],
    },
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  pdf: {
    width,
    height,
  },
});

export default PDFViewer;
