import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Pdf from 'react-native-pdf';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import PdfProgressIndicator from './PdfProgressIndicator';
import usePdfStore from '../../store/pdfStore';
import emitter from '../../utils/emitter';
import {PdfEvent} from '../enums';
import {convertTableContentsIntoIndexes} from '../utils/functions/convertTableContentsIntoIndexes';
import PageIndicator from './PageIndicator';

type PDFViewerProps = {};

const {width, height} = Dimensions.get('window');

function onPageChanged(pageNumber: number) {
  emitter.emit(PdfEvent.PAGE_CHANGED, pageNumber);
}

const PDFViewer: NavigationFunctionComponent<PDFViewerProps> = ({
  componentId,
}) => {
  const setContents = usePdfStore(s => s.setContents);
  const setIndexes = usePdfStore(s => s.setIndexes);

  const progress = useSharedValue<number>(0);
  const ref = useRef<typeof Pdf>();

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

  return (
    <View style={styles.root}>
      <Pdf
        ref={ref}
        style={styles.pdf}
        source={{
          uri: 'https://raw.githubusercontent.com/divyesh008/eBooks/main/Clean%20Coder.pdf',
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
            setContents(contents);
            setIndexes(indexes);

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
  sideMenu: {
    left: {
      enabled: false,
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
