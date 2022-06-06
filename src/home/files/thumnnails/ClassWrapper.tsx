import React from 'react';
import {Text, View} from 'react-native';
import {ShadowView} from '@dimaportenko/react-native-shadow-view';
import Animated from 'react-native-reanimated';

interface ClassWrapperProps {
  shadowOpacity: number;
}

Animated.addWhitelistedUIProps({shadowOpacity: true});

class ClassWrapper extends React.Component<ClassWrapperProps> {
  state = {
    hello: '',
  };

  render() {
    const s = {
      height: 100,
      width: 100,
      backgroundColor: 'salmon',
      borderRadius: 10,
      shadowRadius: 40,
      shadowColor: 'blue',
      shadowOpacity: this.props.shadowOpacity,
    };

    return (
      <ShadowView style={s}>
        <Text>{this.props.shadowOpacity}</Text>
      </ShadowView>
    );
  }
}

export default ClassWrapper;
