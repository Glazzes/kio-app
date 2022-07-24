import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {ShadowView} from '@dimaportenko/react-native-shadow-view';

type UnitInfoProps = {};

const {width} = Dimensions.get('window');
const HEIGHT = 140;
const SPACING = 10;

const UnitInfo: React.FC<UnitInfoProps> = ({}) => {
  return (
    <ShadowView style={styles.unit}>
      <Text>Welcome to UnitInfo</Text>
    </ShadowView>
  );
};

const styles = StyleSheet.create({
  unit: {
    width: width * 0.9,
    height: HEIGHT,
    paddingVertical: SPACING,
    paddingHorizontal: SPACING / 2,
    backgroundColor: '#3366ff',
    borderRadius: SPACING,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 4,
      height: 2,
    },
  },
});

export default UnitInfo;
