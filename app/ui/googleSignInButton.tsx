import { signIn } from '@/auth';
import { Button } from './button';
import { useState, useTransition } from 'react';
import { signInOAuth } from '../lib/actions';

const NextAuthProviders = () => {
  const handleGoogleSignIn = async () => {
    try {
      // Call signIn with the provider ID ('google' in this case)
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };
  const [error, setError] = useState(null);
  const [, startTransition] = useTransition();
  return (
    <div className="m-3 flex items-center justify-center border-t p-4">
      {error && <div>{error}</div>}
      {/* <Button
        type="button"
        onClick={() => {
          startTransition(async () => {
            const result = await signInOAuth({
              providerId: 'google',
            });
            if (result?.status === 'error') {
              // setError(result.errorMessage);
              console.log(result.errorMessage);
            }
          });
        }}
      > */}
      <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>
    </div>
  );
};

export default NextAuthProviders;
