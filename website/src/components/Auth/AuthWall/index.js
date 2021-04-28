import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import AuthContext from '../contexts/AuthContext';

export default function AuthWall({ adminOnly, children }) {
  const router = useRouter();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.loggedIn === false) {
      return router.push('/login');
    }

    if (adminOnly && auth.admin === false) {
      return router.push('/dashboard');
    }
  }, [auth, adminOnly, router]);

  if (auth.loggedIn) {
    return children;
  }

  return null;
}
