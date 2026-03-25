import { Stack, useNavigation } from 'expo-router';
import useLoginStore from '@/store/loginStore';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

function useNotificationObserver(router: any) {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === 'string') {
        router.push(url);
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}


const Layout = () => {
  const { fetchUser } = useLoginStore();
  const router = useNavigation();
  // useNotificationObserver(router)
  useEffect(() => {
    fetchUser()
  }, []);
  return <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
}

export default Layout;