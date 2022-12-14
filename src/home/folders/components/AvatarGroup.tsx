import {View, Text, StyleSheet, ViewStyle, ImageStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import {User} from '../../../shared/types';
import Avatar from '../../../shared/components/Avatar';
import emitter, {getAddContributorsEventName} from '../../../shared/emitter';
import {getFolderCoowners} from '../../utils/functions/getFolderCoowners';

type AvatarGroupProps = {
  parentFolderId: string;
  folderId: string;
  total: number;
};

const SIZE = 35;
const SPACER = 0.6;

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  total: startTotal,
  folderId,
  parentFolderId,
}) => {
  const [total, setTotal] = useState<number>(startTotal);
  const [coowners, setCoowners] = useState<User[]>([]);

  const containerStyles: ViewStyle = {
    height: SIZE,
    width:
      coowners.length <= 1
        ? SIZE
        : SIZE * coowners.length -
          SIZE * (coowners.length - 1) * (1 - SPACER) +
          (coowners.length > 4 ? SIZE * SPACER : 0),
  };

  const plusStyles: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    left: (containerStyles.width as number) - SIZE,
    backgroundColor: '#4389FE',
    padding: 5,
  };

  const addCoowners = (users: User[]) => {
    setTotal(t => t + users.length);
    setCoowners(c => {
      if (coowners.length >= 4) {
        return users.reverse().slice(0, 4);
      }

      const start = c.length;
      const end = Math.min(4, users.length);
      for (let i = start; i <= end; i++) {
        c.push(users[i - start]);
      }

      return c.reverse();
    });
  };

  useEffect(() => {
    const addContributorsFromParentEventName =
      getAddContributorsEventName(parentFolderId);
    const addContributorsFromParentListener = emitter.addListener(
      addContributorsFromParentEventName,
      addCoowners,
    );

    const addContributorsToFolderEventName =
      getAddContributorsEventName(folderId);
    const addContributorsToFolderListener = emitter.addListener(
      addContributorsToFolderEventName,
      addCoowners,
    );

    return () => {
      addContributorsFromParentListener.remove();
      addContributorsToFolderListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, parentFolderId]);

  useEffect(() => {
    getFolderCoowners(folderId, 0).then(({data}) => {
      setCoowners(data.content);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, containerStyles]}>
      {coowners.map((user, index) => {
        const position: ViewStyle & ImageStyle = {
          position: 'absolute',
          top: 0,
          left: index * (SIZE * SPACER),
        };

        return (
          <Avatar
            key={`coowner-${user.id}-${folderId}`}
            size={SIZE}
            user={user}
            listenToUpdateEvent={false}
            includeBorder={true}
            extraStyle={position}
          />
        );
      })}
      {total > 4 ? (
        <View style={[styles.circle, plusStyles]}>
          <Text style={styles.text}>{`${total - 4}+`}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZE,
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    top: 0,
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    borderColor: '#fff',
  },
  text: {
    fontFamily: 'UberBold',
    color: '#fff',
  },
});

export default AvatarGroup;
