import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { auth, authService } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isOnboarded: false,
          preferences: {}
        };

        console.log('✅ User authenticated:', firebaseUser.email);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log('❌ User signed out');
        setUser(null);
        setIsAuthenticated(false);
      }
      
      // Always set loading to false when auth state changes
      setLoading(false);
      
      // Mark as initialized
      if (!initializedRef.current) {
        initializedRef.current = true;
      }
    });

    return unsubscribe;
  }, []);

  // Email/Password Login
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const result = await authService.signInWithEmail(email, password);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      // Loading will be set to false by onAuthStateChanged listener
    } catch (error) {
      console.error('Google sign-in error:', error);
      setLoading(false);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    try {
      setLoading(true);
      const result = await authService.createAccount(email, password, displayName);
      return result.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    login,
    signUp,
    signInWithGoogle,
    logout,
    setUser
  }), [user, isAuthenticated, loading, login, signUp, signInWithGoogle, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
