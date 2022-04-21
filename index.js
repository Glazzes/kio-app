import 'react-native-reanimated';
import {LogBox} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Screens} from './src/enums/screens';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import Home from './src/home/Home';
import Shared from './src/shared/Shared';
import Notifications from './src/notifications/Notifications';
import {Settings, Editor} from './src/settings';
import Result from './src/settings/editor/Result';
import ImageDetails from './src/home/files/details/ImageDetails';

LogBox.ignoreLogs(['ViewPropTypes']);

const tabs = [
  Screens.MY_UNIT,
  Screens.SHARED,
  Screens.NOTIFICATIONS,
  Screens.SETTINGS,
];

const defaultTab = {
  textColor: '#9BA4B4',
  selectedTextColor: '#3366ff',
  selectedFontSize: 11,
  fontSize: 11,
  badgeColor: '#3366ff',
  animateBadge: true,
};

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabs',
        options: {
          bottomTabs: {
            elevation: 5,
          },
        },
        children: [
          {
            stack: {
              id: tabs[0],
              children: [
                {
                  component: {
                    id: tabs[0],
                    name: tabs[0],
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: tabs[0],
                  ...defaultTab,
                },
              },
            },
          },

          {
            stack: {
              id: tabs[1],
              children: [
                {
                  component: {
                    id: tabs[1],
                    name: tabs[1],
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: tabs[1],
                  ...defaultTab,
                },
              },
            },
          },

          {
            stack: {
              id: tabs[2],
              children: [
                {
                  component: {
                    id: tabs[2],
                    name: tabs[2],
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: tabs[2],
                  ...defaultTab,
                },
              },
            },
          },

          {
            stack: {
              id: tabs[3],
              children: [
                {
                  component: {
                    id: tabs[3],
                    name: tabs[3],
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: tabs[3],
                  ...defaultTab,
                },
              },
            },
          },
        ],
      },
    },
  });
});

Navigation.registerComponent(Screens.MY_UNIT, () =>
  gestureHandlerRootHOC(Home),
);

Navigation.registerComponent(Screens.IMAGE_DETAILS, () =>
  gestureHandlerRootHOC(ImageDetails),
);

Navigation.registerComponent(Screens.SHARED, () =>
  gestureHandlerRootHOC(Shared),
);

Navigation.registerComponent(Screens.NOTIFICATIONS, () =>
  gestureHandlerRootHOC(Notifications),
);

// Settings tab Stack
Navigation.registerComponent(Screens.SETTINGS, () =>
  gestureHandlerRootHOC(Settings),
);

Navigation.registerComponent(Screens.EDITOR, () =>
  gestureHandlerRootHOC(Editor),
);

Navigation.registerComponent('Result', () => Result);
