import { useState, useEffect } from 'react';
import { Text, View, Platform, StyleSheet, TextInput, Pressable, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationUtils from '@/utils/notification';
import { useRouter } from 'expo-router';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const [title, setTitle] = useState<string>('');
  const router = useRouter();
  
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
      NotificationUtils.getPushTokenAsync().then(token => setExpoPushToken(token || ''));
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    return () => {
      notificationListener.remove();
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
        <View style={{gap:10}}>
          <Button title='to alarm notification' onPress={()=>router.navigate('/(notifications)/alarm')}/>
          <Button title='to player notification' onPress={()=>router.navigate('/(notifications)/player')}/>
          <Button title='to push notification' onPress={()=>router.navigate('/(notifications)/removePush')}/>
          
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