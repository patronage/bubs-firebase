import { sendPasswordResetEmail } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import firebase from 'lib/firebase';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function PasswordReset({ redirectURL }) {
  const [error, setError] = useState();
  const router = useRouter();

  async function handleReset({ email_address }) {
    try {
      await sendPasswordResetEmail(firebase.auth, email_address, {
        url: redirectURL,
      });

      router.push('/login?message=password-reset');
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <h3>Set or retrieve your password</h3>
      <p>We'll send you a link to set or reset your password</p>

      <Formik
        onSubmit={handleReset}
        initialValues={{
          email_address: '',
        }}
      >
        <Form>
          <div className="row">
            <div className="col-sm-4">
              <div className="field-group">
                <label>Email Address</label>
                <Field
                  type="email"
                  name="email_address"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-sm-2">
              <div className="field-group">
                &nbsp;
                <br />
                <button type="submit" className="btn btn-secondary">
                  Continue
                </button>
              </div>
            </div>
          </div>

          {error && <div className="error">Error: {error}</div>}
        </Form>
      </Formik>
    </>
  );
}
