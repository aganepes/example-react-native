import { Stack, useRouter } from 'expo-router';
import NatificationUtils from '@/utils/notification'

const Layout = () => {
  const router = useRouter();
  
  NatificationUtils.useNotificationObserver(router);

  return <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
}

export default Layout;