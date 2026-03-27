import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import useLoginStore from '@/store/loginStore';

const LayoutTabs = () => {
  const { user, fetchUser } = useLoginStore();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) router.push('/(auth)/register');
  }, [user, router, fetchUser]);
  return <Tabs screenOptions={{ headerShown: true, animation: "shift" }} />
}

export default LayoutTabs;