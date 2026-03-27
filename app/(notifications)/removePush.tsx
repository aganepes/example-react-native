
import { useState, useEffect } from 'react';
import { useSegments } from 'expo-router';
import { Text, View, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationUtils from '@/utils/notification';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [body, setBody] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const segments = useSegments();
  async function sendPushNotification(expoPushToken: string, title: string, page: string) {
    const message = {
      to: expoPushToken,
      title: title || 'Original Title',
      body: `${page} page and here is the body!`,
      data: { url: page },
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    const data = await response.json();
    console.warn('Response: ', data);
  }

  useEffect(() => {
    NotificationUtils.getPushTokenAsync().then(token => {
      setExpoPushToken(token || '');
      console.warn("Token: ", token);
    });
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Text style={styles.text}>Your expo push token: {expoPushToken || 'Empty push token'}</Text>
        </View>
        <View style={{ width: '90%', padding: 10, gap: 12 }}>
          {/*  */}
          <TextInput style={styles.input} placeholder='input to notification title' onChangeText={setTitle} value={title} placeholderTextColor={"#505751"} />
          <Text style={{ fontSize: 10, color: 'green' }}>Pages: {JSON.stringify(segments, null, 2)}</Text>
          <TextInput style={styles.input} placeholder='input to page' onChangeText={setBody} value={body} placeholderTextColor={"#505751"} />
          {/*  */}
          <Pressable style={styles.button}
            onPress={() => sendPushNotification(expoPushToken, title, body)}>
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
    width: "100%",
    backgroundColor: "#3A5F3E",
    color: "#ffffff"
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