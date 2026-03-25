
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

namespace NatificationUtils {
  // Bu kanallar Android üçin ulanylýar, iOS-da kanallar ýok. iOS-da bildirişiň nähili görünjekdigini ulanyjynyň öz telefonyndaky "Sazlamalar" (Settings) bölümi kesgitleýär.
  export const DEFAULT = { id: "default-channel", name: 'Default Channel' };
  export const PUSH = { id: "push-channel", name: "Push Channel" };
  export const CATEGORY = { id: "category-channel", name: "Category Channel" };
  export const LOCAL = { id: "local-channel", name: "Local Channel" };
  // Bu kategoriýa düwmeleri bilen bildirişler üçin ulanylýar. Düwmeler iOS we Android-de işleýär, ýöne Android-de kanala birikdirilmeli.
  export async function initionalize() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
      "handleSuccess": async (arg) => {
        console.log('Ulgam bilen baglanyşykly hereket edildi.', arg);
      },
      "handleError": async (arg) => {
        console.error('Bildiriş bilen baglanyşykly ýalňyşlyk ýüze çykdy:', arg);
      }
    });
    await setupDefaultChannel();
    await setupPushChannel();
    await setupCategoryChannel();
    await setupLocalChannel();
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelGroupAsync('example-notifactions', { name: "Example Notifications" });
    }
    await requestPermissions();
  }

  export async function setupDefaultChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(DEFAULT.id, {
        name: DEFAULT.name,
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC
      });
    }
  }
  export async function setupPushChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(PUSH.id, {
        name: PUSH.name,
        importance: Notifications.AndroidImportance.MAX,
        description: "This is push channel for push notifications",
        groupId: "example-notifactions",
        vibrationPattern: [0, 250, 250, 250],
        enableLights: true,
        lightColor: '#ffffff',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
        sound: "@/assets/notification/universfield.mp3",
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
          contentType: Notifications.AndroidAudioContentType.MOVIE,
        }
      });
    }
  }
  export async function setupCategoryChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CATEGORY.id, {
        name: CATEGORY.name,
        importance: Notifications.AndroidImportance.HIGH,
        description: "This is category channel for notifications with actions",
        groupId: "example-notifactions",
        vibrationPattern: [0, 250, 250, 250],
        enableLights: true,
        lightColor: '#ffffff',
        enableVibrate: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        sound: "@/assets/notification/universfield1.mp3",
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.NOTIFICATION,
          contentType: Notifications.AndroidAudioContentType.SONIFICATION,
        }
      });
    }
  }
  export async function setupLocalChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(LOCAL.id, {
        name: LOCAL.name,
        importance: Notifications.AndroidImportance.LOW,
        description: "This is local channel for local notifications",
        groupId: "example-notifactions",
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
        showBadge: true,
        sound: "default"
      });
    }
  }
  export async function getAllNotificationChannel() {
    return await Notifications.getNotificationChannelsAsync();
  }
  export async function cancelNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
  export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  export async function requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Push token natification rugsat berilmedi!');
        return true;
      }
    }
    alert('Push natification rugsat berilmedi! Hakyky telefon gerekli!');
    return false;
  }

  export async function getPushTokenAsync() {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }

    let token;
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      console.log(projectId);
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      // 
    } catch (e) {
      token = `${e}`;
    }

    return token;
  }

  //? send notifications
  export async function scheduleTimeIntervalNotification(title?: string, body?: string, minut: number = 3, interval: boolean = false) {

    let date = new Date(Date.now() - minut * 60 * 1000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title ?? "This is local notification 🔃.",
        body: body ?? 'Here is the local notification body',
        data: { data: `{minut} minute - dan bildiriş geler.` }
      },
      trigger: interval ? {
        channelId: Platform.OS === "android" ? LOCAL.id : undefined,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: minut * 60,
        repeats: true
      } : {
        channelId: Platform.OS === "android" ? LOCAL.id : undefined,
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date
      }

    });
  }
  export async function scheduleAlarmNotification(title?: string, date?: Date) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title ?? "This is alarm notification 🔔.",
      },
      trigger:{
        channelId: Platform.OS === "android" ? LOCAL.id : undefined,
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date:date ?? new Date(Date.now() - 60 * 1000)
      }
    });
  }
  export async function scheduleWarningNotification(title?: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title ?? "This is default notification and above will remain intact.",
        sticky: true,
      },
      trigger: {
        channelId: DEFAULT.id
      },
    });
  }
  export async function showPlayerNotification() {
    await Notifications.setNotificationCategoryAsync('music-controls', [
      { identifier: 'prev', buttonTitle: '⏪ Forward', options: { opensAppToForeground: false } },
      { identifier: 'pause', buttonTitle: '⏸ Play', options: { opensAppToForeground: true } },
      { identifier: 'next', buttonTitle: '⏩ Next', options: { opensAppToForeground: false } },
    ]);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Häzir çalynýar 🎼",
        body: "Awtory: Kerim Gurbannepesow 🖋",
        categoryIdentifier: 'music-controls',
        sticky: true,
      },
      trigger: {
        channelId: CATEGORY.id
      },
    });
  }
  // push notification backend ugradylmaly.
}

export default NatificationUtils;

/*
! 1. importance (Android-de Esasy Tapawutlandyryjy)
Android-de bildirişiň "Floating" (galkýan) ýa-da diňe "Silent" (sesiz) bolmagy şuňa baglydyr. Siz ony setNotificationChannelAsync funksiýasynda kesgitleýärsiňiz:

? MAX / HIGH: Bildiriş ekranyň ýokarsyndan galkyp (floating) çykýar we ses çykarýar. (Gyssagly habarlar üçin).
HIGH	Ses + görkezilýär
MAX	🚨 Popup + ses + iň ýokary üns
? DEFAULT: Ses çykarýar, ýöne ekranda galkmaýar, diňe ýokarky panelde (status bar) peýda bolýar.
DEFAULT	Adaty notification
? LOW / MIN: Ses çykarmaýar, ekranda görünmeýär, diňe bildirişler merkezine (swipe down) gidýär.
MIN	Diňe arka planda (sessiz)
LOW	Sessiz, görkezilýär ýöne üns çekmeýär

! 2. trigger (Wagt Boýunça Tapawutlandyrmak)
Bildirişiň haçan çykmalydygyny tapawutlandyrýar:
? trigger: null: Dessine ugratmak (Push habary ýaly).
? trigger: { seconds: 10 }: 10 sekuntdan soň (Lokal ýatlatma).
? trigger: { hour: 8, minute: 0, repeats: true }: Her gün sagat 08:00-da (Budilnik).

! 3. data vs content (Mazmun Boýunça Tapawutlandyrmak)
Bildirişiň "Görünýän" ýa-da "Görünmeýän" (Silent) bolmagy şeýle tapawutlanýar:
Görünýän Bildiriş: Içinde title we body bolmaly.
Görünmeýän (Silent/Data-only) Bildiriş: Içinde title we body bolmaly däl, diňe data bolmaly.

? iOS-da: iOS-da kanallar ýok. Ol ýerde bildirişiň nähili görünjekdigini ulanyjynyň öz telefonyndaky "Sazlamalar" (Settings) bölümi kesgitleýär.

! Channel ID — Kodyň ulanýan gapysy.
! Channel Name — Şol gapynyň üstündäki ýazgy (Ulanyjy üçin).
! Category — Şol gapydan giren bildirişiň elindäki düwmeler (Action).
? groupId - Expo bildirişlerinde (esasanam Android-de) döredilen bildiriş kanallaryny (Notification Channels) aýry-aýry topparlara bölmek üçin ulanylýan identifikatordyr.
*/