// import React, { useEffect } from 'react';
// import { StatusBar, useColorScheme, Platform, KeyboardAvoidingView } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import 'react-native-gesture-handler';
// import { configureGoogleSignIn } from './src/utils/googleConfig';
// import { Settings } from 'react-native-fbsdk-next';
// import Toast from 'react-native-toast-message';
// import toastConfig from './src/utils/toastConfig';
// import MainTabs from './src/screens/MainTabs';
// // Import Screens
// import RegisterScreen from './src/screens/RegisterScreen';
// import LoginScreen from './src/screens/LoginScreen';
// import ForgotPasswordScreen from './src/screens/ForgotPassword';
// import EditProfileScreen from './src/screens/EditProfile';
// import FlashScreen from './src/screens/FlashScreen';

// // import HomeScreen from './src/screens/HomeScreen';

// // Define navigation types
// export type RootStackParamList = {
//   Register: undefined;
//   Login: undefined;
//   OTPVerification: { type: 'email' | 'phone'; identifier: string };
//   ForgotPassword: undefined;
//   Home: undefined;
//   EditProfile: undefined;
//   FlashScreen: { flashId?: string } | undefined; // ✅ With optional params
// };

// const Stack = createStackNavigator<RootStackParamList>();

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   useEffect(() => {
//     configureGoogleSignIn();
//     Settings.setAppID('1857584335134070');
//     Settings.initializeSDK();
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

//       {/* ✅ Wrap NavigationContainer in KeyboardAvoidingView */}
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust if needed
//       >
//         <NavigationContainer>
//           <Stack.Navigator
//   initialRouteName="Register"
//   screenOptions={{
//     headerShown: false,
//     gestureEnabled: true,
//     cardStyleInterpolator: ({ current, layouts }) => ({
//       cardStyle: {
//         transform: [
//           {
//             translateX: current.progress.interpolate({
//               inputRange: [0, 1],
//               outputRange: [layouts.screen.width, 0],
//             }),
//           },
//         ],
//       },
//     }),
//   }}
// >
//   <Stack.Screen name="Register" component={RegisterScreen} />
//   <Stack.Screen name="Login" component={LoginScreen} />
//   <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//   <Stack.Screen name="Home" component={MainTabs} />

//   {/* ✅ ADD THIS */}
//   <Stack.Screen name="EditProfile" component={EditProfileScreen} />
//   <Stack.Screen name="FlashScreen" component={FlashScreen} />
// </Stack.Navigator>

//         </NavigationContainer>
//         <Toast config={toastConfig} position="top" topOffset={50} />
//       </KeyboardAvoidingView>
//     </SafeAreaProvider>
//   );
// }

// export default App;
import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query'; // ✅ ADD THIS
import { queryClient } from './src/lib/queryClient';
import {
  StatusBar,
  useColorScheme,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { configureGoogleSignIn } from './src/utils/googleConfig';
import { Settings } from 'react-native-fbsdk-next';
import Toast from 'react-native-toast-message';
import toastConfig from './src/utils/toastConfig';
import MainTabs from './src/screens/MainTabs';
import DiscoverScreen from './src/screens/Discover';
// Import Screens
import SplashScreen from './src/screens/SplashScreen'; // ✅ ADDED
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPassword';
import EditProfileScreen from './src/screens/EditProfile';
import FlashScreen from './src/screens/FlashScreen';
import TrendingScreen from './src/screens/TrendingScreen';
import CreateStoryScreen from './src/components/StoryCameraScreen'; // ✅ ADDED
// Define navigation types
export type RootStackParamList = {
  Splash: undefined; // ✅ ADDED
  Register: undefined;
  Login: undefined;
  OTPVerification: { type: 'email' | 'phone'; identifier: string };
  ForgotPassword: undefined;
  Home: undefined;
  EditProfile: undefined;
  FlashScreen: { flashId?: string } | undefined;
  Trending: undefined;
  DiscoverScreen: undefined;
  CreateStoryScreen: undefined;
  StoryViewer: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    configureGoogleSignIn();
    Settings.setAppID('1857584335134070');
    Settings.initializeSDK();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Splash" // ✅ CHANGED from "Register"
              screenOptions={{
                headerShown: false,
                gestureEnabled: false, // ✅ CHANGED from true
                cardStyleInterpolator: ({ current, layouts }) => ({
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                }),
              }}
            >
              {/* ✅ ADDED Splash Screen */}
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{
                  gestureEnabled: false,
                  animationEnabled: false,
                }}
              />

              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
              />
              <Stack.Screen name="Home" component={MainTabs} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="FlashScreen" component={FlashScreen} />

              <Stack.Screen
                name="Trending"
                component={TrendingScreen}
                options={{
                  presentation: 'modal', // Optional: makes it slide up like Instagram
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} />

              <Stack.Screen
                name="CreateStory"
                component={CreateStoryScreen}
                options={{
                  headerShown: false,
                  presentation: 'fullScreenModal',
                  animation: 'slide_from_bottom',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>

          <Toast config={toastConfig} position="top" topOffset={50} />
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
