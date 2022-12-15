import 'react-native-reanimated';
import {LogBox} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Screens} from './src/enums/screens';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import Notifications from './src/notifications/Notifications';
import {Profile, EditProfile} from './src/settings';
import ImageDetails from './src/home/files/details/ImageDetails';
import {Home} from './src/home';
import {Toast} from './src/misc';
import {AudioPlayer} from './src/audio_player';
import VideoPlayer from './src/video_player/VideoPlayer';
import {CropEditor} from './src/crop_editor';
import {Overlays} from './src/shared/enum/Overlays';
import {Drawers} from './src/navigation/screens/drawers';
import {PdfContentTable, PdfViewer} from './src/pdf_viewer';
import {Modals} from './src/navigation/screens/modals';
import {Login, CreateAccount, GetStarted} from './src/onboarding';
import {
  ShareModal,
  CopyModal,
  CreateFolderModal,
  EditModal,
  GenericDialogModal,
} from './src/home/modals';
import {FileDrawer} from './src/navigation';
import {mainRoot, onBoardingRoot} from './src/navigation/roots';
import {OnBoardingScreens} from './src/onboarding/screens';
import GenericFileDetails from './src/home/files/details/GenericFileDetails';
import emitter from './src/shared/emitter';
import {mmkv} from './src/store/mmkv';
import {axiosInstance} from './src/shared/requests/axiosInstance';
import authState from './src/store/authStore';
import {
  apiAuthTokenIntrospectUrl,
  apiUsersMeUrl,
} from './src/shared/requests/contants';
import {
  FileOptionsSheet,
  PictureInPictureVideo,
  PricingSheet,
} from './src/overlays';
import UserMenu from './src/home/header/components/UserMenu';
import {Camera} from './src/camera';

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

// On boarding screens
Navigation.registerComponent(OnBoardingScreens.GET_STARTED, () => GetStarted);
Navigation.registerComponent(OnBoardingScreens.LOGIN, () => Login);
Navigation.registerComponent(
  OnBoardingScreens.CREATE_ACCOUNT,
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

Navigation.registerComponent(Screens.NOTIFICATIONS, () =>
  gestureHandlerRootHOC(Notifications),
);

Navigation.registerComponent(Screens.SETTINGS, () =>
  gestureHandlerRootHOC(Profile),
);

Navigation.registerComponent(Screens.EDIT_PROFILE, () =>
  gestureHandlerRootHOC(EditProfile),
);

Navigation.registerComponent(Screens.EDITOR, () =>
  gestureHandlerRootHOC(CropEditor),
);

// Miscelaneous
Navigation.registerComponent(Screens.TOAST, () => Toast);

Navigation.registerComponent(Screens.GENERIC_DETAILS, () => GenericFileDetails);

Navigation.registerComponent(Screens.FILE_DRAWER, () => FileDrawer);
Navigation.registerComponent('UserMenu', () => UserMenu);

// Modals
Navigation.registerComponent(Modals.GENERIC_DIALOG, () => GenericDialogModal);
Navigation.registerComponent(Modals.COPY, () => CopyModal);
Navigation.registerComponent(Modals.EDIT, () => EditModal);
Navigation.registerComponent(Modals.CREATE_FOLDER, () => CreateFolderModal);
Navigation.registerComponent(Modals.SHARE, () => ShareModal);
Navigation.registerComponent(Modals.PRICING, () =>
  gestureHandlerRootHOC(PricingSheet),
);
Navigation.registerComponent(Modals.FILE_MENU, () =>
  gestureHandlerRootHOC(FileOptionsSheet),
);

Navigation.events().registerAppLaunchedListener(async () => {
  const tokenString = mmkv.getString('tokens');

  if (!tokenString) {
    Navigation.setRoot(onBoardingRoot);
    return;
  }

  const tokens = JSON.parse(tokenString);
  try {
    await axiosInstance.post(apiAuthTokenIntrospectUrl, undefined, {
      params: {
        refresh_token: tokens.refreshToken,
      },
    });
  } catch (e) {
    if (e.response.status === 404) {
      Navigation.setRoot(onBoardingRoot);
      return;
    }
  }

  try {
    if (authState.user.id === undefined) {
      const {data: user} = await axiosInstance.get(apiUsersMeUrl);

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
    Modals.CREATE_FOLDER,
    Modals.SHARE,
    Modals.PRICING,
  ];

  if (removalScreens.includes(e.componentName)) {
    emitter.emit('hide');
  }
});

Navigation.events().registerModalDismissedListener(e => {
  const popScreens = [
    Screens.IMAGE_DETAILS,
    Modals.CREATE_FOLDER,
    Modals.SHARE,
    Modals.PRICING,
  ];

  if (popScreens.includes(e.componentName)) {
    emitter.emit('show');
  }
});
