import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  success: ({ text1, text2 }: ToastProps) => (
    <View style={styles.toastWrapper}>
      <LinearGradient
        colors={['#00B5D8', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder as ViewStyle}>
        <View style={styles.toastContent}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#00B5D8', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient as ViewStyle}>
              <Text style={styles.iconText}>✔</Text>
            </LinearGradient>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.successTitle}>{text1}</Text>
            {text2 && (
              <Text style={styles.successMessage}>{text2}</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  ),

  error: ({ text1, text2 }: ToastProps) => (
    <View style={styles.toastWrapper}>
      <LinearGradient
        colors={['#EC4899', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder as ViewStyle}>
        <View style={styles.toastContent}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#EC4899', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient as ViewStyle}>
              <Text style={styles.iconText}>×</Text>
            </LinearGradient>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.errorTitle}>{text1}</Text>
            {text2 && (
              <Text style={styles.errorMessage}>{text2}</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  ),

  info: ({ text1, text2 }: ToastProps) => (
    <View style={styles.toastWrapper}>
      <LinearGradient
        colors={['#00B5D8', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder as ViewStyle}>
        <View style={styles.toastContent}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#00B5D8', '#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient as ViewStyle}>
              <Text style={styles.iconText}>ⓘ</Text>
            </LinearGradient>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.infoTitle}>{text1}</Text>
            {text2 && (
              <Text style={styles.infoMessage}>{text2}</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastWrapper: {
    width: '100%',
    paddingHorizontal: 12,
  } as ViewStyle,
  gradientBorder: {
    borderRadius: 16,
    padding: 1,
  } as ViewStyle,
  toastContent: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  iconContainer: {
    marginRight: 12,
  } as ViewStyle,
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  iconText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  } as TextStyle,
  textContainer: {
    flex: 1,
  } as ViewStyle,
  successTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  } as TextStyle,
  successMessage: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  } as TextStyle,
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  } as TextStyle,
  errorMessage: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  } as TextStyle,
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  } as TextStyle,
  infoMessage: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  } as TextStyle,
});

export default toastConfig;