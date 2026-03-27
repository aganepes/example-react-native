import React, { act, useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  useColorScheme,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as SystemUI from 'expo-system-ui';
import NotificationUtils from '@/utils/notification';
import { tracks } from '@/contents/sound';


export default function Player() {
  const [index, setIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [sourceImage, setSourceImage] = useState(tracks[0].image);
  const [title, setTitle] = useState<string>(tracks[0].title);
  const [isPlaying, setIsPlaying] = useState(false);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Play sound
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    } else {
      if (status.error) {
        console.log(`Hata ýüze çykdy: ${status.error}`);
      }
    }
  };
  const playSound = async (i: number) => {
    if (isPlaying) {
      if (sound) await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(
        tracks[i].sound
      );
      setSound(newSound);
    } else {
      sound?.pauseAsync();
    }
  };

  useEffect(() => {
    setSourceImage(tracks[index].image);
    setTitle(tracks[index].title);
    setIsPlaying(false);
  }, [index]);

  useEffect(() => {
    playSound(index);
  }, [isPlaying, index]);

  // Theme
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? '#000' : '#fff');
  }, [isDark]);

  useEffect(() => {
    // Notification create
    Notifications.setNotificationCategoryAsync('music-controls', [
      { identifier: 'PREV', buttonTitle: '⏪ Prev', options: { opensAppToForeground: false } },
      { identifier: 'PLAY', buttonTitle: ' ⏯ ', options: { opensAppToForeground: true } },
      { identifier: 'NEXT', buttonTitle: 'Next ⏩', options: { opensAppToForeground: false } },
    ]);

    // Notification listener
    const sub = Notifications.addNotificationResponseReceivedListener(
      async (res) => {
        const action = res.actionIdentifier;
        const data = res.notification.request.content.data as { index: number };
        let i = data.index ?? 0;

        if (action === 'NEXT') i = (i + 1) % tracks.length;
        if (action === 'PREV') i = i === 0 ? tracks.length - 1 : i - 1;
        setIndex(i);
        if (action === 'PLAY') {
          setIsPlaying(state => !state);
        }
      }
    );

    return () => sub.remove();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#000' : '#fff',
      }}
    >
      {/* Image */}
      <Image
        source={sourceImage}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      />

      {/* Text */}
      <Text
        style={{
          color: isDark ? '#fff' : '#000',
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        {title}
      </Text>
      <View style={{ flexDirection: "row", gap: 5, marginBlock: 20 }}>
        {/* Controls */}
        <Button
          title="⏮ Prev"
          onPress={() =>
            setIndex((prev) =>
              prev === 0 ? tracks.length - 1 : prev - 1
            )
          }
        />

        <Button title="▶️ Play/Pause" onPress={() => setIsPlaying(state => !state)} />
        <Button
          title="Next ⏭"
          onPress={() =>
            setIndex((prev) => (prev + 1) % tracks.length)
          }
        />
      </View>

      {/* Notification button */}
      <Button
        title="Notification aç"
        onPress={() => NotificationUtils.showPlayerNotification(index)}
      />
    </View>
  );
}