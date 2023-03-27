import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth';

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBTVuEutPkU-OQkYuaUlwAj_LMTZCoHO4o",
  authDomain: "extensionmvp.firebaseapp.com",
  projectId: "extensionmvp",
  storageBucket: "extensionmvp.appspot.com",
  messagingSenderId: "969758339052",
  appId: "1:969758339052:web:0b618fe07f921e48b29ac9",
  measurementId: "G-SJL0HTMCXH"
}
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const firebase = initializeApp(FIREBASE_CONFIG)
export const firebaseAuth = getAuth(firebase)




