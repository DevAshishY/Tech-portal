// import auth from '@react-native-firebase/auth';

// /**
//  * Send OTP to the provided phone number
//  * @param {string} phoneNumber - Phone number in E.164 format (e.g., +919876543210)
//  * @returns {Promise<object>} - Confirmation object for OTP verification
//  */
// export const sendOTP = async (phoneNumber) => {
//   try {
//     // ✅ Validate format (E.164)
//     if (!phoneNumber.startsWith('+')) {
//       throw new Error('Phone number must start with + and include country code');
//     }

//     console.log('📱 Sending OTP to:', phoneNumber);

//     // ✅ If it's a Firebase test number, no real SMS will be sent
//     const confirmation = await auth().signInWithPhoneNumber(phoneNumber);

//     console.log('✅ OTP sent successfully (test mode or real SMS depending on Firebase setup)');
//     return confirmation;
//   } catch (error) {
//     console.error('❌ OTP send error:', error);

//     // ✅ Handle common Firebase Auth errors
//     if (error.code === 'auth/invalid-phone-number') {
//       throw new Error('Invalid phone number format. Use E.164 format: +[country code][number]');
//     } else if (error.code === 'auth/quota-exceeded') {
//       throw new Error('SMS quota exceeded. Please try again later.');
//     } else if (error.code === 'auth/app-not-authorized') {
//       throw new Error('App not authorized in Firebase. Check package name and SHA-1 in Firebase.');
//     } else if (error.code === 'auth/missing-client-identifier') {
//       throw new Error('Missing client ID. Make sure google-services.json is added and configured.');
//     }

//     throw error;
//   }
// };

// /**
//  * Verify OTP code
//  * @param {object} confirmation - Confirmation object from sendOTP
//  * @param {string} code - OTP code entered by user
//  * @returns {Promise<object>} - User credential
//  */
// export const verifyOTP = async (confirmation, code) => {
//   try {
//     console.log('🔐 Verifying OTP code...');
//     const userCredential = await confirmation.confirm(code);
//     console.log('✅ OTP verified successfully');
//     return userCredential;
//   } catch (error) {
//     console.error('❌ OTP verification error:', error);

//     if (error.code === 'auth/invalid-verification-code') {
//       throw new Error('Invalid OTP code. Please try again.');
//     } else if (error.code === 'auth/code-expired') {
//       throw new Error('OTP code has expired. Please request a new one.');
//     }

//     throw error;
//   }
// };
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';

const authInstance = getAuth();

/**
 * Send OTP to the provided phone number
 */
export const sendOTP = async (phoneNumber) => {
  try {
    if (!phoneNumber.startsWith('+')) {
      throw new Error('Phone number must start with + and include country code');
    }

    console.log('📱 Sending OTP to:', phoneNumber);

    // Modular API
    const confirmation = await signInWithPhoneNumber(authInstance, phoneNumber);

    console.log('✅ OTP sent successfully');
    return confirmation;
  } catch (error) {
    console.error('❌ OTP send error:', error);
    throw error;
  }
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (confirmation, code) => {
  try {
    console.log('🔐 Verifying OTP code...');
    const userCredential = await confirmation.confirm(code);
    console.log('✅ OTP verified successfully');
    return userCredential;
  } catch (error) {
    console.error('❌ OTP verification error:', error);
    throw error;
  }
};
