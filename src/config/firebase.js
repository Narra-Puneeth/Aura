import { initializeApp } from 'firebase/app';
import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    getAuth,
    getRedirectResult,
    GoogleAuthProvider,
    setPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    updateProfile
} from 'firebase/auth';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to local storage
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting persistence:', error);
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
googleProvider.addScope('email');
googleProvider.addScope('profile');



export const authService = {
  signInWithEmail: async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  signInWithGoogle: async () => {
    console.log('🚀 Starting Google sign-in...');
    
    try {
      // Set persistence before sign-in
      await setPersistence(auth, browserLocalPersistence);
      
      // Try popup first
      try {
        console.log('📱 Attempting popup method...');
        const result = await signInWithPopup(auth, googleProvider);
        console.log('✅ Popup sign-in successful:', result.user.email);
        return result;
      } catch (popupError) {
        // If popup is blocked, use redirect method instead
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          console.log('⚠️ Popup blocked or closed, using redirect method...');
          await signInWithRedirect(auth, googleProvider);
          return null; // Redirect will handle the result
        }
        throw popupError;
      }
    } catch (error) {
      console.error('❌ Google sign-in failed:', error.code, error.message);
      throw error;
    }
  },

  handleRedirectResult: async () => {
    return await getRedirectResult(auth);
  },

  createAccount: async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  },

  signOut: async () => {
    return await signOut(auth);
  }
};

export default app;
