import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { SafeAreaView } from 'react-native-safe-area-context';

// screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FlashScreen from '../screens/FlashScreen';
import VideoScreen from '../screens/VideoScreen';
import MessagesScreen from '../screens/MessagesScreen';

const Tab = createBottomTabNavigator();

const GradientIcon = ({ name, size }) => (
  <MaskedView
    style={{ width: size, height: size }}
    maskElement={
      <View
        style={{
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          width: size,
          height: size,
        }}
      >
        <Icon name={name} size={size} color="#000" />
      </View>
    }
  >
    <LinearGradient
      colors={['#00B5D8', '#7C3AED', '#EC4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size }}
    />
  </MaskedView>
);

export default function MainTabs() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      edges={['bottom']}     // ⭐ MOST IMPORTANT FIX
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarItemStyle: { paddingTop: 8 },
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            height: 60, // safe height
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <GradientIcon name="home" size={24} />
              ) : (
                <Icon name="home" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Flash"
          component={FlashScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <GradientIcon name="bolt" size={24} />
              ) : (
                <Icon name="bolt" size={24} color="#9ca3af" />
              ),
          }}
        />

        <Tab.Screen
          name="Video"
          component={VideoScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <GradientIcon name="video" size={24} />
              ) : (
                <Icon name="video" size={24} color="#9ca3af" />
              ),
          }}
        />

        <Tab.Screen
          name="Messages"
          component={MessagesScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <GradientIcon name="comment-dots" size={24} />
              ) : (
                <Icon name="comment-dots" size={24} color="#9ca3af" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <GradientIcon name="user-circle" size={24} />
              ) : (
                <Icon name="user-circle" size={24} color="#9ca3af" />
              ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
