'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';

interface AuthModalContextType {
  openSignIn: () => void;
  openSignUp: () => void;
  closeModals: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function useAuthModal(): AuthModalContextType {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}

export function AuthModalProvider({ children }: { children: ReactNode }): ReactNode {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const openSignIn = useCallback(() => {
    setShowSignUp(false);
    setShowSignIn(true);
  }, []);

  const openSignUp = useCallback(() => {
    setShowSignIn(false);
    setShowSignUp(true);
  }, []);

  const closeModals = useCallback(() => {
    setShowSignIn(false);
    setShowSignUp(false);
  }, []);

  return (
    <AuthModalContext.Provider value={{ openSignIn, openSignUp, closeModals }}>
      {children}
      <SignInModal
        isOpen={showSignIn}
        onClose={closeModals}
        onSwitchToSignUp={openSignUp}
      />
      <SignUpModal
        isOpen={showSignUp}
        onClose={closeModals}
        onSwitchToSignIn={openSignIn}
      />
    </AuthModalContext.Provider>
  );
}
