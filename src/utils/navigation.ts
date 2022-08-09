import {Navigation} from 'react-native-navigation';

export type SharedTransitionInfo = {
  componentName: string;
  componentId: string;
  fromId: string;
  toId: string;
  duration?: number;
};

const sharedTransitionBackTo = (sharedTransition: SharedTransitionInfo) => {
  Navigation.pop(sharedTransition.componentId, {
    animations: {
      pop: {
        sharedElementTransitions: [
          {
            fromId: sharedTransition.fromId,
            toId: sharedTransition.toId,
            duration: sharedTransition.duration ?? 300,
          },
        ],
      },
    },
  });
};
