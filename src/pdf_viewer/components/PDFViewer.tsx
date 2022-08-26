import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Pdf from 'react-native-pdf';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import PdfProgressIndicator from './PdfProgressIndicator';
import {pdfState, setPdfContents, setPdfIndexes} from '../../store/pdfStore';
import emitter from '../../utils/emitter';
import {PdfEvent} from '../enums';
import {convertTableContentsIntoIndexes} from '../utils/functions/convertTableContentsIntoIndexes';
import PageIndicator from './PageIndicator';
import {useSnapshot} from 'valtio';

type PDFViewerProps = {};

const {width, height} = Dimensions.get('window');

function onPageChanged(pageNumber: number) {
  emitter.emit(PdfEvent.PAGE_CHANGED, pageNumber);
}

const PDFViewer: NavigationFunctionComponent<PDFViewerProps> = ({
  componentId,
}) => {
  const pdf = useSnapshot(pdfState);

  const progress = useSharedValue<number>(0);
  const ref = useRef<Pdf>();

  const mergeOptions = () => {
    Navigation.mergeOptions(componentId, {
      sideMenu: {
        left: {
          enabled: true,
        },
      },
    });
  };

  useEffect(() => {
    const listener = emitter.addListener(
      PdfEvent.SET_PAGE,
      (pageNumber: number) => {
        ref.current?.setPage(pageNumber);
      },
    );

    return () => listener.remove();
  }, []);

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      sideMenu: {
        left: {
          enabled: pdf.content.length !== 0,
        },
      },
    });
  }, [pdf.content, componentId]);

  return (
    <View style={styles.root}>
      <Pdf
        ref={ref}
        style={styles.pdf}
        source={{
          uri: '',
        }}
        trustAllCerts={false}
        onLoadProgress={percent => (progress.value = withTiming(percent))}
        renderActivityIndicator={() => (
          <PdfProgressIndicator progress={progress} />
        )}
        onPageChanged={onPageChanged}
        onLoadComplete={(pages, path, size, contents) => {
          if (contents !== undefined) {
            const indexes = convertTableContentsIntoIndexes(contents, pages);
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

PDFViewer.options = {
  statusBar: {
    visible: true,
    backgroundColor: '#3366ff',
  },
  sideMenu: {
    left: {
      enabled: true,
    },
    right: {
      enabled: true,
    },
  },
};

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
