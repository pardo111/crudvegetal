import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdyencyyhroIamApwhZc6hbJ0bt6f1Gys",
  authDomain: "crudvegetal.firebaseapp.com",
  projectId: "crudvegetal",
  storageBucket: "crudvegetal.firebasestorage.app",
  messagingSenderId: "442884297866",
  appId: "1:442884297866:web:bbe249c03ca4f85b158973"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
