import {Navigation} from 'react-native-navigation';

export function pushToScreen<T extends Object>(
  componentId: string,
  screenName: string,
  props?: T,
) {
  Navigation.push(componentId, {
    component: {
      name: screenName,
      passProps: props,
    },
  });
}
