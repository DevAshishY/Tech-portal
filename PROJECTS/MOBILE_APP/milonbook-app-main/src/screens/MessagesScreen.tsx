import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';

type Props = {
  navigation: any;
};

function MessagesScreen({ navigation }: Props): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>

        {/* Coming Soon Content */}
        <View style={styles.content}>
          <LinearGradient
            colors={['#00B5D8', '#7C3AED', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}>
            <View style={styles.iconContainer}>
              <Icon name="comment-dots" size={60} color="#7C3AED" />
            </View>
          </LinearGradient>

          <Text style={styles.comingSoonText}>Coming Soon</Text>
          <Text style={styles.descriptionText}>
            We're working hard to bring you an amazing messaging experience. Stay tuned!
          </Text>

         
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  iconGradient: {
    borderRadius: 80,
    padding: 3,
    marginBottom: 32,
  },

  iconContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 77,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },

  comingSoonText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },

  descriptionText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },

  featuresContainer: {
    width: '100%',
    gap: 16,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 16,
  },

  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  featureText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
});

export default MessagesScreen;