import {Navigation} from 'react-native-navigation';
import {Modals} from '../screens/modals';

type GenericModalProps = {
  title: string;
  message: string;
  action: () => void;
};

export const displayGenericModal = (props: GenericModalProps) => {
  Navigation.showModal<GenericModalProps>({
    component: {
      name: Modals.GENERIC_DIALOG,
      passProps: {...props},
    },
  });
};
