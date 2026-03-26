import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import useLoginStore from '@/store/loginStore';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const { user, logout } = useLoginStore();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome!</Text>
          {user ? <Text style={styles.name}>{user?.name} {user?.lastname}</Text>
            : <Text style={styles.name}> You not login. </Text>
          }
        </View>
        {user ? (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Profile Information</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Username:</Text>
                <Text style={styles.infoValue}>{user?.username}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Name:</Text>
                <Text style={styles.infoValue}>
                  {user?.name} {user?.lastname} {user?.surename || ''}
                </Text>
              </View>

              {user?.pasportSerial && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Passport:</Text>
                  <Text style={styles.infoValue}>{user?.pasportSerial}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </>
        )
          : <Text style={styles.name}> Not informasion. </Text>
        }
        <View style={{ gap: 10 }}>
          <Button title='to notifications' onPress={() => router.navigate('/(notifications)')} />
          <Button title='to login' onPress={() => router.navigate('/(auth)/login')} />
          <Button title='to register' onPress={() => router.navigate('/(auth)/register')} />
          <Button title="to media" onPress={() => router.navigate('/(media)/camera')} />
        </View>
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    color: '#666',
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;