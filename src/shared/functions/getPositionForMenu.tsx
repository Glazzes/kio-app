import {Dimensions} from 'react-native';
import {Point} from '../types';

const {width, height} = Dimensions.get('window');

export function getPositionForMenu(
  triggerWidth: number,
  triggerHeight: number,
  pageX: number,
  pageY: number,
  menuWidth: number,
  menuHeight: number,
): Point {
  'worklet';

  const x = pageX < width / 2 ? pageX - 30 : 30;

  const inTopArea = pageY > 0 && pageY < height * 0.33;
  if (inTopArea) {
    return {x, y: pageY - 120};
  }

  const inMiddleArea = pageY > height * 0.33 && pageY < height * 0.66;
  if (inMiddleArea) {
    return {x, y: (height - menuHeight) / 2};
  }

  const inBottomArea = pageY > height * 0.66 && pageY <= height;
  if (inBottomArea) {
    return {x, y: height - menuHeight - 20};
  }

  return {x: pageX, y: pageY};
}
