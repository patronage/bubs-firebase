import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import firebase from 'lib/firebase';
import _get from 'lodash/get';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useContext, useEffect } from 'react';
import GoogleButton from 'react-google-button';
import AuthContext from '../contexts/AuthContext';

import styles from './Login.module.scss';

export default function Login({ onLogin }) {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [error, setError] = useState();

  useEffect(() => {
    if (auth && auth.loggedIn) {
      router.push('/dashboard');
    }
  }, [auth, router]);

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();

    const signin = await signInWithPopup(firebase.auth, provider);

    // If a brand new user tries to login with Google, we need to cancel the action
    // The alternative is forcing user into a Stripe reg flow when they haven't had the chance
    // to review the call to action and subscription details on the registration landing page

    if (_get(signin, 'additionalUserInfo.isNewUser')) {
      await signin.user.delete();

      return setError("You don't currently have an account");
    }

    return onLogin();
  }

  async function handlePasswordLogin(values) {
    try {
      await signInWithEmailAndPassword(
        firebase.auth,
        values.email_address,
        values.password,
      );

      return onLogin();
    } catch (error) {
      setError(
        "Your email address or password was incorrect, or you don't currently have an account",
      );
    }
  }

  function renderMessage() {
    if (router.query.message === 'password-reset') {
      return (
        <div>Please check your email for a password reset email</div>
      );
    }
  }

  return (
    <>
      {renderMessage()}

      <h3 className="mb-5">Login to your account</h3>
      <GoogleButton
        className="d-inline-block mb-3"
        onClick={handleGoogleLogin}
      />
      <hr className="mb-3" />
      <Formik
        onSubmit={handlePasswordLogin}
        initialValues={{
          given_name: '',
          family_name: '',
          email_address: '',
          password: '',
        }}
      >
        <Form>
          <div className={styles.form}>
            <div className="field-group text-left mb-3">
              <label>Email Address</label>
              <Field
                type="email"
                name="email_address"
                className="form-control"
              />
            </div>
            <div className="field-group text-left mb-3">
              <label className="">Password</label>
              <Field
                type="password"
                name="password"
                className="form-control"
              />
            </div>
            <div className="field-group mb-3">
              <button type="submit" className="btn btn-secondary">
                Continue
              </button>
            </div>
            <small>
              First login or forgot your password?{' '}
              <Link href="/password-reset">
                <a>Reset it here</a>
              </Link>
              .
            </small>
            {error && <div className="error">Error: {error}</div>}
          </div>
        </Form>
      </Formik>
    </>
  );
}
