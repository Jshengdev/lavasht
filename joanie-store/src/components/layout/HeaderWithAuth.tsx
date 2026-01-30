'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from './Header';
import SignInModal from '@/components/auth/SignInModal';
import SignUpModal from '@/components/auth/SignUpModal';
import UserMenu from '@/components/auth/UserMenu';

export default function HeaderWithAuth(): JSX.Element {
  const { data: session } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  function handleSwitchToSignUp(): void {
    setShowSignIn(false);
    setShowSignUp(true);
  }

  function handleSwitchToSignIn(): void {
    setShowSignUp(false);
    setShowSignIn(true);
  }

  return (
    <>
      <Header
        isLoggedIn={!!session}
        onAccountClick={() => !session && setShowSignIn(true)}
        userMenu={session ? <UserMenu /> : null}
      />
      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </>
  );
}
