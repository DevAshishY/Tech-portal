import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCdoOhEl50KBWonxF40zM7wjKKyRbdUVG8",
  authDomain: "anju-60455.firebaseapp.com",
  projectId: "anju-60455",
  storageBucket: "anju-60455.firebasestorage.app",
  messagingSenderId: "360127623363",
  appId: "1:360127623363:android:59fbca5b7633478dcf7276",
};

// ✅ Ensure Firebase is initialized only once
export const firebaseApp = initializeApp(firebaseConfig);
