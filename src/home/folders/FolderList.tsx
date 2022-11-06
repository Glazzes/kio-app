import {View, Dimensions, StyleSheet} from 'react-native';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import Folder from './Folder';
import React, {useEffect, useRef, useState} from 'react';
import emitter from '../../utils/emitter';
import {TypingEvent} from '../utils/types';
import FolderSkeleton from '../../misc/skeleton/FolderSkeleton';
import {Folder as FolderType} from '../../shared/types';

type FolderListProps = {
  folders: FolderType[];
};

const {width} = Dimensions.get('window');
const SIZE = width * 0.75;
const HEIGHT = 180;

function keyExtractor(_: FolderType, index: number) {
  return `folder-${index}`;
}

function renderItem(info: ListRenderItemInfo<FolderType>) {
  return <Folder folder={info.item} />;
}

function seperatorComponent() {
  return <View style={styles.separator} />;
}

const FolderList: React.FC<FolderListProps> = ({folders}) => {
  const ref = useRef<FlashList<FolderType>>();

  const [showSkeletons, setShowSkeletons] = useState<boolean>(false);

  useEffect(() => {
    const beginTyping = emitter.addListener(
      TypingEvent.IS_TYPING,
      (_: string) => {
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
          ref={ref as any}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={folders}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={HEIGHT}
          contentContainerStyle={styles.content}
          estimatedListSize={{
            height: HEIGHT,
            width: SIZE * (folders.length / 2),
          }}
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
