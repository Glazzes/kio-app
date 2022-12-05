import notifee from '@notifee/react-native';

type NotificationOptions = {
  id?: string;
  channelId?: string;
  title: string;
  body: string;
};

type NotificationInfo = {
  id: string;
  channelId: string;
};

export const displayNotification = async (
  options: NotificationOptions,
): Promise<NotificationInfo> => {
  let channelId = '';
  if (options.channelId) {
    channelId = options.channelId;
  } else {
    channelId = await notifee.createChannel({id: 'Kio', name: 'Kio'});
  }

  if (options.id) {
    await notifee.displayNotification({
      id: options.id,
      title: options.title,
      body: options.body,
      android: {
        channelId,
        onlyAlertOnce: true,
      },
    });

    return {id: options.id, channelId};
  }

  const notiId = await notifee.displayNotification({
    title: options.title,
    body: options.body,
    android: {
      channelId,
      onlyAlertOnce: true,
    },
  });

  return {id: notiId, channelId};
};
