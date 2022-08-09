import {Navigation} from 'react-native-navigation';
import {SharedTransitionInfo} from '../types';

export function pushSharedTransition({
  componentId,
  componentName,
  fromId,
  toId,
  duration,
}: SharedTransitionInfo): void {
  if (!componentName) {
    throw new Error('When pushing to a screen the component name is needed');
  }

  Navigation.push(componentId, {
    component: {
      name: componentName,
      options: {
        animations: {
          push: {
            sharedElementTransitions: [
              {
                fromId: fromId,
                toId: toId,
                duration: duration ?? 300,
              },
            ],
          },
        },
      },
    },
  });
}
