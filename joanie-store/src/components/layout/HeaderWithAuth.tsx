'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from './Header';
import SignInModal from '@/components/auth/SignInModal';
import SignUpModal from '@/components/auth/SignUpModal';
import UserMenu from '@/components/auth/UserMenu';

export default function HeaderWithAuth() {
  const { data: session } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      <Header
        isLoggedIn={!!session}
        onAccountClick={() => setShowSignIn(true)}
        userMenu={session ? <UserMenu /> : null}
      />

      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }}
      />

      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }}
      />
    </>
  );
}
