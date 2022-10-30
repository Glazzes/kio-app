import {View, Dimensions, StyleSheet} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import Folder from './Folder';
import React, {useEffect, useRef, useState} from 'react';
import emitter from '../../utils/emitter';
import {TypingEvent} from '../types';
import FolderSkeleton from '../../misc/skeleton/FolderSkeleton';

type FolderListProps = {};

const {width} = Dimensions.get('window');
const SIZE = width * 0.75;
const HEIGHT = 180;

const data: number[] = new Array(5).fill(0);

function keyExtractor(_: number, index: number) {
  return `folder-${index}`;
}

function renderItem() {
  return <Folder />;
}

function seperatorComponent() {
  return <View style={styles.separator} />;
}

const FolderList: React.FC<FolderListProps> = ({}) => {
  const ref = useRef<FlashList<number>>();

  const [showSkeletons, setShowSkeletons] = useState<boolean>(false);

  useEffect(() => {
    const beginTyping = emitter.addListener(
      TypingEvent.IS_TYPING,
      (text: string) => {
        if (!showSkeletons) {
          setShowSkeletons(true);
        }
      },
    );

    const endTyping = emitter.addListener(TypingEvent.END_TYPING, () => {
      setShowSkeletons(false);
    });

    return () => {
      beginTyping.remove();
      endTyping.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      {showSkeletons ? (
        <View style={styles.skeletonView}>
          <FolderSkeleton />
          <FolderSkeleton />
        </View>
      ) : (
        <FlashList
          ref={ref}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={HEIGHT}
          contentContainerStyle={styles.content}
          estimatedListSize={{height: HEIGHT, width: SIZE * (data.length / 2)}}
          ItemSeparatorComponent={seperatorComponent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    height: HEIGHT,
    marginVertical: 10,
  },
  content: {
    paddingHorizontal: width * 0.05,
  },
  separator: {
    width: 5,
  },
  skeletonView: {
    flexDirection: 'row',
    height: HEIGHT,
    paddingLeft: width * 0.05,
  },
});

export default FolderList;
