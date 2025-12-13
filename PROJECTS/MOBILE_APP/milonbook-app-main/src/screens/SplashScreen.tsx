import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import LinearGradient from 'react-native-linear-gradient';
import { useVerifyToken } from '../hooks/useAuth'; // ⬅️ import hook

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

function SplashScreen({ navigation }: Props): React.JSX.Element {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const verifyToken = useVerifyToken(); // ⬅️ mutation hook

  useEffect(() => {
    // 🎉 Animation
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 1 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        return navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }

      // 🔥 Call react-query verify API
      verifyToken.mutate(token, {
        onSuccess: () => {
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        },
        onError: async () => {
          await AsyncStorage.removeItem('token');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      });

    } catch (error) {
      await AsyncStorage.removeItem('token');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  return (
    <LinearGradient
      colors={['#00B5D8', '#7C3AED', '#EC4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image
          source={require('../assets/milobook2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center' },
  logo: { width: 150, height: 150, marginBottom: 15 },
});

export default SplashScreen;
