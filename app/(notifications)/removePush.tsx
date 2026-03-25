
import { useState, useEffect} from 'react';
import { Text, View, Platform,  TextInput, Pressable, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationUtils from '@/utils/natification';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token: any) => {
      if (token) {
        setExpoPushToken(token);
        try {
          console.log(token)
          console.log(`${process.env.EXPO_PUBLIC_API_URL}/users/register-token`)
          const resp = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/register-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: 1, expo_token: token })
            });
          console.log(await resp.json());
        } catch (error) {
          console.error(error)
        }

      }
    });

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(async response => {
      console.log('Kabul edildi...');
      const { actionIdentifier, notification } = response;
      if (actionIdentifier === "play") {
        console.log("Play button pressed");
      }
      if (actionIdentifier === 'pause') {
        console.log("Pause button pressed");
      }
      if (actionIdentifier === 'stop') {
        console.log('Stop button pressed')
      }
      if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        console.log('Notification tapped');
        // Linking.openURL('https://www.google.com/maps/search/?api=1&query=Ashgabat')
        // Linking.openSettings()
        // Linking.openURL('sms://+99262295942')
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>

        <Text>{`Channels: ${JSON.stringify(channels.map(c => c.id), null, 2)}`}</Text>
        <Text style={styles.text}>Your expo push token: {expoPushToken || 'Empty push token'}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Text style={styles.text}>Title: {notification && notification.request.content.title} </Text>
        </View>
        <View style={{ width: '90%', padding: 10, gap: 12 }}>
          {/*  */}
          <TextInput style={styles.input} placeholder='input to notification title' onChangeText={setTitle} value={title} />
          {/*  */}
          <Pressable style={styles.button}
            onPress={() => NotificationUtils.scheduleWarningNotification(title)}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>To default notification</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: "Time New"
  },
  button: {
    padding: 10,
    width: "100%"
  },
  input: {
    paddingBlock: 5,
    paddingInline: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    color: 'gray'
  }
})