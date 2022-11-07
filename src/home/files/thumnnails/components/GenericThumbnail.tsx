import {View, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {codeTypes, compressedTypes, SIZE} from '../utils/constants';

type GenericThumbnailProps = {
  mimeType: string;
};

const GenericThumbnail: React.FC<GenericThumbnailProps> = ({mimeType}) => {
  const iconName = useMemo(() => {
    let icon = 'ios-document';
    if (compressedTypes.includes(mimeType)) {
      return 'zip-box';
    }

    if (codeTypes.includes(mimeType)) {
      return 'code-braces';
    }

    return icon;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
