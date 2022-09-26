import {LayoutRoot} from 'react-native-navigation';
import {Screens} from '../enums/screens';
import {OnBoardingScreens} from '../onboarding/screens';
import {Drawers} from './drawers';

const onBoardingRoot: LayoutRoot = {
  root: {
    stack: {
      id: 'OnBoarding.Stack',
      children: [
        {
          component: {
            name: OnBoardingScreens.GET_STARTED,
          },
        },
      ],
    },
  },
};

const mainRoot: LayoutRoot = {
  root: {
    sideMenu: {
      center: {
        stack: {
          id: 'Stack',
          options: {
            sideMenu: {
              left: {
                enabled: false,
              },
            },
          },
          children: [
            {
              component: {
                id: Screens.MY_UNIT,
                name: Screens.MY_UNIT,
              },
            },
          ],
        },
      },
      right: {
        component: {
          id: Screens.LEFT_DRAWER,
          name: Screens.LEFT_DRAWER,
          options: {
            statusBar: {
              visible: false,
            },
            topBar: {
              visible: false,
            },
          },
        },
      },
      left: {
        component: {
          id: Drawers.PDF_CONTENT_DRAWER,
          name: Drawers.PDF_CONTENT_DRAWER,
          options: {
            statusBar: {
              visible: false,
            },
            topBar: {
              visible: false,
            },
          },
        },
      },
    },
  },
};

export {onBoardingRoot, mainRoot};
