import 'react-native-reanimated';
import {LogBox} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Screens} from './src/enums/screens';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import Notifications from './src/notifications/Notifications';
import {Settings, Editor} from './src/settings';
import Result from './src/settings/editor/Result';
import ImageDetails from './src/home/files/details/ImageDetails';
import Shared from './src/shared/Shared';
import {Home, Camera, CreateFolderModal} from './src/home';
import {Toast} from './src/misc';
import DetailsDrawer from './src/navigation/DetailsDrawer';
import ScrollTest from './src/misc/ScrollTest';

LogBox.ignoreLogs(['ViewPropTypes']);

Navigation.setDefaultOptions({
  topBar: {
    visible: false,
  },
  statusBar: {
    visible: false,
  },
  modalPresentationStyle: 'overCurrentContext',
  overlay: {
    interceptTouchOutside: false,
  },
  layout: {
    backgroundColor: 'transparent',
  },
  sideMenu: {
    right: {
      enabled: false,
    },
  },
});

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      sideMenu: {
        center: {
          stack: {
            id: 'Stack',
            children: [
              {
                component: {
                  id: 'Camera',
                  name: Screens.SETTINGS,
                },
              },
            ],
          },
        },
        right: {
          component: {
            id: Screens.LEFT_DRAWER,
            name: Screens.LEFT_DRAWER,
          },
        },
      },
    },
  });
});

Navigation.registerComponent('ST', () => ScrollTest);

Navigation.registerComponent(Screens.CAMERA, () =>
  gestureHandlerRootHOC(Camera),
);

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

Navigation.registerComponent('Result', () => gestureHandlerRootHOC(Result));

// Miscelaneous
Navigation.registerComponent(Screens.TOAST, () => Toast);

Navigation.registerComponent(
  Screens.CREATE_FOLDER_MODAL,
  () => CreateFolderModal,
);

Navigation.registerComponent(Screens.LEFT_DRAWER, () => DetailsDrawer);
