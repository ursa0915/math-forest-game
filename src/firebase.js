import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBSouq9CYlcM2cWbwNDrfovU8ajiodAu-U",
    authDomain: "math-forest-game.firebaseapp.com",
    projectId: "math-forest-game",
    storageBucket: "math-forest-game.firebasestorage.app",
    messagingSenderId: "471735424818",
    appId: "1:471735424818:web:524ee4ff6bab14e1cb292b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
