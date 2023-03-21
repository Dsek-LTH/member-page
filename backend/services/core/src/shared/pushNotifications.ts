import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import createLogger from './logger';

const notificationsLogger = createLogger('notifications');
async function sendPushNotifications(
  tokens: string[],
  title: string,
  body: string,
  type: string,
  link: string,
) {
  const expo = new Expo();

  const messages: ExpoPushMessage[] = [];
  tokens.forEach((token) => {
    if (!Expo.isExpoPushToken(token)) {
      notificationsLogger.error(
        `Push token ${token} is not a valid Expo push token`,
      );
    } else {
      const message: ExpoPushMessage = {
        to: token,
        title,
        body,
        channelId: type,
        data: { link },
      };
      messages.push(message);
    }
  });
  if (messages.length === 0) {
    return;
  }

  const chunks = expo.chunkPushNotifications(messages);
  for (let i = 0; i < chunks.length; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const pushTickets = await expo.sendPushNotificationsAsync(
        chunks[i],
      );
      notificationsLogger.info(JSON.stringify(pushTickets));
    } catch (error) {
      notificationsLogger.error(error);
    }
  }
}

export default sendPushNotifications;
