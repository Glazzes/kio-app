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
import DetailsDrawer from './src/navigation/DetailsDrawer';
import EditProfile from './src/settings/edit/EditProfile';
import {AudioPlayer} from './src/audio_player';
import VideoPlayer from './src/video_player/VideoPlayer';
import {CropEditor} from './src/crop_editor';
import {Overlays} from './src/shared/enum/Overlays';
import {PictureInPictureVideo} from './src/overlays';
import {Drawers} from './src/navigation/drawers';
import {PdfContentTable, PdfViewer} from './src/pdf_viewer';
import {GetStarted, Login, CreateAccount} from './src/onboarding';
import FileMenu from './src/overlays/FileMenu';
import {Modals} from './src/navigation/Modals';
import GenericModal from './src/home/modals/GenericModal';
import UserMenu from './src/home/misc/UserMenu';
import {mainRoot, onBoardingRoot} from './src/navigation/roots';
import {OnBoardingScreens} from './src/onboarding/screens';
import Testing from './src/misc/Testing';

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

// OnBoarding screens
Navigation.registerComponent(OnBoardingScreens.GET_STARTED, () => GetStarted);
Navigation.registerComponent(OnBoardingScreens.LOGIN, () => Login);
Navigation.registerComponent(
  OnBoardingScreens.CREATE_ACCOUNT,
  () => CreateAccount,
);

Navigation.registerComponent('Pdf', () => PdfViewer);
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

Navigation.registerComponent(Screens.LEFT_DRAWER, () => DetailsDrawer);

Navigation.registerComponent(Modals.GENERIC_DIALOG, () => GenericModal);

Navigation.registerComponent('UserMenu', () => UserMenu);

Navigation.registerComponent('Testing', () => Testing);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot(mainRoot);
});
