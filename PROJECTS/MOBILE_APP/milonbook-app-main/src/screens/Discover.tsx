import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';

type Props = {
  navigation: any;
};

function DiscoverScreen({ navigation }: Props): React.JSX.Element {
  const spotlights = [
    { id: '1', username: 'spotlight', avatar: 'https://i.pravatar.cc/150?img=20', isActive: true },
    { id: '2', username: 'homoxpri...', avatar: 'https://i.pravatar.cc/150?img=21', isActive: false },
    { id: '3', username: 'tech_cre...', avatar: 'https://i.pravatar.cc/150?img=22', isActive: false },
    { id: '4', username: 'design_st...', avatar: 'https://i.pravatar.cc/150?img=23', isActive: false },
    { id: '5', username: 'travel_life', avatar: 'https://i.pravatar.cc/150?img=24', isActive: false },
  ];

  const renderSpotlight = ({ item }: any) => (
    <TouchableOpacity style={styles.spotlightItem} activeOpacity={0.75}>
      <LinearGradient
        colors={['#00B5D8', '#7C3AED', '#EC4899']}
        style={styles.spotlightRing}
      >
        <View style={styles.spotlightInnerBorder}>
          <Image source={{ uri: item.avatar }} style={styles.spotlightImage} />
        </View>
      </LinearGradient>
      
      {item.isActive && (
        <View style={styles.activeIndicator}>
          <Icon name="plus" size={10} color="#ffffff" />
        </View>
      )}
      
      <Text style={styles.spotlightUsername} numberOfLines={1}>
        {item.username}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Discover</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* SPOTLIGHTS SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SPOTLIGHTS</Text>
            
            <FlatList
              data={spotlights}
              renderItem={renderSpotlight}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.spotlightsList}
            />
          </View>

          {/* GROUPS SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>GROUPS</Text>
            
            <TouchableOpacity style={styles.createGroupCard} activeOpacity={0.7}>
              <View style={styles.createGroupLeft}>
                <View style={styles.groupIconContainer}>
                  <Icon name="users" size={20} color="#ffffff" />
                </View>
                <View>
                  <Text style={styles.createGroupTitle}>Create Group</Text>
                  <Text style={styles.createGroupSubtitle}>Connect with like-minded people</Text>
                </View>
              </View>
              
              <View style={styles.createGroupButton}>
                <Icon name="plus" size={18} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerPlaceholder: {
    width: 40,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7C3AED',
    textAlign: 'center',
  },

  scrollView: {
    flex: 1,
  },

  section: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  // SPOTLIGHTS
  spotlightsList: {
    paddingHorizontal: 16,
    gap: 10,
  },

  spotlightItem: {
    alignItems: 'center',
    position: 'relative',
    marginRight: 4,
  },

  spotlightRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },

  spotlightInnerBorder: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  spotlightImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },

  activeIndicator: {
    position: 'absolute',
    bottom: 22,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },

  spotlightUsername: {
    fontSize: 11,
    color: '#4b5563',
    maxWidth: 68,
    textAlign: 'center',
    marginTop: 6,
  },

  // GROUPS
  createGroupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  createGroupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  groupIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  createGroupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },

  createGroupSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },

  createGroupButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DiscoverScreen;