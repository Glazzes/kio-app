import {Text, StyleSheet, ScrollView, Pressable, TextStyle} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import usePdfStore, {Index, PdfContent} from '../../store/pdfStore';
import emitter from '../../utils/emitter';
import {PdfEvent} from '../enums';

type PdfContentProps = {
  contents: PdfContent;
  currentIndex: Index;
};

const {statusBarHeight} = Navigation.constantsSync();

const PdfContentView = ({
  contents: {pageIdx, title},
  currentIndex,
}: PdfContentProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen(s => !s);

  const textStyles: TextStyle = useMemo(() => {
    if (currentIndex === undefined) {
      return {
        fontFamily: 'Uber',
        color: '#000',
      };
    }

    const condition =
      pageIdx > currentIndex.prev && pageIdx < currentIndex.next;

    return {
      fontFamily: condition ? 'UberBold' : 'Uber',
      color: condition ? '#3366ff' : '#000',
    };
  }, [currentIndex, pageIdx]);

  return (
    <Pressable onPress={toggleOpen} style={styles.section}>
      <Text style={textStyles}>
        {pageIdx} {title}
      </Text>
    </Pressable>
  );
};

type PdfContentTableProps = {};

const PdfContentTable: NavigationFunctionComponent<
  PdfContentTableProps
> = ({}) => {
  const contents = usePdfStore(s => s.content);
  const indexes = usePdfStore(s => s.indexes);
  const initalKey = useRef(Object.keys(indexes)[0]).current;

  // @ts-ignore
  const [currentIndex, setCurrentIndex] = useState<Index>(indexes[initalKey]);

  useEffect(() => {
    const pageChanged = emitter.addListener(
      PdfEvent.PAGE_CHANGED,
      (index: Index) => {
        setCurrentIndex(index);
      },
    );

    return () => {
      pageChanged.remove();
    };
  }, []);

  return (
    <ScrollView style={styles.root}>
      {contents.map((content, index) => {
        return (
          <PdfContentView
            contents={content}
            currentIndex={currentIndex}
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
    paddingHorizontal: 10,
    paddingTop: statusBarHeight * 1.3,
    paddingBottom: 10,
  },
  section: {
    marginVertical: 10,
  },
  text: {
    fontFamily: 'UberBold',
    color: '#000',
  },
});

export default PdfContentTable;
