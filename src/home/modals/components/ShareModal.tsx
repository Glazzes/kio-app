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
import Contributor from '../../../misc/Contributor';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {FlatList} from 'react-native-gesture-handler';
import ModalWrapper from './ModalWrapper';
import {axiosInstance} from '../../../shared/requests/axiosInstance';
import {
  apiFoldersContributorExistsUrl,
  apiFoldersContributorsUrl,
  apiUsersUrl,
} from '../../../shared/requests/contants';
import {Folder, User} from '../../../shared/types';
import UserSearch from '../../../misc/UserSearch';
import authState from '../../../store/authStore';
import {
  coownerAddDuplicateErrorMessage,
  coownerAddSelfErrorMessage,
  coownerAddSuccessMessage,
  coownerAlreadyExist,
  displayToast,
  genericErrorMessage,
} from '../../../shared/toast';
import Button from '../../../shared/components/Button';
import {
  ContributorAddRequest,
  ContributorExistsRequest,
} from '../../../shared/requests/types';
import {Permissions} from '../../../shared/enums';
import {emitAddContributors} from '../../../shared/emitter';
import {AxiosResponse} from 'axios';

type ShareModalProps = {
  folder: Folder;
};

const {width} = Dimensions.get('window');
const WIDTH = width * 0.8;

function keyExtractor(item: User): string {
  return `possible-coowner-${item.id}`;
}

function SeperatorComponent() {
  return <View style={styles.seperator} />;
}

const ShareModal: NavigationFunctionComponent<ShareModalProps> = ({
  componentId,
  folder,
}) => {
  const inputRef = useRef<TextInput>(null);

  const [user, setUser] = useState<User | null>(null);
  const [text, setText] = useState<string>('');
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [isStyping, setIsStyping] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [coowners, setCoowners] = useState<User[]>([]);

  const renderItem = (info: ListRenderItemInfo<User>) => {
    const onPress = () => {
      setCoowners(c => c.filter(it => it.id !== info.item.id));
    };

    return (
      <Contributor
        index={info.index}
        user={info.item}
        imageUrl={
          'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.LVUsQvGdfnFcFKg-gzyYPQHaHa%26pid%3DApi&f=1&ipt=6be12d8c86e995e4d9b3dbbd629edd3a7af2e072c0968cccedf082b8ebc67829&ipo=images'
        }
        name={'glaze'}
        onPress={onPress}
      />
    );
  };

  const onChangeText = (value: string) => {
    setIsStyping(true);
    setText(value);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(async () => {
      try {
        const {data} = await axiosInstance.get<User>(apiUsersUrl, {
          params: {
            q: value,
          },
        });

        setUser(data);
      } catch (e) {
        setUser(null);
      } finally {
        setHasFetched(true);
        setIsStyping(false);
        clearTimeout(newTimer);
      }
    }, 600);

    setTimer(newTimer);
  };

  const addCoowner = async () => {
    Keyboard.dismiss();

    if (
      text.toLocaleLowerCase() === authState.user.username.toLocaleLowerCase()
    ) {
      displayToast(coownerAddSelfErrorMessage);
      return;
    }

    const isDuplicate = coowners.some(c => c.id === user?.id);
    if (isDuplicate) {
      displayToast(coownerAddDuplicateErrorMessage);
      return;
    }

    try {
      inputRef.current?.clear();
      setText('');

      setCoowners(prev => {
        if (user) {
          return [user, ...prev];
        }

        return prev;
      });
      setUser(null);
      return;
    } catch ({response}) {
      const res = response as AxiosResponse;
      if (res.status === 404) {
        displayToast(coownerAlreadyExist);
        return;
      }
    }
  };

  const dissmis = () => {
    Navigation.dismissModal(componentId);
    Keyboard.dismiss();
  };

  const share = async () => {
    try {
      const request: ContributorAddRequest = {
        folderId: folder.id,
        contributorIds: coowners.map(u => u.id),
        permissions: [Permissions.READ_ONLY],
      };

      const {data} = await axiosInstance.post<User[]>(
        apiFoldersContributorsUrl,
        request,
      );

      dissmis();
      displayToast(coownerAddSuccessMessage);
      emitAddContributors(folder.id, data);
    } catch (e) {
      displayToast(genericErrorMessage);
    }
  };

  return (
    <View style={styles.root}>
      <ModalWrapper style={styles.modal} witdh={WIDTH}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Share "{folder.name}"</Text>
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
              autoCapitalize={'none'}
            />
          </View>
          <Button
            text={'Add'}
            disabled={user === null || isStyping}
            width={60}
            extraStyle={styles.addButton}
            onPress={addCoowner as any}
          />
        </View>

        {isStyping && (
          <View style={styles.placeHolderContainer}>
            <SkeletonPlaceholder speed={1200}>
              <View style={styles.row}>
                <SkeletonPlaceholder.Item
                  width={50}
                  height={50}
                  borderRadius={25}
                />
                <View style={styles.itemContainer}>
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

        {!isStyping && hasFetched && text !== '' && user === null && (
          <View style={styles.noResultContainer}>
            <Text>No results found for "{text}"</Text>
          </View>
        )}

        {!isStyping && hasFetched && user !== null && text !== '' && (
          <UserSearch user={user} />
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
          <Button
            width={WIDTH / 2 - 15}
            disabled={coowners.length === 0}
            text={'Confirm'}
            onPress={share}
            extraStyle={styles.button}
          />
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
  row: {
    flexDirection: 'row',
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
  itemContainer: {
    height: 50,
    justifyContent: 'space-around',
    marginLeft: 10,
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
