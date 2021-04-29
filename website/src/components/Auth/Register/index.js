import ButtonLoader from 'components/ButtonLoader';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Field, Form, Formik } from 'formik';
import firebase from 'lib/firebase';
import _get from 'lodash/get';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import GoogleButton from 'react-google-button';
import AuthContext from '../contexts/AuthContext';
import styles from './Register.module.scss';

export default function Register({
  onPostRegistration,
  onNormalLogin,
}) {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = null;

  useEffect(() => {
    if (auth && auth.loggedIn & !isLoading) {
      router.push('/dashboard');
    }
  }, [auth, router, isLoading]);

  // This is the first thing that runs post-registration
  // the prop `handlePostRegistration` will run if the user was in fact new
  // and allows the parent component to define what should happen next
  async function postSuccessfulRegistration(
    user,
    isNewUser,
    given_name,
    family_name,
    email_address,
  ) {
    if (!isNewUser) {
      return onNormalLogin();
    }

    await setDoc(doc(firebase.firestore, 'users', user.uid), {
      created_at: serverTimestamp(),
      given_name,
      family_name,
      email_address,
    });

    return onPostRegistration(user.uid);
  }

  async function handleGoogleRegistration() {
    setIsLoading(true);

    const provider = new GoogleAuthProvider();
    const signin = await signInWithPopup(firebase.auth, provider);

    return await postSuccessfulRegistration(
      signin.user,
      _get(signin, 'additionalUserInfo.isNewUser', true),
      _get(signin, 'additionalUserInfo.profile.given_name'),
      _get(signin, 'additionalUserInfo.profile.family_name'),
      _get(signin, 'additionalUserInfo.profile.email'),
    );
  }

  async function handleEmailPasswordRegistration(
    email_address,
    password,
    given_name,
    family_name,
  ) {
    try {
      setIsLoading(true);

      const signin = await createUserWithEmailAndPassword(
        firebase.auth,
        email_address,
        password,
      );

      return await postSuccessfulRegistration(
        signin.user,
        _get(signin, 'additionalUserInfo.isNewUser', true),
        given_name,
        family_name,
        email_address,
      );
    } catch (error) {
      setIsLoading(false);
      throw error.message;
    }
  }

  async function handleSubmit(values) {
    try {
      await handleEmailPasswordRegistration(
        values.email_address,
        values.password,
        values.given_name,
        values.family_name,
      );
    } catch (error) {
      setError(error);
    }
  }

  function validate(values) {
    const errors = {};

    if (!values.given_name) {
      errors.given_name = 'First Name is required';
    }

    if (!values.family_name) {
      errors.family_name = 'Last Name is required';
    }

    if (!values.email_address) {
      errors.email_address = 'Email is required';
    }

    if (values.password.length < 8) {
      errors.password = 'Password must be longer than 8 characters';
    }

    if (values.password !== values.password_verify) {
      errors.password_validate = 'Passwords do not match';
    }

    return errors;
  }

  function renderErrors(errors, touched) {
    const items = [];

    for (const key in errors) {
      if (touched[key]) {
        items.push(errors[key]);
      }
    }

    if (items.length) {
      return (
        <div className="form-errors text-danger text-left">
          Please resolve the following errors to register:
          <ul>
            {items.map((item, key) => (
              <li key={key}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  }

  return (
    <div>
      <div className="d-inline-block">
        <GoogleButton
          label="Sign up with Google"
          onClick={handleGoogleRegistration}
          disabled={isLoggedIn || isLoading}
        />
      </div>
      <hr />
      <Formik
        validate={validate}
        onSubmit={handleSubmit}
        initialValues={{
          given_name: '',
          family_name: '',
          email_address: '',
          password: '',
          password_verify: '',
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className={styles.form}>
              <div className="field-group text-left mb-3">
                <label>First Name</label>
                <Field
                  type="text"
                  name="given_name"
                  className="form-control"
                  disabled={isLoading || isLoggedIn}
                />
              </div>
              <div className="field-group text-left mb-3">
                <label>Last Name</label>
                <Field
                  type="text"
                  name="family_name"
                  className="form-control"
                  disabled={isLoading || isLoggedIn}
                />
              </div>
              <div className="field-group text-left mb-3">
                <label>Email Address</label>
                <Field
                  type="email"
                  name="email_address"
                  className="form-control"
                  disabled={isLoading || isLoggedIn}
                />
              </div>
              <div className="field-group text-left mb-3">
                <label>Password</label>
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  disabled={isLoading || isLoggedIn}
                />
                <div className="form-text">
                  Use upper and lower case letters, numbers, and
                  punctuation characters.
                </div>
              </div>
              <div className="field-group text-left mb-3">
                <label>Verify Password</label>
                <Field
                  type="password"
                  name="password_verify"
                  className="form-control"
                  disabled={isLoading || isLoggedIn}
                />
              </div>
              <div className="field-group mb-3">
                <ButtonLoader
                  idleText="Continue"
                  loadingText="Loading"
                  loading={isLoading}
                  disabled={isLoggedIn}
                />
              </div>
              {renderErrors(errors, touched)}
              {error && <div className="error">Error: {error}</div>}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
