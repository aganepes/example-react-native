import { useState } from 'react';
import { Text, View, Button,  TextInput } from 'react-native';
import NotificationUtils from '@/utils/notification';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SystemUI from 'expo-system-ui';

export default function AlarmComponent() {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [title, setTitle] = useState('');

  // Background color (opsiyonel)
  SystemUI.setBackgroundColorAsync('#fff');

  const onChange = (event:any, selectedDate:any) => {
    setShowPicker(false);
    if (selectedDate) {
      setTime(selectedDate);
    }
  };

  const setAlarm = async () => {
    if (!title) {
      alert('Title gir!');
      return;
    }

    await NotificationUtils.scheduleAlarmNotification(title,time);

    alert('Alarm guruldy!');
  };

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text>Alarm Title:</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Mysal: Oyan!"
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
          borderRadius: 8,
        }}
      />

      <Text>Wagt: {time.toLocaleTimeString()}</Text>

      <Button title="Wagty sayla" onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="clock"
          onChange={onChange}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Alarm gur" onPress={setAlarm} />
      </View>
    </SafeAreaView>
  );
}