
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import LinearGradient from 'react-native-linear-gradient';
import { useLogin, useGoogleLogin ,useFacebookLogin} from '../hooks/useAuth';


type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

function LoginScreen({ navigation }: Props): React.JSX.Element {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Regular Login (Email/Phone + Password)
  const { mutate: login, isPending } = useLogin();
  const handleLogin = () => {
    if (!identifier.trim() || !password.trim()) {
      return Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Email/Phone and Password are required.',
      });
    }

    login(
      { identifier, password },
      {
        onSuccess: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        },
      }
    );
  };

  const googleLogin = useGoogleLogin();
  
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const userInfo = await GoogleSignin.signIn();
      console.log("Google User Info:", userInfo);

      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      if (!idToken) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Google did not return any token.',
        });
        return;
      }

      // Call React Query hook
      googleLogin.mutate(idToken, {
        onSuccess: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        },
      });
    } catch (error: any) {
      console.error("Google login error:", error);
      Toast.show({
        type: "error",
        text1: "Google Login Failed",
        text2: error.message || "Something went wrong",
      });
    }
  };


  // ✅ Facebook Login
  const facebookLogin = useFacebookLogin();
  const handleFacebookLogin = async () => {
  try {
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (result.isCancelled) {
      Toast.show({
        type: "info",
        text1: "Cancelled",
        text2: "Facebook login cancelled.",
      });
      return;
    }

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to get Facebook access token.",
      });
      return;
    }

    const accessToken = data.accessToken;

    // 🔥 Use your hook
    facebookLogin.mutate(accessToken, {
      onSuccess: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      },
    });
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error.message || "Facebook login failed",
    });
  }
};


  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Logo */}
            <Image
              source={require('../assets/milobook2.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.subtitle}>Welcome back to Milonbook</Text>

            {/* Form Container */}
            <LinearGradient
              colors={['#00B5D8', '#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}>
              <View style={styles.innerContainer}>
                <View style={styles.form}>
                  {/* Email / Phone Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email or Phone</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="your@email.com or phone"
                      placeholderTextColor="#94a3b8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={identifier}
                      onChangeText={setIdentifier}
                    />
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>

                  {/* Forgot Password */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <View style={{ width: '100%', height: 80, overflow: 'hidden' }}>
                    <LinearGradient
                      colors={['#00B5D8', '#7C3AED', '#EC4899']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientButton}>
                      <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                        disabled={loading}>
                        {loading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={styles.loginButtonText}>Log In</Text>
                        )}
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                    <View style={styles.divider} />
                  </View>

                  {/* Social Buttons */}
                  <View style={styles.socialWrapper}>
                    <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin} activeOpacity={0.7}>
                      <Image source={require('../assets/google.jpeg')} style={styles.socialIcon} resizeMode="contain" />
                      <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin} activeOpacity={0.7}>
                      <Image source={require('../assets/facebook.png')} style={styles.socialIconFb} resizeMode="contain" />
                      <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
            </LinearGradient>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate('Register')}>
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12
  },
  subtitle: {
    fontSize: 15,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 2.5,
    width: '100%',
    marginBottom: 16,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
  },
  form: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: '#555',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    height: 46,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 14,
    marginTop: 0,
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontSize: 13,
    fontWeight: '600'
  },
  gradientButton: {
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
  },
  loginButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd'
  },
  dividerText: {
    color: '#777',
    fontSize: 10,
    paddingHorizontal: 8,
    fontWeight: '600',
  },
  socialWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    columnGap: 10,
  },
  socialButton: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 10,
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 6
  },
  socialIconFb: {
    width: 28,
    height: 28,
    marginRight: 6
  },
  socialText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b'
  },
  footer: {
    alignItems: 'center',
    marginTop: 16
  },
  footerText: {
    color: '#777',
    fontSize: 13
  },
  signupLink: {
    color: '#007BFF',
    fontWeight: '600'
  },
});

export default LoginScreen;