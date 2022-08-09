import {View, Dimensions, StyleSheet} from 'react-native';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import Folder from '../../src/home/Folder';
import React, {useRef} from 'react';
import FileHeader from './FileHeader';

type FolderListProps = {};

const {width} = Dimensions.get('window');
const SIZE = width * 0.75;

const data = new Array(5).fill(0);

function keyExtractor(item: number, index: number) {
  return `folder-${index}`;
}

function renderItem(info: ListRenderItemInfo<number>) {
  return <Folder />;
}

const FolderList: React.FC<FolderListProps> = ({}) => {
  const ref = useRef<FlashList<number>>();

  return (
    <View style={styles.root}>
      <FlashList
        ref={ref}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={150}
        contentContainerStyle={styles.content}
        estimatedListSize={{height: 140, width: SIZE * (data.length / 2)}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width,
    marginVertical: 10,
    marginBottom: 15,
  },
  content: {
    paddingLeft: width * 0.05,
  },
});

export default FolderList;
