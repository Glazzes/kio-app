import {Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';

type SearchableTextProps = {
  text: string;
  searchTerm: string;
};

const SearchableText: React.FC<SearchableTextProps> = ({text, searchTerm}) => {
  const [fragments, setFragments] = useState<string[]>([]);

  useEffect(() => {
    const frags = text
      .toLocaleLowerCase()
      .split(searchTerm.toLocaleLowerCase());

    const isFullOfSpaces = frags.every(item => item === '');
    if (isFullOfSpaces) {
      frags.pop();
      setFragments(frags);
      return;
    }

    const newFragments = [];
    for (let i = 0; i < frags.length; i++) {
      newFragments.push(frags[i]);
      if (frags[i] !== '' && frags[i + 1] !== '') {
        newFragments.push('');
      }
    }

    setFragments(newFragments);
  }, [text, searchTerm]);

  return (
    <Text style={styles.text} numberOfLines={1} ellipsizeMode={'tail'}>
      {fragments.map((frag, index) => {
        return (
          <Text style={frag === '' ? styles.match : {}} key={`${frag}${index}`}>
            {frag === '' ? searchTerm.toLocaleLowerCase() : frag}
          </Text>
        );
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'UberBold',
    fontSize: 15,
    flex: 1,
  },
  match: {
    color: '#3366ff',
  },
});

export default SearchableText;
