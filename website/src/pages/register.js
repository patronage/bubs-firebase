import Register from 'components/Auth/Register';
import LayoutDefault from 'components/layouts/LayoutDefault';
import { useRouter } from 'next/router';

export default function PasswordResetPage() {
  const router = useRouter();

  function onRegister() {
    router.push('/dashboard');
  }

  return (
    <LayoutDefault title="">
      <section className="section-padded">
        <div className="container">
          <div className="row">
            <div className="col">
              <Register
                onNormalLogin={onRegister}
                onPostRegistration={onRegister}
              />
            </div>
          </div>
        </div>
      </section>
    </LayoutDefault>
  );
}
