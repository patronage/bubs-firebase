import { onAuthStateChanged } from 'firebase/auth';
import firebase from 'lib/firebase';
import React, { useEffect, useState } from 'react';

const DEFAULT_AUTH = {
  jwt: null,
  admin: null,
  loggedIn: null,
  profile: {},
};

let AUTH_CACHE = DEFAULT_AUTH;

const AuthContext = React.createContext(DEFAULT_AUTH);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(AUTH_CACHE);

  useEffect(() => {
    (async function () {
      onAuthStateChanged(firebase.auth, async (user) => {
        if (user) {
          const auth_state = {
            jwt: null,
            admin: null,
            loggedIn: true,
            profile: user.toJSON(),
          };

          AUTH_CACHE = auth_state;
          setAuth(auth_state);

          // Determine if user is an admin after setting the login state to
          // avoid making everyday users wait for this API repsonse to complete
          /*const token = await firebase
            .auth()
            .currentUser.getIdTokenResult();
          const jwt = await firebase.auth().currentUser.getIdToken();

          if (token.claims.admin) {
            const auth_state = {
              jwt,
              admin: true,
              loggedIn: true,
              profile: user.toJSON(),
            };

            AUTH_CACHE = auth_state;
            setAuth(auth_state);
          } else {
            const auth_state = {
              jwt,
              admin: false,
              loggedIn: true,
              profile: user.toJSON(),
            };

            AUTH_CACHE = auth_state;
            setAuth(auth_state);
          }*/
        } else {
          const auth_state = {
            jwt: null,
            admin: false,
            loggedIn: false,
            profile: {},
          };

          AUTH_CACHE = auth_state;
          setAuth(auth_state);
        }
      });
    })();
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
