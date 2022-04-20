import {View, Dimensions, Image, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';
import FastImage from 'react-native-fast-image';

type ImageDetailsProps = {};

const uri = 'file:///storage/sdcard0/Descargas/Callejon.png';

const {width} = Dimensions.get('window');

const ImageDetails: NavigationFunctionComponent<ImageDetailsProps> = ({}) => {
  const [d, setD] = React.useState({width: 1, height: 1});

  React.useEffect(() => {
    Image.getSize(uri, (w, h) => {
      setD({width: w, height: h});
    });
  }, []);

  return (
    <View style={styles.root} nativeID={'bg'}>
      <Image
        nativeID="img-dest"
        source={{uri}}
        resizeMethod={'scale'}
        resizeMode={'cover'}
        style={{
          width,
          maxWidth: width,
          height: undefined,
          maxHeight: undefined,
          aspectRatio: d.width / d.height,
        }}
      />
    </View>
  );
};

ImageDetails.options = {
  animations: {
    pop: {
      sharedElementTransitions: [
        {
          fromId: 'img-dest',
          toId: 'img',
          duration: 300,
        },
      ],
    },
  },
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
  bottomTabs: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageDetails;
