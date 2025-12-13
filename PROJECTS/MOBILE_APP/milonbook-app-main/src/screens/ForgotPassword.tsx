import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import Toast from "react-native-toast-message";
import { sendOTP, verifyOTP } from "../utils/otpService";
import { useSendOtp, useVerifyOtp, useResetPassword } from "../hooks/useAuth"; 

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPhone = (value) => /^\+?[0-9]{10,15}$/.test(value);
const sendOtpMutation = useSendOtp();
const verifyOtpMutation = useVerifyOtp();
const resetPasswordMutation = useResetPassword();

  const handleSendOTP = async () => {
  if (!identifier.trim()) {
    Toast.show({
      type: "error",
      text1: "Missing Information",
      text2: "Please enter your email or phone number",
    });
    return;
  }

  setLoading(true);

  try {
    if (isPhone(identifier)) {
      // Phone OTP (Firebase)
      const confirmationObj = await sendOTP(identifier);
      setConfirmation(confirmationObj);
      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "Verification code sent to your phone",
      });
      setStep(2);
    } else {
      // Email OTP (Your Server)
      await sendOtpMutation.mutateAsync(identifier);
      setStep(2);
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};


  const handleVerifyOTP = async () => {
  if (!otp.trim() || otp.length !== 6) {
    Toast.show({
      type: "error",
      text1: "Invalid OTP",
      text2: "Enter 6-digit code",
    });
    return;
  }

  setLoading(true);

  try {
    if (isPhone(identifier)) {
      await verifyOTP(confirmation, otp); // Firebase verify
      Toast.show({ type: "success", text1: "Verified", text2: "Phone OTP verified" });
      setStep(3);
    } else {
      await verifyOtpMutation.mutateAsync({ email: identifier, otp });
      setStep(3);
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};


  const handleResetPassword = async () => {
  if (!newPassword.trim() || !confirmPassword.trim()) {
    Toast.show({
      type: "error",
      text1: "Missing Fields",
      text2: "Please fill all password fields",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    Toast.show({
      type: "error",
      text1: "Password Mismatch",
      text2: "Both passwords must match",
    });
    return;
  }

  setLoading(true);

  try {
    await resetPasswordMutation.mutateAsync({
      identifier,
      newPassword,
    });

    Toast.show({
      type: "success",
      text1: "Password Reset",
      text2: "Login with your new password",
    });

    setTimeout(() => {
      navigation.navigate("Login");
    }, 1200);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};


  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      // Reset OTP when going back from step 2
      if (step === 2) {
        setOtp("");
      }
      // Reset passwords when going back from step 3
      if (step === 3) {
        setNewPassword("");
        setConfirmPassword("");
      }
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.goBackButton}>
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerContainer}>
            {/* Logo */}
            <Image
              source={require("../assets/milobook2.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Step 1: Enter Email/Phone */}
            {step === 1 && (
              <>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                  Enter your email or phone to receive a verification code
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email or Phone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email or phone"
                    placeholderTextColor="#94a3b8"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <LinearGradient
                  colors={["#00B5D8", "#7C3AED", "#EC4899"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSendOTP}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              </>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
              <>
                <Text style={styles.title}>Verify OTP</Text>
                <Text style={styles.subtitle}>
                  Enter the 6-digit code sent to {identifier}
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>OTP Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="000000"
                    placeholderTextColor="#94a3b8"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>

                <TouchableOpacity onPress={handleSendOTP}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>

                <LinearGradient
                  colors={["#00B5D8", "#7C3AED", "#EC4899"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleVerifyOTP}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              </>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                  Create a new strong password for your account
                </Text>

                {/* New Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter new password"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={!showPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.iconContainer}
                    >
                      <Icon
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#64748b"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Confirm new password"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={!showConfirm}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(!showConfirm)}
                      style={styles.iconContainer}
                    >
                      <Icon
                        name={showConfirm ? "eye-off" : "eye"}
                        size={20}
                        color="#64748b"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <LinearGradient
                  colors={["#00B5D8", "#7C3AED", "#EC4899"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleResetPassword}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Reset Password</Text>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "white",
  },
  goBackButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  goBackText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
  },
  innerContainer: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    color: "#475569",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "white",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    backgroundColor: "white",
  },
  textInput: {
    flex: 1,
    padding: 14,
    color: "#111827",
    fontSize: 15,
  },
  iconContainer: {
    paddingHorizontal: 12,
  },
  resendText: {
    color: "#7c3aed",
    marginVertical: 12,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  gradientButton: {
    borderRadius: 10,
    width: "100%",
    marginTop: 8,
  },
  button: {
    padding: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});