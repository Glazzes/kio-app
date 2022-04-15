import {View, Text} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent} from 'react-native-navigation';

type EditorProps = {};

const Editor: NavigationFunctionComponent<EditorProps> = ({}) => {
  return (
    <View>
      <Text>Welcome to Editor</Text>
    </View>
  );
};

Editor.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

export default Editor;
