import 'react-native-reanimated';
import {LogBox} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Screens} from './src/enums/screens';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import Home from './src/home/Home';
import Shared from './src/shared/Shared';
import Notifications from './src/notifications/Notifications';
import Settings from './src/settings/Settings';
import Editor from './src/settings/editor/Editor';
import Result from './src/settings/editor/Result';

LogBox.ignoreLogs(['ViewPropTypes']);

const tabs = [
  Screens.MY_UNIT,
  Screens.SHARED,
  Screens.NOTIFICATIONS,
  Screens.SETTINGS,
];

Navigation.registerComponent(Screens.MY_UNIT, () =>
  gestureHandlerRootHOC(Home),
);

Navigation.registerComponent(Screens.SHARED, () =>
  gestureHandlerRootHOC(Shared),
);

Navigation.registerComponent(Screens.NOTIFICATIONS, () =>
  gestureHandlerRootHOC(Notifications),
);

Navigation.registerComponent(Screens.SETTINGS, () =>
  gestureHandlerRootHOC(Editor),
);

Navigation.registerComponent('Result', () => Result);

Navigation.setDefaultOptions({
  statusBar: {
    visible: true,
    drawBehind: true,
    backgroundColor: {
      light: '#fff',
    },
  },
  bottomTabs: {
    elevation: 1000,
    drawBehind: false,
    barStyle: 'default',
  },
});

const defaultTab = {
  textColor: '#9BA4B4',
  selectedTextColor: '#3366ff',
  selectedFontSize: 11,
  fontSize: 11,
  badgeColor: '#3366ff',
  animateBadge: true,
};

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabs',
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
