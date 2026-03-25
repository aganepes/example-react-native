import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterData, TUser } from '@/types/user';
import NatificationUtils from '@/utils/natification';

export type TypeState = {
  user: RegisterData | null,
  isLoading: boolean,
  error: string | null,
  clearError: () => void,
  fetchUser: () => Promise<void>,
  register: (user: RegisterData) => Promise<void>,
  login: (username: string, password: string) => Promise<void>,
  logout: () => Promise<void>
}

const useLoginStore = create<TypeState>((set) => ({
  isLoading: false,
  user: null,
  error: null,
  clearError: () => set({ error: null }),
  register: async (userData: RegisterData) => {
    try {
      set({ isLoading: true, error: null, user: null });
      const pushToken = await NatificationUtils.getPushTokenAsync();
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL!}/auth/register`, {
        method: "post",
        headers: {
          "Context-Type": "application/json"
        },
        body: JSON.stringify({ type: 'mobile', user: userData, pushToken })
      });
      const result = await response.json();
      if (!result.success) {
        set({ error: result.message });
        return;
      }
      //! tokens
      const { accessToken, refreshToken, user } = result as { user: TUser, accessToken: any, refreshToken: any };
      await AsyncStorage.setItem('user', JSON.stringify({ user: { id: user.id, username: userData.username }, accessToken, refreshToken }));
      set({ user });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isLoading: false });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (username: string, password: string) => {
    try {
      set({ isLoading: true, error: null, user: null });
      if (!username || !password) {
        set({ error: 'Username and password required', isLoading: false });
        return;
      }
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL!}/auth/login`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'mobile', username, password })
      });
      const result = await response.json();
      if (!result.success) {
        set({ error: result.message, isLoading: false });
        return;
      }
      //! tokens
      const { accessToken, refreshToken, user } = result as { user: TUser, accessToken: any, refreshToken: any };
      await AsyncStorage.setItem('user', JSON.stringify({ user: { id: user.id, username: user.username }, accessToken, refreshToken }));
      set({ user });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    set({ user: null, isLoading: true, error: null });
    await AsyncStorage.removeItem('user');
    set({ isLoading: false });
  },
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    let { user, accessToken, refreshToken } = await AsyncStorage.getItem('user') as any;
    try {
      let response = await fetch(`${process.env.EXPO_PUBLIC_API_URL!}/auth/me`, {
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      let result = await response.json();
      if (result.success) {
        return;
      }
      response = await fetch(`${process.env.EXPO_PUBLIC_API_URL!}/auth/refresh-token`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ user })
      });
      result = await response.json();
      if (!result.success) {
        set({ user: null, isLoading: false });
        return;
      }
      //! tokens
      await AsyncStorage.setItem('user', JSON.stringify({ user, accessToken: result.accessToken, refreshToken }));
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      }
    } finally {
      set({ isLoading: false });
    }
  }
}));
export default useLoginStore;