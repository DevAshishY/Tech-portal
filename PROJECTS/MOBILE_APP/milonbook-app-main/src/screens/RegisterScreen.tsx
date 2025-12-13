

import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import Toast from "react-native-toast-message";
import { sendOTP, verifyOTP } from "../utils/otpService";
import { 
  useRegister, 
  useGoogleLogin, 
  useFacebookLogin,
  useSendOtp,
  useVerifyOtp 
} from "../hooks/useAuth";
import { API_BASE_URL } from "../api/apiClient";
type SignupStep = 1 | 2 | 3 | 4 | 5;
type SignupMethod = "email" | "phone";

function RegisterScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState<SignupStep>(1);
  const [signupMethod, setSignupMethod] = useState<SignupMethod>("email");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [confirmation, setConfirmation] = useState<any>(null);

  // ✅ Use custom hooks
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();
  const facebookLoginMutation = useFacebookLogin();
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  const loading = 
    registerMutation.isPending || 
    googleLoginMutation.isPending || 
    facebookLoginMutation.isPending ||
    sendOtpMutation.isPending ||
    verifyOtpMutation.isPending;

  // ✅ Check if user exists (kept as is since it uses checkOnly flag)
  const checkIfUserExists = async (): Promise<boolean> => {
    try {
      const body =
        signupMethod === "email"
          ? { name: "temp", email: formData.email, password: "temp123", checkOnly: true }
          : { name: "temp", phone: formData.phone, password: "temp123", checkOnly: true };

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.status === 409) {
        Toast.show({
          type: "error",
          text1: "User Already Exists",
          text2: data.message || (signupMethod === "email"
            ? "This email is already registered. Please login or use a different email."
            : "This phone number is already registered. Please login or use a different phone number."),
        });
        return true;
      }

      if (response.status === 200 && data.success && data.checkOnly) {
        return false;
      }

      return false;
    } catch (error) {
      console.error("Check user error:", error);
      return false;
    }
  };

  // ✅ Facebook Signup - Using hook
  const handleFacebookSignup = async (): Promise<void> => {
    try {
      const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);

      if (result.isCancelled) {
        Toast.show({
          type: "info",
          text1: "Cancelled",
          text2: "Facebook login was cancelled.",
        });
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong obtaining Facebook access token.",
        });
        return;
      }

      // ✅ Use the mutation
      await facebookLoginMutation.mutateAsync(data.accessToken);
      
      setTimeout(() => navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }), 1000);

    } catch (error: any) {
      console.error("Facebook login error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Facebook login failed",
      });
    }
  };

  // ✅ Send Email OTP - Using hook
  const handleSendEmailOTP = async (): Promise<void> => {
    if (!formData.email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email",
      });
      return;
    }

    try {
      await sendOtpMutation.mutateAsync(formData.email);
      setStep(3);
    } catch (error) {
      console.error("Send OTP error:", error);
    }
  };

  // ✅ Verify Email OTP - Using hook
  const handleVerifyEmailOTP = async (): Promise<void> => {
    if (!formData.otp || formData.otp.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid 6-digit OTP",
      });
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({ 
        email: formData.email, 
        otp: formData.otp 
      });
      setStep(4);
    } catch (error) {
      console.error("Verify OTP error:", error);
    }
  };

  // ✅ Send Phone OTP (Firebase - kept as is)
  const handleSendPhoneOTP = async (): Promise<void> => {
    try {
      if (!formData.phone) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please enter your phone number",
        });
        return;
      }

      const conf = await sendOTP(formData.phone);
      setConfirmation(conf);

      if (conf) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "OTP sent to your phone!",
        });
        setStep(3);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to send OTP",
        });
      }
    } catch (error: any) {
      console.error("Send Phone OTP error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to send OTP",
      });
    }
  };

  // ✅ Verify Phone OTP (Firebase - kept as is)
  const handleVerifyPhoneOTP = async (): Promise<void> => {
    try {
      if (!formData.otp || formData.otp.length !== 6) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please enter a valid 6-digit OTP",
        });
        return;
      }

      if (!confirmation) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please request OTP first",
        });
        return;
      }

      const user = await verifyOTP(confirmation, formData.otp);

      if (user) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Phone verified successfully!",
        });
        setStep(4);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid OTP",
        });
      }
    } catch (error: any) {
      console.error("Verify Phone OTP error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Invalid OTP",
      });
    }
  };

  // ✅ Register - Using hook
  const handleRegister = async (): Promise<void> => {
    if (!formData.name || !formData.password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill all required fields",
      });
      return;
    }

    const registerData = signupMethod === "email"
      ? { name: formData.name, email: formData.email, password: formData.password }
      : { name: formData.name, phone: formData.phone, password: formData.password };

    try {
      await registerMutation.mutateAsync(registerData);
      
      setTimeout(() => navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }), 1000);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // ✅ Google Signup - Using hook
  const handleGoogleSignup = async (): Promise<void> => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const token = tokens.idToken;

      if (!token) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No token received from Google.",
        });
        return;
      }

      // ✅ Use the mutation
      await googleLoginMutation.mutateAsync(token);

      setTimeout(() => navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }), 1000);

    } catch (error: any) {
      console.error("Google login error:", error);
      
      let userMessage = error.message || "Google sign-in failed";
      
      if (error.message === "Network request failed") {
        userMessage = "Cannot connect to server. Is your backend running?";
      }
      
      Toast.show({
        type: "error",
        text1: "Error",
        text2: userMessage,
      });
    }
  };

  // ✅ Step navigation
  const handleNext = async () => {
    if (step === 1) {
      if (signupMethod === "email" && !formData.email) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please enter your email",
        });
        return;
      }
      if (signupMethod === "phone" && !formData.phone) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please enter your phone number",
        });
        return;
      }

      const userExists = await checkIfUserExists();
      if (userExists) {
        return;
      }

      setStep(2);
    } else if (step === 4) {
      if (!formData.password || !formData.confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please fill both password fields",
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Passwords do not match",
        });
        return;
      }
      setStep(5);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as SignupStep);
      if (step === 3) {
        setFormData({ ...formData, otp: "" });
        setConfirmation(null);
      }
    } else {
      navigation.goBack();
    }
  };

  // ✅ Step UI (unchanged)
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us and start sharing your moments
            </Text>

            {signupMethod === "email" ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 9876543210"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                />
              </View>
            )}

            <TouchableOpacity
              onPress={() => setSignupMethod(signupMethod === "email" ? "phone" : "email")}
            >
              <Text style={styles.switchText}>
                {signupMethod === "email"
                  ? "Sign up with mobile number"
                  : "Sign up with email "}
              </Text>
            </TouchableOpacity>

            <LinearGradient
              colors={["#00B5D8", "#7C3AED", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleNext}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Verifying..." : "Next"}
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialWrapper}>
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignup} activeOpacity={0.7}>
                <Image source={require('../assets/google.jpeg')} style={styles.socialIcon} resizeMode="contain" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={handleFacebookSignup} activeOpacity={0.7}>
                <Image source={require('../assets/facebook.png')} style={styles.socialIconFb} resizeMode="contain" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text
                  style={styles.loginLink}
                  onPress={() => navigation.navigate("Login")}
                >
                  Login
                </Text>
              </Text>
            </View>
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.title}>
              {signupMethod === "email" ? "Verify Email" : "Verify Phone"}
            </Text>
            <Text style={styles.subtitle}>
              We'll send a verification code to{" "}
              {signupMethod === "email" ? formData.email : formData.phone}
            </Text>

            <LinearGradient
              colors={["#00B5D8", "#7C3AED", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={signupMethod === "email" ? handleSendEmailOTP : handleSendPhoneOTP}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Sending..." : "Send OTP"}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        );

      case 3:
        return (
          <>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{" "}
              {signupMethod === "email" ? formData.email : formData.phone}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>OTP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
                maxLength={6}
                value={formData.otp}
                onChangeText={(text) => setFormData({ ...formData, otp: text })}
              />
            </View>

            <TouchableOpacity
              onPress={signupMethod === "email" ? handleSendEmailOTP : handleSendPhoneOTP}
            >
              <Text style={styles.switchText}>Resend OTP</Text>
            </TouchableOpacity>

            <LinearGradient
              colors={["#00B5D8", "#7C3AED", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={signupMethod === "email" ? handleVerifyEmailOTP : handleVerifyPhoneOTP}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        );

      case 4:
        return (
          <>
            <Text style={styles.title}>Set Password</Text>
            <Text style={styles.subtitle}>
              Create a strong password to secure your account
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Enter password"
                placeholderTextColor="#94a3b8"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Confirm password"
                placeholderTextColor="#94a3b8"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
              />
            </View>

            <LinearGradient
              colors={["#00B5D8", "#7C3AED", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        );

      case 5:
        return (
          <>
            <Text style={styles.title}>Your Name</Text>
            <Text style={styles.subtitle}>
              Tell us what we should call you
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#94a3b8"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
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
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Registering..." : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {step > 1 && (
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.goBackButton}>
              <Text style={styles.goBackText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerContainer}>
            <Image
              source={require("../assets/milobook2.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            {renderStepContent()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    paddingVertical: 20,
  },
  innerContainer: { width: "100%", alignItems: "center" },
  logo: { width: 80, height: 80, marginBottom: 8 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: { width: "100%", marginBottom: 14 },
  label: { color: "#475569", fontSize: 13, marginBottom: 6, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "white",
    height: 46,
  },
  switchText: {
    color: "#7c3aed",
    marginVertical: 8,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  gradientButton: {
    borderRadius: 10,
    width: "100%",
    marginTop: 6,
  },
  button: { padding: 13, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    width: "100%",
  },
  divider: { flex: 1, height: 1, backgroundColor: "#e2e8f0" },
  dividerText: { fontSize: 10, color: "#94a3b8", marginHorizontal: 8 },
  socialWrapper: { 
    flexDirection: 'row', 
    gap: 8,
    width: "100%",
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
    borderRadius: 10 
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
  footer: { marginTop: 16, alignItems: "center" },
  footerText: { color: "#94a3b8", fontSize: 13 },
  loginLink: { color: "#7c3aed", fontWeight: "600" },
});

export default RegisterScreen;




// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Image,
// } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import LinearGradient from "react-native-linear-gradient";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import Icon from "react-native-vector-icons/FontAwesome5";
// import { sendOTP, verifyOTP } from "../utils/otpService";
// import { LoginManager, AccessToken } from "react-native-fbsdk-next";
// import Toast from "react-native-toast-message";

// type SignupStep = 1 | 2 | 3 | 4 | 5;
// type SignupMethod = "email" | "phone";

// function RegisterScreen(): React.JSX.Element {
//   const navigation = useNavigation<any>();
//   const [step, setStep] = useState<SignupStep>(1);
//   const [signupMethod, setSignupMethod] = useState<SignupMethod>("email");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     otp: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [confirmation, setConfirmation] = useState<any>(null);

  
// const checkIfUserExists = async (): Promise<boolean> => {
//   try {
//     setLoading(true);
    
//     const body =
//       signupMethod === "email"
//         ? { name: "temp", email: formData.email, password: "temp123", checkOnly: true }
//         : { name: "temp", phone: formData.phone, password: "temp123", checkOnly: true };

//     const response = await fetch("http://192.168.1.22:4702/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();
//     setLoading(false);

//     // Status 409 = User already exists (conflict)
//     if (response.status === 409) {
//       Toast.show({
//         type: "error",
//         text1: "User Already Exists",
//         text2: data.message || (signupMethod === "email"
//           ? "This email is already registered. Please login or use a different email."
//           : "This phone number is already registered. Please login or use a different phone number."),
//       });
//       return true; // User exists - block registration
//     }

//     // Status 200 with checkOnly: true = User doesn't exist (good to proceed)
//     if (response.status === 200 && data.success && data.checkOnly) {
//       console.log("User check passed - user doesn't exist, can proceed");
//       return false; // User doesn't exist - allow registration
//     }

//     // Any other response - don't block registration, let backend handle it
//     console.log("User check returned unexpected response:", data);
//     return false;
    
//   } catch (error) {
//     console.error("Check user error:", error);
//     setLoading(false);
    
//     // On network error, don't block registration
//     // The backend will catch duplicates during actual registration
//     console.log("Network error during user check - proceeding anyway");
//     return false;
//   }
// };
//   // ✅ Facebook Signup
//   const handleFacebookSignup = async (): Promise<void> => {
//     try {
//       // Ask for Facebook permissions
//       const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);

//       if (result.isCancelled) {
//         Toast.show({
//           type: "info",
//           text1: "Cancelled",
//           text2: "Facebook login was cancelled.",
//         });
//         return;
//       }

//       // Get access token
//       const data = await AccessToken.getCurrentAccessToken();

//       if (!data) {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Something went wrong obtaining Facebook access token.",
//         });
//         return;
//       }

//       const accessToken = data.accessToken;

//       // Send to backend for verification
//       const response = await fetch("http://192.168.1.22:4702/api/auth/facebook", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ accessToken }),
//       });

//       const resData = await response.json();

//       if (response.ok) {
//         await AsyncStorage.setItem("token", resData.token);
//         Toast.show({
//           type: "success",
//           text1: "Success",
//           text2: "Signed in with Facebook!",
//         });
//         // setTimeout(() => navigation.navigate("Home"), 1000);
//         setTimeout(() => navigation.reset({
//   index: 0,
//   routes: [{ name: 'Home' }],
// }), 1000);
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: resData.error || "Failed to login with Facebook",
//         });
//       }
//     } catch (error: any) {
//       console.error("Facebook login error:", error);
//       Toast.show({
//         type: "error",
//         text1: "Error",
//         text2: error.message || "Facebook login failed",
//       });
//     }
//   };

//   // ✅ Send OTP API (Email)
//   const handleSendEmailOTP = async (): Promise<void> => {
//     try {
//       if (!formData.email) {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Please enter your email",
//         });
//         return;
//       }

//       setLoading(true);
//       const response = await fetch("http://192.168.1.22:4702/api/auth/otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: formData.email }),
//       });

//       const data = await response.json();
//       setLoading(false);

//       if (response.ok && data.success) {
//         Toast.show({
//           type: "success",
//           text1: "Success",
//           text2: "OTP sent to your email!",
//         });
//         setStep(3);
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: data.message || "Failed to send OTP",
//         });
//       }
//     } catch (error) {
//       console.error("Send OTP error:", error);
//       Toast.show({
//         type: "error",
//         text1: "Error",
//         text2: "Something went wrong. Please try again later.",
//       });
//       setLoading(false);
//     }
//   };

//   // ✅ Verify Email OTP API
//   const handleVerifyEmailOTP = async (): Promise<void> => {
//     try {
//       if (!formData.otp || formData.otp.length !== 6) {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Please enter a valid 6-digit OTP",
//         });
//         return;
//       }

//       setLoading(true);
//       const response = await fetch("http://192.168.1.22:4702/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: formData.email, otp: formData.otp }),
//       });

//       const data = await response.json();
//       setLoading(false);

//       if (response.ok && data.success) {
//         Toast.show({
//           type: "success",
//           text1: "Success",
//           text2: "OTP verified successfully!",
//         });
//         setStep(4);
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: data.message || "Invalid OTP",
//         });
//       }
//     } catch (error) {
//       console.error("Verify OTP error:", error);
//       Toast.show({
//         type: "error",
//         text1: "Error",
//         text2: "Something went wrong. Please try again later.",
//       });
//       setLoading(false);
//     }
//   };

//   // ✅ Send Phone OTP (Firebase)
//   const handleSendPhoneOTP = async (): Promise<void> => {
//     try {
//       if (!formData.phone) {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Please enter your phone number",
//         });
//         return;
//       }

//       setLoading(true);
//       const conf = await sendOTP(formData.phone);
//       setConfirmation(conf);
//       setLoading(false);

//       if (conf) {
//         Toast.show({
//           type: "success",
//           text1: "Success",
//           text2: "OTP sent to your phone!",
//         });
//         setStep(3);
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Failed to send OTP",
//         });
//       }
//     } catch (error: any) {
//       console.error("Send Phone OTP error:", error);
//       Toast.show({
//         type: "error",
//         text1: "Error",
//         text2: error.message || "Failed to send OTP",
//       });
//       setLoading(false);
//     }
//   };

//   // ✅ Verify Phone OTP (Firebase)
//   const handleVerifyPhoneOTP = async (): Promise<void> => {
//     try {
//       if (!formData.otp || formData.otp.length !== 6) {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Please enter a valid 6-digit OTP",
//         });
//         return;
//       }

//       if (!confirmation) {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Please request OTP first",
//         });
//         return;
//       }

//       setLoading(true);
//       const user = await verifyOTP(confirmation, formData.otp);
//       setLoading(false);

//       if (user) {
//         Toast.show({
//           type: "success",
//           text1: "Success",
//           text2: "Phone verified successfully!",
//         });
//         console.log("Verified user:", user);
//         setStep(4);
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Invalid OTP",
//         });
//       }
//     } catch (error: any) {
//       console.error("Verify Phone OTP error:", error);
//       Toast.show({
//         type: "error",
//         text1: "Error",
//         text2: error.message || "Invalid OTP",
//       });
//       setLoading(false);
//     }
//   };

//   // ✅ Register API
//   // const handleRegister = async (): Promise<void> => {
//   //   try {
//   //     if (!formData.name || !formData.password) {
//   //       Toast.show({
//   //         type: "error",
//   //         text1: "Error",
//   //         text2: "Please fill all required fields",
//   //       });
//   //       return;
//   //     }

//   //     const body =
//   //       signupMethod === "email"
//   //         ? { name: formData.name, email: formData.email, password: formData.password }
//   //         : { name: formData.name, phone: formData.phone, password: formData.password };

//   //     setLoading(true);
//   //     const response = await fetch("http://192.168.1.22:4702/api/auth/register", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(body),
//   //     });

//   //     const data = await response.json();
//   //     setLoading(false);

//   //     if (response.ok && data.success) {
//   //       Toast.show({
//   //         type: "success",
//   //         text1: "Success",
//   //         text2: "Registration successful!",
//   //       });
//   //       await AsyncStorage.setItem("token", data.token);
//   //       setTimeout(() => navigation.navigate("Login"), 1000);
//   //     } else {
//   //       Toast.show({
//   //         type: "error",
//   //         text1: "Error",
//   //         text2: data.message || "Registration failed",
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.error("Registration error:", error);
//   //     Toast.show({
//   //       type: "error",
//   //       text1: "Error",
//   //       text2: "Something went wrong. Please try again later.",
//   //     });
//   //     setLoading(false);
//   //   }
//   // };
//   // ✅ Register API - Updated to navigate to Home
// const handleRegister = async (): Promise<void> => {
//   try {
//     if (!formData.name || !formData.password) {
//       Toast.show({
//         type: "error",
//         text1: "Error",
//         text2: "Please fill all required fields",
//       });
//       return;
//     }

//     const body =
//       signupMethod === "email"
//         ? { name: formData.name, email: formData.email, password: formData.password }
//         : { name: formData.name, phone: formData.phone, password: formData.password };

//     setLoading(true);
//     const response = await fetch("http://192.168.1.22:4702/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();
//     setLoading(false);

//     if (response.ok && data.success) {
//       Toast.show({
//         type: "success",
//         text1: "Success",
//         text2: "Registration successful!",
//       });
//       await AsyncStorage.setItem("token", data.token);
//       // Changed from "Login" to "Home"
//       // setTimeout(() => navigation.navigate("Home"), 1000);
//       setTimeout(() => navigation.reset({
//   index: 0,
//   routes: [{ name: 'Home' }],
// }), 1000);
//     } else {
//       Toast.show({
//         type: "error",
//         text1: "Error",
//         text2: data.message || "Registration failed",
//       });
//     }
//   } catch (error) {
//     console.error("Registration error:", error);
//     Toast.show({
//       type: "error",
//       text1: "Error",
//       text2: "Something went wrong. Please try again later.",
//     });
//     setLoading(false);
//   }
// };

//   // ✅ Google Signup
// const handleGoogleSignup = async (): Promise<void> => {
//   try {
//     console.log("🔵 Step 1: Checking Play Services...");
//     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//     console.log("✅ Step 1: Play Services OK");
    
//     console.log("🔵 Step 2: Opening Google Sign-In...");
//     const userInfo = await GoogleSignin.signIn();
//     console.log("✅ Step 2: User signed in:", JSON.stringify(userInfo, null, 2));
    
//     console.log("🔵 Step 3: Getting tokens...");
//     const tokens = await GoogleSignin.getTokens();
//     const token = tokens.idToken;
//     console.log("✅ Step 3: Token received:", token ? "Yes" : "No");
//     console.log("Token length:", token?.length);
    
//     if (!token) {
//       console.log("❌ No token received from Google");
//       Toast.show({
//         type: "error",
//         text1: "Error",
//         text2: "No token received.",
//       });
//       return;
//     }

//     console.log("🔵 Step 4: Sending to backend...");
//     console.log("URL:", "http://192.168.1.22:4702/api/auth/google");
//     console.log("Method: POST");
//     console.log("Token (first 50 chars):", token.substring(0, 50) + "...");
    
//     const response = await fetch("http://192.168.1.22:4702/api/auth/google", {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//       },
//       body: JSON.stringify({ token }),
//     });
    
//     console.log("✅ Step 4: Got response");
//     console.log("Response status:", response.status);
//     console.log("Response ok:", response.ok);
    
//     console.log("🔵 Step 5: Parsing response...");
//     const data = await response.json();
//     console.log("✅ Step 5: Response data:", JSON.stringify(data, null, 2));

//     if (response.ok) {
//       console.log("🔵 Step 6: Saving token...");
//       await AsyncStorage.setItem("token", data.token);
//       console.log("✅ Step 6: Token saved");
      
//       Toast.show({
//         type: "success",
//         text1: "Success",
//         text2: "Signed in with Google!",
//       });
      
//       console.log("🔵 Step 7: Navigating to Home...");
//       // setTimeout(() => navigation.navigate("Home"), 1000);
//       setTimeout(() => navigation.reset({
//   index: 0,
//   routes: [{ name: 'Home' }],
// }), 1000);
//     } else {
//       console.log("❌ Backend returned error:", data);
//       Toast.show({
//         type: "error",
//         text1: "Backend Error",
//         text2: data.error || data.message || "Failed to login with Google",
//       });
//     }
//   } catch (error: any) {
//     console.log("❌❌❌ CAUGHT ERROR ❌❌❌");
//     console.log("Error type:", error.constructor.name);
//     console.log("Error message:", error.message);
//     console.log("Error stack:", error.stack);
//     console.log("Full error object:", JSON.stringify(error, null, 2));
    
//     let userMessage = error.message || "Google sign-in failed";
    
//     if (error.message === "Network request failed") {
//       userMessage = "Cannot connect to server at www.milonbook.in. Is your backend running?";
//     }
    
//     Toast.show({
//       type: "error",
//       text1: "Error",
//       text2: userMessage,
//     });
//   }
// };

//   // ✅ Step navigation
//   const handleNext = async () => {
//     if (step === 1) {
//       if (signupMethod === "email" && !formData.email) {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Please enter your email",
//         });
//         return;
//       }
//       if (signupMethod === "phone" && !formData.phone) {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Please enter your phone number",
//         });
//         return;
//       }

//       // Check if user already exists before proceeding
//       const userExists = await checkIfUserExists();
//       if (userExists) {
//         return; // Stop here if user already exists
//       }

//       // Go to step 2 (send OTP screen) for both email and phone
//       setStep(2);
//     } else if (step === 4) {
//       if (!formData.password || !formData.confirmPassword) {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Please fill both password fields",
//         });
//         return;
//       }
//       if (formData.password !== formData.confirmPassword) {
//         Toast.show({
//           type: "error",
//           text1: "Error",
//           text2: "Passwords do not match",
//         });
//         return;
//       }
//       setStep(5);
//     }
//   };

//   const handleBack = () => {
//     if (step > 1) {
//       setStep((prev) => (prev - 1) as SignupStep);
//       // Reset OTP when going back
//       if (step === 3) {
//         setFormData({ ...formData, otp: "" });
//         setConfirmation(null);
//       }
//     } else {
//       navigation.goBack();
//     }
//   };

//   // ✅ Step UI
//   const renderStepContent = () => {
//     switch (step) {
//       case 1:
//         return (
//           <>
//             <Text style={styles.title}>Create Account</Text>
//             <Text style={styles.subtitle}>
//               Join us and start sharing your moments
//             </Text>

//             {signupMethod === "email" ? (
//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Email</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="your@email.com"
//                   placeholderTextColor="#94a3b8"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   value={formData.email}
//                   onChangeText={(text) => setFormData({ ...formData, email: text })}
//                 />
//               </View>
//             ) : (
//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>Phone Number</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="+91 9876543210"
//                   placeholderTextColor="#94a3b8"
//                   keyboardType="phone-pad"
//                   value={formData.phone}
//                   onChangeText={(text) => setFormData({ ...formData, phone: text })}
//                 />
//               </View>
//             )}

//             <TouchableOpacity
//               onPress={() => setSignupMethod(signupMethod === "email" ? "phone" : "email")}
//             >
//               <Text style={styles.switchText}>
//                 {signupMethod === "email"
//                   ? "Sign up with mobile number"
//                   : "Sign up with email "}
//               </Text>
//             </TouchableOpacity>

//             <LinearGradient
//               colors={["#00B5D8", "#7C3AED", "#EC4899"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.gradientButton}
//             >
//               <TouchableOpacity 
//                 style={styles.button} 
//                 onPress={handleNext}
//                 disabled={loading}
//               >
//                 <Text style={styles.buttonText}>
//                   {loading ? "Verifying..." : "Next"}
//                 </Text>
//               </TouchableOpacity>
//             </LinearGradient>

//             <View style={styles.dividerContainer}>
//               <View style={styles.divider} />
//               <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
//               <View style={styles.divider} />
//             </View>

//             {/* <View style={styles.socialContainer}>
//               <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignup}>
//                 <Icon name="google" size={20} color="#DB4437" solid />
//                 <Text style={styles.socialText}>Google</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.socialButton} onPress={handleFacebookSignup}>
//                 <Icon name="facebook" size={20} color="#1877F2" solid />
//                 <Text style={styles.socialText}>Facebook</Text>
//               </TouchableOpacity>
//             </View> */}
//                   <View style={styles.socialWrapper}>
//                                 <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignup} activeOpacity={0.7}>
//                                   <Image source={require('../assets/google.jpeg')} style={styles.socialIcon} resizeMode="contain" />
//                                   <Text style={styles.socialText}>Google</Text>
//                                 </TouchableOpacity>
            
//                                 <TouchableOpacity style={styles.socialButton} onPress={handleFacebookSignup} activeOpacity={0.7}>
//                                   <Image source={require('../assets/facebook.png')} style={styles.socialIconFb} resizeMode="contain" />
//                                   <Text style={styles.socialText}>Facebook</Text>
//                                 </TouchableOpacity>
//                               </View>
            

//             <View style={styles.footer}>
//               <Text style={styles.footerText}>
//                 Already have an account?{" "}
//                 <Text
//                   style={styles.loginLink}
//                   onPress={() => navigation.navigate("Login")}
//                 >
//                   Login
//                 </Text>
//               </Text>
//             </View>
//           </>
//         );

//       case 2:
//         return (
//           <>
//             <Text style={styles.title}>
//               {signupMethod === "email" ? "Verify Email" : "Verify Phone"}
//             </Text>
//             <Text style={styles.subtitle}>
//               We'll send a verification code to{" "}
//               {signupMethod === "email" ? formData.email : formData.phone}
//             </Text>

//             <LinearGradient
//               colors={["#00B5D8", "#7C3AED", "#EC4899"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.gradientButton}
//             >
//               <TouchableOpacity
//                 style={styles.button}
//                 onPress={signupMethod === "email" ? handleSendEmailOTP : handleSendPhoneOTP}
//                 disabled={loading}
//               >
//                 <Text style={styles.buttonText}>
//                   {loading ? "Sending..." : "Send OTP"}
//                 </Text>
//               </TouchableOpacity>
//             </LinearGradient>
//           </>
//         );

//       case 3:
//         return (
//           <>
//             <Text style={styles.title}>Enter OTP</Text>
//             <Text style={styles.subtitle}>
//               Enter the 6-digit code sent to{" "}
//               {signupMethod === "email" ? formData.email : formData.phone}
//             </Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>OTP Code</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="000000"
//                 placeholderTextColor="#94a3b8"
//                 keyboardType="number-pad"
//                 maxLength={6}
//                 value={formData.otp}
//                 onChangeText={(text) => setFormData({ ...formData, otp: text })}
//               />
//             </View>

//             <TouchableOpacity
//               onPress={signupMethod === "email" ? handleSendEmailOTP : handleSendPhoneOTP}
//             >
//               <Text style={styles.switchText}>Resend OTP</Text>
//             </TouchableOpacity>

//             <LinearGradient
//               colors={["#00B5D8", "#7C3AED", "#EC4899"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.gradientButton}
//             >
//               <TouchableOpacity
//                 style={styles.button}
//                 onPress={signupMethod === "email" ? handleVerifyEmailOTP : handleVerifyPhoneOTP}
//                 disabled={loading}
//               >
//                 <Text style={styles.buttonText}>
//                   {loading ? "Verifying..." : "Verify OTP"}
//                 </Text>
//               </TouchableOpacity>
//             </LinearGradient>
//           </>
//         );

//       case 4:
//         return (
//           <>
//             <Text style={styles.title}>Set Password</Text>
//             <Text style={styles.subtitle}>
//               Create a strong password to secure your account
//             </Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Password</Text>
//               <TextInput
//                 style={styles.input}
//                 secureTextEntry
//                 placeholder="Enter password"
//                 placeholderTextColor="#94a3b8"
//                 value={formData.password}
//                 onChangeText={(text) => setFormData({ ...formData, password: text })}
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Confirm Password</Text>
//               <TextInput
//                 style={styles.input}
//                 secureTextEntry
//                 placeholder="Confirm password"
//                 placeholderTextColor="#94a3b8"
//                 value={formData.confirmPassword}
//                 onChangeText={(text) =>
//                   setFormData({ ...formData, confirmPassword: text })
//                 }
//               />
//             </View>

//             <LinearGradient
//               colors={["#00B5D8", "#7C3AED", "#EC4899"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.gradientButton}
//             >
//               <TouchableOpacity style={styles.button} onPress={handleNext}>
//                 <Text style={styles.buttonText}>Next</Text>
//               </TouchableOpacity>
//             </LinearGradient>
//           </>
//         );

//       case 5:
//         return (
//           <>
//             <Text style={styles.title}>Your Name</Text>
//             <Text style={styles.subtitle}>
//               Tell us what we should call you
//             </Text>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Full Name</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your name"
//                 placeholderTextColor="#94a3b8"
//                 value={formData.name}
//                 onChangeText={(text) => setFormData({ ...formData, name: text })}
//               />
//             </View>

//             <LinearGradient
//               colors={["#00B5D8", "#7C3AED", "#EC4899"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.gradientButton}
//             >
//               <TouchableOpacity
//                 style={styles.button}
//                 onPress={handleRegister}
//                 disabled={loading}
//               >
//                 <Text style={styles.buttonText}>
//                   {loading ? "Registering..." : "Sign Up"}
//                 </Text>
//               </TouchableOpacity>
//             </LinearGradient>
//           </>
//         );
//     }
//   };

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle="dark-content" backgroundColor="white" />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.container}
//       >
//         {step > 1 && (
//           <View style={styles.header}>
//             <TouchableOpacity onPress={handleBack} style={styles.goBackButton}>
//               <Text style={styles.goBackText}>Go Back</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         <ScrollView
//           contentContainerStyle={styles.scroll}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.innerContainer}>
//             <Image
//               source={require("../assets/milobook2.png")}
//               style={styles.logo}
//               resizeMode="contain"
//             />
//             {renderStepContent()}
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaProvider>
//   );
// }

// // ============ Styles ============
// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "white" },
// //   header: {
// //     paddingHorizontal: 20,
// //     paddingTop: 40,
// //     paddingBottom: 16,
// //     backgroundColor: "white",
// //   },
// //   goBackButton: {
// //     alignSelf: "flex-start",
// //     paddingVertical: 8,
// //     paddingHorizontal: 16,
// //     backgroundColor: "#f1f5f9",
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: "#e2e8f0",
// //   },
// //   goBackText: {
// //     fontSize: 14,
// //     color: "#475569",
// //     fontWeight: "600",
// //   },
// //   scroll: {
// //     flexGrow: 1,
// //     justifyContent: "flex-start",
// //     alignItems: "center",
// //     padding: 24,
// //     paddingTop: 60,
// //   },
// //   innerContainer: { width: "100%", alignItems: "center" },
// //   logo: { width: 90, height: 90, marginBottom: 8 },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: "700",
// //     color: "#111827",
// //     marginBottom: 8,
// //     textAlign: "center",
// //   },
// //   subtitle: {
// //     fontSize: 14,
// //     color: "#64748b",
// //     marginBottom: 24,
// //     textAlign: "center",
// //   },
// //   inputGroup: { width: "100%", marginBottom: 16 },
// //   label: { color: "#475569", fontSize: 14, marginBottom: 8, fontWeight: "500" },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: "#cbd5e1",
// //     borderRadius: 10,
// //     padding: 14,
// //     fontSize: 15,
// //     color: "#111827",
// //     backgroundColor: "white",
// //   },
// //   switchText: {
// //     color: "#7c3aed",
// //     marginVertical: 8,
// //     fontSize: 16,
// //     fontWeight: "600",
// //     textAlign: "center",
// //   },
// //   gradientButton: {
// //     borderRadius: 10,
// //     width: "100%",
// //     marginTop: 8,
// //   },
// //   button: { padding: 14, alignItems: "center" },
// //   buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
// //   dividerContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginVertical: 20,
// //     width: "100%",
// //   },
// //   divider: { flex: 1, height: 1, backgroundColor: "#e2e8f0" },
// //   dividerText: { fontSize: 10, color: "#94a3b8", marginHorizontal: 8 },
// //   socialContainer: { flexDirection: "row", gap: 8, width: "100%" },
// //   // socialButton: {
// //   //   flexDirection: "row",
// //   //   flex: 1,
// //   //   alignItems: "center",
// //   //   justifyContent: "center",
// //   //   borderWidth: 1,
// //   //   borderColor: "#e2e8f0",
// //   //   padding: 12,
// //   //   borderRadius: 10,
// //   //   backgroundColor: "white",
// //   //   gap: 8,
// //   // },
// //   // socialText: { color: "#111827", fontSize: 13, fontWeight: "500" },
// //   socialWrapper: { 
// //     flexDirection: 'row', 
// //     gap: 8 
// //   },
// //   socialButton: { 
// //     flex: 1, 
// //     height: 44, 
// //     flexDirection: 'row', 
// //     alignItems: 'center', 
// //     justifyContent: 'center', 
// //     backgroundColor: '#f8fafc', 
// //     borderWidth: 1.5, 
// //     borderColor: '#e2e8f0', 
// //     borderRadius: 10 
// //   },
// //   socialIcon: { 
// //     width: 24, 
// //     height: 24, 
// //     marginRight: 6 
// //   },
// //   socialIconFb: { 
// //     width: 32, 
// //     height: 32, 
// //     marginRight: 6 
// //   },
// //   socialText: { 
// //     fontSize: 13, 
// //     fontWeight: '600', 
// //     color: '#1e293b' 
// //   },
  
// //   footer: { marginTop: 20, alignItems: "center" },
// //   footerText: { color: "#94a3b8", fontSize: 14 },
// //   loginLink: { color: "#7c3aed", fontWeight: "600" },
// // });
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "white" },
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 40,
//     paddingBottom: 16,
//     backgroundColor: "white",
//   },
//   goBackButton: {
//     alignSelf: "flex-start",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: "#f1f5f9",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   goBackText: {
//     fontSize: 14,
//     color: "#475569",
//     fontWeight: "600",
//   },
//   scroll: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//     paddingVertical: 20,
//   },
//   innerContainer: { width: "100%", alignItems: "center" },
//   logo: { width: 80, height: 80, marginBottom: 8 },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 6,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 13,
//     color: "#64748b",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   inputGroup: { width: "100%", marginBottom: 14 },
//   label: { color: "#475569", fontSize: 13, marginBottom: 6, fontWeight: "500" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#cbd5e1",
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 15,
//     color: "#111827",
//     backgroundColor: "white",
//     height: 46,
//   },
//   switchText: {
//     color: "#7c3aed",
//     marginVertical: 8,
//     fontSize: 14,
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   gradientButton: {
//     borderRadius: 10,
//     width: "100%",
//     marginTop: 6,
//   },
//   button: { padding: 13, alignItems: "center" },
//   buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
//   dividerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 16,
//     width: "100%",
//   },
//   divider: { flex: 1, height: 1, backgroundColor: "#e2e8f0" },
//   dividerText: { fontSize: 10, color: "#94a3b8", marginHorizontal: 8 },
//   socialContainer: { flexDirection: "row", gap: 8, width: "100%" },
//   socialWrapper: { 
//     flexDirection: 'row', 
//     gap: 8,
//     width: "100%",
//   },
//   socialButton: { 
//     flex: 1, 
//     height: 44, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     backgroundColor: '#f8fafc', 
//     borderWidth: 1.5, 
//     borderColor: '#e2e8f0', 
//     borderRadius: 10 
//   },
//   socialIcon: { 
//     width: 22, 
//     height: 22, 
//     marginRight: 6 
//   },
//   socialIconFb: { 
//     width: 28, 
//     height: 28, 
//     marginRight: 6 
//   },
//   socialText: { 
//     fontSize: 13, 
//     fontWeight: '600', 
//     color: '#1e293b' 
//   },
//   footer: { marginTop: 16, alignItems: "center" },
//   footerText: { color: "#94a3b8", fontSize: 13 },
//   loginLink: { color: "#7c3aed", fontWeight: "600" },
// });
// export default RegisterScreen;