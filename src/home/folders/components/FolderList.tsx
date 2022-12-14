import {View, Dimensions, StyleSheet} from 'react-native';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import Folder from './Folder';
import React, {useContext, useRef} from 'react';
import {Folder as FolderType} from '../../../shared/types';
import {NavigationContext} from '../../../navigation/components/NavigationContextProvider';

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
  const {folder} = useContext(NavigationContext);

  return (
    <View style={styles.root}>
      <View>
        {(folder?.summary.folders ?? 0) > 0 && (
          <FlashList
            ref={ref as any}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={folders}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={HEIGHT}
            contentContainerStyle={styles.content}
            ListEmptyComponent={() => <View />}
            estimatedListSize={{
              height: HEIGHT,
              width: SIZE * (folders.length / 2),
            }}
            ItemSeparatorComponent={seperatorComponent}
          />
        )}
      </View>
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
    width: 10,
  },
  skeletonView: {
    flexDirection: 'row',
    height: HEIGHT,
    paddingLeft: width * 0.05,
  },
});

export default FolderList;
