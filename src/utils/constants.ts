import {Dimensions} from 'react-native';
import {Navigation} from 'react-native-navigation';

const {bottomTabsHeight} = Navigation.constantsSync();
const {width, height} = Dimensions.get('window');
const actualHeight = height - bottomTabsHeight;

export {actualHeight};
