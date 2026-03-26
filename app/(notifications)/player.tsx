import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  useColorScheme,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import * as SystemUI from 'expo-system-ui';
import NotificationUtils from '@/utils/notification';
import { tracks } from '@/contents/sound';


export default function Player() {
  const [index, setIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound|null>(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // 🎨 Theme
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? '#000' : '#fff');
  }, [isDark]);

  useEffect(() => {
    // 🔔 Notification create
    NotificationUtils.requestPermissions();
    Notifications.setNotificationCategoryAsync('music-controls', [
      { identifier: 'prev', buttonTitle: '⏪ Prev', options: { opensAppToForeground: false } },
      { identifier: 'pause', buttonTitle: '⏸ Play', options: { opensAppToForeground: true } },
      { identifier: 'next', buttonTitle: '⏩ Next', options: { opensAppToForeground: false } },
    ]);
    
    // 🔔 Notification listener
    const sub = Notifications.addNotificationResponseReceivedListener(
      async (res) => {
        const action = res.actionIdentifier;
        const data = res.notification.request.content.data as { index: number };
        let i = data.index ?? 0;

        if (action === 'NEXT') i = (i + 1) % tracks.length;
        if (action === 'PREV')
          i = i === 0 ? tracks.length - 1 : i - 1;

        setIndex(i);

        if (action === 'PLAY') {
          await playSound(i);
        }
        // 🔔 Show notification
        NotificationUtils.showPlayerNotification(i); // 🔄 update notification
      }
    );

    return () => sub.remove();
  }, []);

  // 🔊 Play sound
  const playSound = async (i:number) => {
    if (sound) await sound.unloadAsync();

    const { sound: newSound } = await Audio.Sound.createAsync(
      tracks[i].sound
    );

    setSound(newSound);
    await newSound.playAsync();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#000' : '#fff',
      }}
    >
      {/* 🖼 Image */}
      <Image
        source={tracks[index].image}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      />

      {/* 📝 Text */}
      <Text
        style={{
          color: isDark ? '#fff' : '#000',
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        {tracks[index].title}
      </Text>

      {/* 🎮 Controls */}
      <Button title="▶️ Play" onPress={() => playSound(index)} />
      <Button
        title="⏭ Next"
        onPress={() =>
          setIndex((prev) => (prev + 1) % tracks.length)
        }
      />
      <Button
        title="⏮ Prev"
        onPress={() =>
          setIndex((prev) =>
            prev === 0 ? tracks.length - 1 : prev - 1
          )
        }
      />

      {/* 🔔 Notification */}
      <Button
        title="Notification aç"
        onPress={() => NotificationUtils.showPlayerNotification(index)}
      />
    </View>
  );
}