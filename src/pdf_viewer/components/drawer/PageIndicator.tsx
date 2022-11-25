import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import emitter from '../../../utils/emitter';
import {PdfEvent} from '../../utils/enums';

const {height} = Dimensions.get('window');

const PageIndicator: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [displayIndicator, setdisplayIndicator] = useState<boolean>(false);

  useEffect(() => {
    const pageChanged = emitter.addListener(
      PdfEvent.PAGE_CHANGED,
      (page: number) => {
        setCurrentPage(page);
      },
    );

    const listener = emitter.addListener(
      PdfEvent.NUMBER_OF_PAGES,
      (pages: number) => {
        setNumberOfPages(pages);
      },
    );

    const indicatorListener = emitter.addListener(
      PdfEvent.DISPLAY_INDICATOR,
      () => setdisplayIndicator(true),
    );

    return () => {
      pageChanged.remove();
      listener.remove();
      indicatorListener.remove();
    };
  });

  if (!displayIndicator) {
    return null;
  }

  return (
    <View style={styles.indicator}>
      <Text style={styles.text}>
        Page {currentPage} / {numberOfPages}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    bottom: height * 0.05,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
});

export default PageIndicator;
