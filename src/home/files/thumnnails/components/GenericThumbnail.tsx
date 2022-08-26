import {View, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {codeTypes, compressedTypes, SIZE} from '../utils/constants';

type GenericThumbnailProps = {};

const type = 'application/zip';

const GenericThumbnail: React.FC<GenericThumbnailProps> = ({}) => {
  const iconName = useMemo(() => {
    let icon = 'file';
    if (compressedTypes.includes(type)) {
      return 'zip-box';
    }

    if (codeTypes.includes(type)) {
      return 'code-braces';
    }

    return icon;
  }, []);

  return (
    <View style={styles.root}>
      <Icon size={85} color={'#3366ff'} name={iconName} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    height: SIZE,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default GenericThumbnail;
