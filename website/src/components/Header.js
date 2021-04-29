import AuthContext from 'components/Auth/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import firebase from 'lib/firebase';
import Link from 'next/link';
import { useContext } from 'react';
import styles from './Header.module.scss';

export default function Header() {
  const auth = useContext(AuthContext);

  function logout(event) {
    event.preventDefault();
    signOut(firebase.auth);
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className="row">
          <div className="col-8">
            <div className={styles.logo}>
              <Link href="/">
                <h1>Site Title</h1>
              </Link>
            </div>
          </div>
          {auth.loggedIn ? (
            <div className="col-4 text-end">
              <a href="#" onClick={logout}>
                Sign Out
              </a>
            </div>
          ) : (
            <div className="col-4 text-end">
              <Link href="/login">
                <a>Login</a>
              </Link>
              {' | '}
              <Link href="/register">
                <a>Register</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
