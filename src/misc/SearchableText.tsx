import {Text, TextStyle} from 'react-native';
import React, {useEffect, useState} from 'react';

type SearchableTextProps = {
  text: string;
  searchTerm: string;
  style: TextStyle;
  selectedColor: string;
};

const SearchableText: React.FC<SearchableTextProps> = ({
  text,
  searchTerm,
  style,
  selectedColor,
}) => {
  const [fragments, setFragments] = useState<string[]>([]);

  useEffect(() => {
    const frags = text.split(new RegExp(searchTerm, 'i'));

    const isFullOfSpaces = frags.every(item => item === '');
    if (isFullOfSpaces) {
      frags.pop();
      setFragments(frags);
      return;
    }

    const newFragments = [];
    for (let i = 0; i < frags.length; i++) {
      newFragments.push(frags[i]);
      if (frags[i] !== '' && frags[i + 1] && frags[i + 1] !== '') {
        newFragments.push('');
      }
    }

    setFragments(newFragments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Text style={style} numberOfLines={1} ellipsizeMode={'tail'}>
      {fragments.map((fragment, index) => {
        return (
          <Text
            style={fragment === '' ? {color: selectedColor} : {}}
            key={`${fragment}${index}`}>
            {fragment === '' ? searchTerm.toLocaleLowerCase() : fragment}
          </Text>
        );
      })}
    </Text>
  );
};

export default SearchableText;
