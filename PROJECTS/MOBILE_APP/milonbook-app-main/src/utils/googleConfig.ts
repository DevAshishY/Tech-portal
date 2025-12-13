// src/utils/googleConfig.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
      iosClientId: '643604355623-thrruqdpqcr34aqgget42lhg2s487q35.apps.googleusercontent.com',
    webClientId: '643604355623-iokon1ch9s2dp6th9hibv6ivv6f6umni.apps.googleusercontent.com', // your Web client ID
    offlineAccess: true, // optional, allows getting refresh token
    forceCodeForRefreshToken: true,
  });
};
// src/utils/googleConfig.ts
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// export const configureGoogleSignIn = () => {
//   GoogleSignin.configure({
//     iosClientId: '643604355623-thrruqdpqcr34aqgget42lhg2s487q35.apps.googleusercontent.com',
//     webClientId: '643604355623-iokon1ch9s2dp6th9hibv6ivv6f6umni.apps.googleusercontent.com',
   
//     offlineAccess: true,
//     forceCodeForRefreshToken: true,
//   });
// };