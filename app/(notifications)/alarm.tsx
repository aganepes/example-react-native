import { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Text, View, Button, Platform, ScrollView } from 'react-native';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, schedulePushNotification, scheduleLocalNotification, scheduleLocalSecondNotification, showMediaNotification, sendImageNotification } from '@/utils/natification';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const nativation = useNavigation();

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token:any) => {
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
        <Text>Your expo push token: {expoPushToken}</Text>
        <Text>{`Channels: ${JSON.stringify(channels.map(c => c.id), null, 2)}`}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
          title='to Gallery'
          onPress={() => nativation.navigate('/gallery')}
        />
        <ScrollView style={{ backgroundColor: "gray", gap: 10, marginTop: 20, padding: 10 }}>
          <Text style={{ fontSize: 16, fontFamily: "Time New" }}></Text>
          <Button
            title="Press to schedule a notification"
            onPress={async () => await schedulePushNotification('Selam!', "Bu salamlaşmak üçin ugradyldy.", { data: 'Bu mugalumat' })}
          />
          <Button
            title='to show local notification'
            onPress={async () => await scheduleLocalNotification('Local notification title', 'Local notification body', { localData: 'local data' })}
          />
          <Button
            title='to show 5 minut local notification'
            onPress={async () => await scheduleLocalSecondNotification('5 sekundan gelýär')}
          />
          <Button
            title='to show player notification'
            onPress={async () => await showMediaNotification()}
          />
          <Button
            title='to show Image notification'
            onPress={async () => await sendImageNotification()}
          />
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}
