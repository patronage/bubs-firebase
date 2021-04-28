import { getApp, initializeApp } from 'firebase/app';
import {
  getAuth,
  useAuthEmulator as authEmulator,
} from 'firebase/auth';
import {
  getFirestore,
  useFirestoreEmulator as firestoreEmulator,
} from 'firebase/firestore';

let auth, firestore;

try {
  let firebaseApp;

  try {
    firebaseApp = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  } catch (error) {
    firebaseApp = getApp();
  }

  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);

  authEmulator(auth, 'http://localhost:9099');
  firestoreEmulator(firestore, 'localhost', 8080);
} catch (error) {
  console.error(error.message);
  console.log('Firebase not initalized');
}

export default { auth, firestore };
