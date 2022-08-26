import {StyleSheet, ScrollView, Text} from 'react-native';
import React from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {PdfContent, pdfState} from '../../store/pdfStore';
import PdfIndexView from './PdfIndexView';
import {useSnapshot} from 'valtio';

const {statusBarHeight} = Navigation.constantsSync();

type PdfContentTableProps = {};

const PdfContentTable: NavigationFunctionComponent<
  PdfContentTableProps
> = ({}) => {
  const pdf = useSnapshot(pdfState);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.text}>Clean coder's contents</Text>
      {pdf.content.map((content, index) => {
        return (
          <PdfIndexView
            contents={content as PdfContent}
            index={index}
            key={`${content.title}-${index}`}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: statusBarHeight * 1.3,
    paddingBottom: 10,
  },
  text: {
    fontFamily: 'UberBold',
    color: '#000',
    marginBottom: 10,
    marginLeft: 15,
    fontSize: 18,
  },
});

export default PdfContentTable;
