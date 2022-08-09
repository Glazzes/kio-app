import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Pdf from 'react-native-pdf';

type PDFViewerProps = {};

const PDFViewer: React.FC<PDFViewerProps> = ({}) => {
  return (
    <Pdf style={styles.root} source={{uri: 'https://orimi.com/pdf-test.pdf'}} />
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default PDFViewer;
