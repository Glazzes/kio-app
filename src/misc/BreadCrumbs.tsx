import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  ViewStyle,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSnapshot} from 'valtio';
import {navigationState} from '../store/navigationStore';
import {Navigation} from 'react-native-navigation';

type BreadCrumbsProps = {
  isOnTopOfFolders: boolean;
};

const {width} = Dimensions.get('window');

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({isOnTopOfFolders}) => {
  const snap = useSnapshot(navigationState);
  const style: ViewStyle = {marginBottom: isOnTopOfFolders ? 20 : 0};

  return (
    <View style={style}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={styles.scrollview}
        contentContainerStyle={styles.content}>
        {snap.folders.map((screen, index) => {
          return (
            <Pressable
              onPress={() => {
                Navigation.popTo(screen.componentId);
              }}
              key={`${screen.folder.id}-${index}`}
              style={styles.container}>
              <Text
                style={styles.text}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {screen.folder.name}
              </Text>
              {index !== snap.folders.length - 1 && (
                <Icon name={'chevron-right'} color={'#354259'} size={20} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollview: {
    height: 35,
    maxHeight: 35,
    width: width,
    marginVertical: 5,
  },
  content: {
    paddingHorizontal: width * 0.05,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Uber',
    color: '#000',
    fontSize: 13,
    maxWidth: 100,
  },
});

export default BreadCrumbs;
