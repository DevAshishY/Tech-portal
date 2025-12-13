// File: src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useProfile } from '../hooks/useProfile';
import UserPostsGrid from '../components/UserPostsGrid';
import UserReelsGrid from '../components/UserReelsGrid';
import { API_BASE_URL } from '../api/apiClient';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type TabType = 'posts' | 'reels';

const getFullImageUrl = (url: string): string => {
  if (!url) return "https://i.pravatar.cc/300?img=12";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  const {
    data: profile,
    isLoading: loading,
    refetch
  } = useProfile();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      setShowLogoutConfirm(false);
      await AsyncStorage.removeItem('token');

      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been logged out successfully."
      });

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 1000);

    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to logout. Please try again."
      });
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Icon name="alert-circle" size={48} color="#999" />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <View style={styles.toastOverlay}>
          <View style={styles.toastWrapper}>
            <LinearGradient
              colors={['#00B5D8', '#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.toastGradientBorder}
            >
              <View style={styles.toastContentContainer}>
                <View style={styles.toastLeft}>
                  <LinearGradient
                    colors={['#00B5D8', '#7C3AED', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.toastIcon}
                  >
                    <Icon name="log-out" size={18} color="#fff" />
                  </LinearGradient>
                  <View style={styles.toastTextArea}>
                    <Text style={styles.toastTitle}>Logout</Text>
                    <Text style={styles.toastMessage}>Are you sure?</Text>
                  </View>
                </View>

                <View style={styles.toastButtons}>
                  <TouchableOpacity style={styles.toastCancelBtn} onPress={cancelLogout}>
                    <Text style={styles.toastCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.toastLogoutBtn} onPress={confirmLogout}>
                    <Text style={styles.toastLogoutText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      )}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/milobook2.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Icon name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: getFullImageUrl(profile.profilePicture) }}
            style={styles.avatar}
          />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{formatNumber(profile.momentsCount)}</Text>
              <Text style={styles.statLabel}>Moments</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: '#7C3AED' }]}>
                {formatNumber(profile.connectionsCount)}
              </Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{formatNumber(profile.connectingCount)}</Text>
              <Text style={styles.statLabel}>Connecting</Text>
            </View>
          </View>

          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileTagline}>{profile.bio || 'No bio yet'}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.btnText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareBtn}>
              <Icon name="share-2" size={18} color="#111" />
              <Text style={[styles.btnTextDark, { marginLeft: 6 }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs - Instagram Style */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
            onPress={() => setActiveTab('posts')}
          >
            <Icon 
              name="grid" 
              size={24} 
              color={activeTab === 'posts' ? '#111' : '#9ca3af'} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'reels' && styles.tabActive]}
            onPress={() => setActiveTab('reels')}
          >
            <Icon 
              name="film" 
              size={24} 
              color={activeTab === 'reels' ? '#111' : '#9ca3af'} 
            />
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {profile.id && activeTab === 'posts' && <UserPostsGrid userId={profile.id} />}
        {profile.id && activeTab === 'reels' && <UserReelsGrid userId={profile.id} />}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#ffffff' },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorText: { marginTop: 12, fontSize: 16, color: '#666' },
  retryBtn: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#7C3AED', borderRadius: 12 },
  retryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  header: {
    padding: 16,
    paddingTop: Platform.OS === "android" ? 20 : 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: { width: 120, height: 40 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },

  logoutText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  profileSection: { alignItems: 'center', paddingVertical: 20 },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#7C3AED',
    backgroundColor: '#f0f0f0',
  },

  statsRow: { flexDirection: 'row', marginTop: 16 },

  statBox: { alignItems: 'center', marginHorizontal: 20 },

  statNumber: { fontSize: 18, fontWeight: '600', color: '#111' },

  statLabel: { fontSize: 13, color: '#6b7280', marginTop: 2 },

  profileName: { fontSize: 20, fontWeight: '700', marginTop: 12, color: '#111' },

  profileTagline: { fontSize: 14, color: '#6b7280', marginTop: 4, textAlign: 'center', paddingHorizontal: 20 },

  buttonRow: { flexDirection: 'row', marginTop: 18, gap: 12 },

  editBtn: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: '#111', borderRadius: 12 },

  shareBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    flexDirection: 'row',
    alignItems: 'center',
  },

  btnText: { color: '#fff', fontWeight: '600' },

  btnTextDark: { color: '#111', fontWeight: '600' },

  // Instagram-style tabs
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginTop: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  tabActive: {
    borderBottomColor: '#111',
  },

  toastOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 12,
  },

  toastWrapper: { width: '100%', paddingHorizontal: 12 },

  toastGradientBorder: { borderRadius: 16, padding: 1 },

  toastContentContainer: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  toastLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },

  toastIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  toastTextArea: { flex: 1 },

  toastTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },

  toastMessage: { fontSize: 13, color: '#64748b', fontWeight: '500' },

  toastButtons: { flexDirection: 'row', gap: 10 },

  toastCancelBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },

  toastCancelText: { fontSize: 14, fontWeight: '600', color: '#374151' },

  toastLogoutBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#111', alignItems: 'center' },

  toastLogoutText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});