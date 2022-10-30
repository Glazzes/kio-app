import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  Keyboard,
  ListRenderItemInfo,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Contributor from './Contributor';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {FlatList} from 'react-native-gesture-handler';
import ModalWrapper from '../shared/components/ModalWrapper';

type ShareModalProps = {};

const {width} = Dimensions.get('window');
const WIDTH = width * 0.85;

/*
const photos = [
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg',
  'https://randomuser.me/api/portraits/men/81.jpg',
  'https://randomuser.me/api/portraits/men/68.jpg',
];
*/

function renderItem(info: ListRenderItemInfo<string>) {
  return <Contributor index={info.index} imageUrl={info.item} name={'glaze'} />;
}

function keyExtractor(item: string, index: number): string {
  return `${item}-${index}`;
}

function SeperatorComponent() {
  return <View style={styles.seperator} />;
}

const ShareModal: NavigationFunctionComponent<ShareModalProps> = ({
  componentId,
}) => {
  const inputRef = useRef<TextInput>(null);

  const [coowners, setCoowners] = useState<string[]>([]);
  const [text, setText] = useState<string>('');
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [isStyping, setIsStyping] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const onChangeText = (value: string) => {
    setIsStyping(true);
    setText(value);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(_ => setIsStyping(false))
        .catch(() => console.log('sos'))
        .finally(() => setHasFetched(true));
    }, 1000);

    setTimer(newTimer);
  };

  const addCoowner = () => {
    inputRef.current?.clear();
    setText('');

    setCoowners(c => [
      ...c,
      'https://randomuser.me/api/portraits/women/10.jpg',
    ]);
  };

  const dissmis = () => {
    Navigation.dismissModal(componentId);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.root}>
      <ModalWrapper style={styles.modal}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Share file</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-at'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              ref={inputRef}
              onChangeText={onChangeText}
              style={styles.input}
              placeholder={'Email / Username'}
            />
          </View>
          <Pressable style={styles.addButton} onPress={addCoowner}>
            <Text style={styles.buttonText}>Add</Text>
          </Pressable>
        </View>

        {isStyping && (
          <View style={styles.placeHolderContainer}>
            <SkeletonPlaceholder speed={1200}>
              <View style={{flexDirection: 'row'}}>
                <SkeletonPlaceholder.Item
                  width={50}
                  height={50}
                  borderRadius={25}
                />
                <View
                  style={{
                    height: 50,
                    justifyContent: 'space-around',
                    marginLeft: 10,
                  }}>
                  <SkeletonPlaceholder.Item
                    height={15}
                    width={width * 0.55}
                    borderRadius={5}
                  />
                  <SkeletonPlaceholder.Item
                    height={15}
                    width={width * 0.3}
                    borderRadius={5}
                  />
                </View>
              </View>
            </SkeletonPlaceholder>
          </View>
        )}

        {!isStyping && hasFetched && text !== '' && (
          <View style={styles.noResultContainer}>
            <Text>No results found for "{text}"</Text>
          </View>
        )}

        {coowners.length > 0 && (
          <View>
            <Text style={styles.listHeader}>Will share with</Text>
            <View style={styles.listContainer}>
              <FlatList
                data={coowners}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={SeperatorComponent}
              />
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={dissmis}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.confirmButton]}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </Pressable>
        </View>
      </ModalWrapper>
    </View>
  );
};

ShareModal.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: WIDTH,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'UberBold',
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  inputContainer: {
    height: 40,
    borderRadius: 5,
    flexDirection: 'row',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
    overflow: 'hidden',
  },
  icon: {
    marginLeft: 10,
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'Uber',
    backgroundColor: '#F3F3F4',
    color: '#C5C8D7',
  },
  addButton: {
    backgroundColor: '#3366ff',
    borderRadius: 5,
    height: 40,
    width: 60,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'UberBold',
    color: '#fff',
    textAlign: 'center',
  },
  placeHolderContainer: {
    marginVertical: 10,
  },
  noResultContainer: {
    marginVertical: 10,
    height: 50,
    justifyContent: 'center',
  },
  listHeader: {
    fontFamily: 'UberBold',
    fontSize: 12,
    marginTop: 10,
  },
  listContainer: {
    height: 50,
    marginVertical: 10,
  },
  seperator: {
    width: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: WIDTH / 2 - 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
  },
  confirmButton: {
    backgroundColor: '#3366ff',
  },
  confirmButtonText: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#EDF1F7',
  },
  cancelButtonText: {
    fontFamily: 'UberBold',
    color: '#c3c3c3',
  },
});

export default ShareModal;