import {Navigation} from 'react-native-navigation';
import {File, Folder} from '../../shared/types';
import {Modals} from '../screens/modals';

type OptionProps = {
  file: File | Folder;
  isModal: boolean;
  fromDetails: boolean;
  parentFolderId: string;
  previousComponentId: string;
};

export const displayFileOptions = (options: OptionProps) => {
  Navigation.showModal<OptionProps>({
    component: {
      name: Modals.FILE_MENU,
      passProps: options,
    },
  });
};
