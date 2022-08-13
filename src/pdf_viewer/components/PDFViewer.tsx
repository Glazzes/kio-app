import {StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Pdf from 'react-native-pdf';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import PdfProgressIndicator from './PdfProgressIndicator';
import usePdfStore from '../../store/pdfStore';
import emitter from '../../utils/emitter';
import {PdfEvent} from '../enums';
import {convertTableContentsIntoIndexes} from '../utils/functions/convertTableContentsIntoIndexes';

type PDFViewerProps = {};

const PDFViewer: NavigationFunctionComponent<PDFViewerProps> = ({
  componentId,
}) => {
  const indexdes = usePdfStore(s => s.indexes);
  const setContents = usePdfStore(s => s.setContents);
  const setIndexes = usePdfStore(s => s.setIndexes);

  const progress = useSharedValue<number>(0);
  const ref = useRef<typeof Pdf>();

  const onPageChanged = (pageNumber: number) => {
    const currentIndex = indexdes[pageNumber];
    if (currentIndex) {
      emitter.emit(PdfEvent.PAGE_CHANGED, currentIndex);
    }
  };

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
    <Pdf
      ref={ref}
      style={styles.root}
      source={{
        uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
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
        }
      }}
    />
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
  },
});

export default PDFViewer;
