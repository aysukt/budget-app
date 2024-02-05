import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATAbHz7X7QMstqsckv0R2Gg7OZXl9cvhw",
  authDomain: "expense-tracker-1350f.firebaseapp.com",
  projectId: "expense-tracker-1350f",
  storageBucket: "expense-tracker-1350f.appspot.com",
  messagingSenderId: "496979237015",
  appId: "1:496979237015:web:bc190724c198a0610231d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

// Firebase kullanıcı oluşturma fonksiyonu
const signUpWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Kullanıcı oluşturuldu:", user.uid);
    return user;
  } catch (error) {
    console.error("Kullanıcı oluşturulurken hata oluştu:", error.message);
    throw error;
  }
};

// Firebase kullanıcı giriş fonksiyonu
const signInWithEmailAndPasswordHandler = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Kullanıcı girişi yapıldı:", user.uid);
    return user;
  } catch (error) {
    console.error("Kullanıcı girişi sırasında hata oluştu:", error.message);
    throw error;
  }
};

export { auth, signUpWithEmailAndPassword, signInWithEmailAndPasswordHandler };
