import { Stack, useRouter } from 'expo-router';
import useLoginStore from '@/store/loginStore';
import { useEffect } from 'react';
import NatificationUtils from '@/utils/natification'

const Layout = () => {
  const { user, fetchUser } = useLoginStore();
  const router = useRouter();

  NatificationUtils.useNotificationObserver(router);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) router.push('/(auth)/register');
  }, [user, router, fetchUser]);

  return <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
}

export default Layout;