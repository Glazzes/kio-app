import {View, Text, TextInput, StyleSheet, Dimensions} from 'react-native';
import React, {useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const SearchBar: React.FC = ({}) => {
  const text = useRef<string>('');

  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [previousTextLength, setPreviousTextLength] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(true);

  const onChangeText = (t: string) => {
    text.current = t;

    if (Math.abs(previousTextLength - t.length) > 1) {
      setShowContent(false);
    }

    if (timer) {
      clearTimeout(timer);
    }

    const showResults = setTimeout(() => {
      setShowContent(true);
      setPreviousTextLength(t.length);
    }, 600);

    setTimer(showResults);
  };

  return (
    <View style={styles.root}>
      <Icon name={'magnify'} color={'#9E9EA7'} size={20} style={styles.icon} />
      <TextInput
        onChangeText={onChangeText}
        placeholder="Search"
        style={styles.searchbar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: width * 0.89,
    height: 40,
    backgroundColor: '#F3F3F4',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  searchbar: {
    flex: 1,
    fontFamily: 'Uber',
    backgroundColor: '#F3F3F4',
    color: '#C5C8D7',
  },
});

export default SearchBar;
