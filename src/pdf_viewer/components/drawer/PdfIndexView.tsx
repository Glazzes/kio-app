import {Text, Pressable, TextStyle, StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {pdfState, PdfContent} from '../../../store/pdfStore';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import emitter from '../../../utils/emitter';
import {PdfEvent} from '../../utils/enums';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSnapshot} from 'valtio';

type PdfIndexViewProps = {
  index: number;
  contents: PdfContent;
};

function setPage(pageNumber: number) {
  emitter.emit(PdfEvent.SET_PAGE, pageNumber);
}

const PdfIndexView: React.FC<PdfIndexViewProps> = ({
  contents: {pageIdx, title, children: contentChildren},
  index,
}) => {
  const pdf = useSnapshot(pdfState);
  const currentIndex = useRef(pdf.indexes[pageIdx]).current;
  const [open, setOpen] = useState<boolean>(false);
  const [listMeasured, setListMeasure] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const listHeight = useSharedValue<number>(1);
  const toggle = () => {
    if (currentIndex.subIndexes.length > 0) {
      setOpen(o => !o);
      return;
    }

    setPage(pageIdx + 1);
  };

  const textStyles: TextStyle = useMemo(() => {
    if (index === 0 && currentPage < pageIdx) {
      return {
        fontFamily: 'UberBold',
        color: '#3366ff',
      };
    }

    const prev = index === 0 ? 1 : pageIdx;
    const condition = currentPage > prev && currentPage <= currentIndex.next;

    return {
      fontFamily: condition ? 'UberBold' : 'Uber',
      color: condition ? '#3366ff' : '#000',
    };
  }, [pageIdx, index, currentPage, currentIndex]);

  const rStyle = useAnimatedStyle(() => {
    return {
      height:
        listMeasured && open ? withTiming(listHeight.value) : withTiming(1),
    };
  });

  useEffect(() => {
    const pageChange = emitter.addListener(
      PdfEvent.PAGE_CHANGED,
      (page: number) => setCurrentPage(page),
    );

    return () => {
      pageChange.remove();
    };
  }, []);

  return (
    <Pressable
      style={({pressed}) => {
        return {
          ...styles.presable,
          opacity: pressed ? 0.5 : 1,
        };
      }}
      onPress={toggle}
      hitSlop={{bottom: 10, top: 10}}>
      <View style={styles.title}>
        {currentIndex.subIndexes.length > 0 ? (
          <Icon
            name={open ? 'chevron-down' : 'chevron-right'}
            color={open ? '#3366ff' : '#000'}
            size={15}
          />
        ) : (
          <View style={styles.placeHolder} />
        )}
        <Text style={textStyles}>
          {pageIdx} {title}
        </Text>
      </View>
      {contentChildren.length > 0 && (
        <Animated.View
          style={[styles.section, listMeasured ? rStyle : {}]}
          onLayout={e => {
            if (!listMeasured) {
              listHeight.value = e.nativeEvent.layout.height;
              setListMeasure(true);
            }
          }}>
          {contentChildren.map((c, idx) => {
            const subIndex = pdf.indexes[pageIdx].subIndexes[idx];

            const condition =
              currentPage > c.pageIdx && currentPage <= subIndex.next;

            const contentTextStyles: TextStyle = {
              fontFamily: condition ? 'UberBold' : 'Uber',
              color: condition ? '#3366ff' : '#000',
            };

            return (
              <Pressable
                style={({pressed}) => ({opacity: pressed ? 0.5 : 1})}
                onPress={() => setPage(c.pageIdx + 1)}
                key={`${c.title}-${idx}-${c.pageIdx}`}>
                <Text style={[contentTextStyles, styles.innerText]}>
                  {c.pageIdx} {c.title}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  presable: {
    overflow: 'hidden',
    justifyContent: 'center',
    marginVertical: 5,
  },
  section: {
    marginVertical: 5,
    marginLeft: 20,
  },
  hide: {
    height: 1,
    overflow: 'hidden',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Uber',
    color: '#000',
  },
  innerText: {
    marginVertical: 3,
  },
  placeHolder: {
    height: 30,
    width: 15,
  },
});

export default PdfIndexView;
