import 'react-native-reanimated';
import {LogBox} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Screens} from './src/enums/screens';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import Notifications from './src/notifications/Notifications';
import {Settings} from './src/settings';
import ImageDetails from './src/home/files/details/ImageDetails';
import Shared from './src/shared/Shared';
import {Home, Camera, CreateFolderModal} from './src/home';
import {Toast} from './src/misc';
import EditProfile from './src/settings/edit/EditProfile';
import {AudioPlayer} from './src/audio_player';
import VideoPlayer from './src/video_player/VideoPlayer';
import {CropEditor} from './src/crop_editor';
import {Overlays} from './src/shared/enum/Overlays';
import {PictureInPictureVideo} from './src/overlays';
import {Drawers} from './src/navigation/screens/drawers';
import {PdfContentTable, PdfViewer} from './src/pdf_viewer';
import FileMenu from './src/overlays/FileMenu';
import {Modals} from './src/navigation/screens/modals';
import {Login, CreateAccount, GetStarted} from './src/onboarding';
import UserMenu from './src/home/misc/header/UserMenu';
import {FileDrawer} from './src/navigation';
import {mainRoot, onBoardingRoot} from './src/navigation/roots';
import {OnBoardingScreens} from './src/onboarding/screens';
import GenericFileDetails from './src/home/files/details/GenericFileDetails';
import ShareModal from './src/misc/ShareModal';
import ProgressIndicator from './src/misc/ProgressIndicator';
import emitter from './src/utils/emitter';
import CopyModal from './src/misc/CopyModal';
import Pricing from './src/overlays/Pricing';
import EditModal from './src/misc/EditModal';
import GenericModal from './src/home/modals/GenericModal';
import Rotation from './src/misc/Rotation';
import axios from 'axios';
import {mmkv} from './src/store/mmkv';
import {axiosInstance} from './src/shared/requests/axiosInstance';

import authState from './src/store/authStore';

LogBox.ignoreLogs(['ViewPropTypes', 'source.uri']);

Navigation.setDefaultOptions({
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
  sideMenu: {
    right: {
      enabled: true,
    },
    left: {
      enabled: false,
    },
  },
  layout: {
    backgroundColor: 'transparent',
  },
  modalPresentationStyle: 'overCurrentContext',
});

Navigation.registerComponent(
  Overlays.PICTURE_IN_PICTURE_VIDEO,
  () => PictureInPictureVideo,
);

Navigation.registerComponent('F', () => gestureHandlerRootHOC(Rotation));

// On boarding screens
Navigation.registerComponent(OnBoardingScreens.GET_STARTED, () => GetStarted);
Navigation.registerComponent(OnBoardingScreens.LOGIN, () => Login);
Navigation.registerComponent(
  OnBoardingScreens.CREATE_ACCOUNT.toString(),
  () => CreateAccount,
);

Navigation.registerComponent(Screens.PDF_READER, () => PdfViewer);
Navigation.registerComponent(Drawers.PDF_CONTENT_DRAWER, () => PdfContentTable);

Navigation.registerComponent(Screens.AUDIO_PLAYER, () =>
  gestureHandlerRootHOC(AudioPlayer),
);

Navigation.registerComponent(Screens.VIDEO_PLAYER, () => VideoPlayer);

Navigation.registerComponent(Screens.MY_UNIT, () =>
  gestureHandlerRootHOC(Home),
);

Navigation.registerComponent(Screens.CAMERA, () => Camera);

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

Navigation.registerComponent('Edit', () => gestureHandlerRootHOC(EditProfile));

Navigation.registerComponent(Screens.EDITOR, () =>
  gestureHandlerRootHOC(CropEditor),
);

// Miscelaneous
Navigation.registerComponent(Screens.TOAST, () => Toast);

Navigation.registerComponent(
  Modals.CREATE_FOLDER_MODAL,
  () => CreateFolderModal,
);

Navigation.registerComponent(Modals.FILE_MENU, () =>
  gestureHandlerRootHOC(FileMenu),
);

Navigation.registerComponent('SM', () => ShareModal);

Navigation.registerComponent(Screens.GENERIC_DETAILS, () => GenericFileDetails);

Navigation.registerComponent(
  Overlays.PROGRESS_INDICATOR,
  () => ProgressIndicator,
);

Navigation.registerComponent(Screens.LEFT_DRAWER, () => FileDrawer);

Navigation.registerComponent(Modals.GENERIC_DIALOG, () => GenericModal);

Navigation.registerComponent('UserMenu', () => UserMenu);

Navigation.registerComponent('Copy', () => CopyModal);

Navigation.registerComponent('PS', () => gestureHandlerRootHOC(Pricing));

Navigation.registerComponent('M', () => EditModal);

Navigation.events().registerAppLaunchedListener(async () => {
  const tokenString = mmkv.getString('tokens');

  if (!tokenString) {
    Navigation.setRoot(onBoardingRoot);
    return;
  }

  const tokens = JSON.parse(tokenString);
  try {
    await axios.post(
      'http://192.168.42.232:8080/api/v1/auth/introspect',
      undefined,
      {
        params: {
          refresh_token: tokens.refreshToken,
        },
      },
    );
  } catch (e) {
    if (e.response.status === 404) {
      Navigation.setRoot(onBoardingRoot);
      return;
    }
  }

  try {
    if (authState.user.id === undefined) {
      const {data: user} = await axiosInstance.get('/api/v1/users/me');

      authState.user = user;
      authState.tokens = tokens;

      Navigation.setRoot(mainRoot);
    }
  } catch (e) {
    Navigation.setRoot(onBoardingRoot);
  }
});

// Global event listeners
Navigation.events().registerComponentWillAppearListener(e => {
  if (e.componentName === Screens.MY_UNIT) {
    emitter.emit('show');
    return;
  }

  const removalScreens = [
    Screens.AUDIO_PLAYER,
    Screens.VIDEO_PLAYER,
    Screens.PDF_READER,
    Screens.GENERIC_DETAILS,
    Screens.EDITOR,
    Screens.IMAGE_DETAILS,
    Screens.SETTINGS,
  ];

  if (removalScreens.includes(e.componentName)) {
    emitter.emit('hide');
  }
});

Navigation.events().registerModalDismissedListener(e => {
  if (e.componentName === Screens.IMAGE_DETAILS) {
    emitter.emit('show');
  }
});
