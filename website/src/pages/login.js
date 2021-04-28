import Login from 'components/Auth/Login';
import LayoutDefault from 'components/layouts/LayoutDefault';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();

  function onLogin() {
    router.push('/dashboard');
  }

  return (
    <LayoutDefault title="">
      <section className="section-padded">
        <div className="container">
          <div className="row">
            <div className="col">
              <Login onLogin={onLogin} />
            </div>
          </div>
        </div>
      </section>
    </LayoutDefault>
  );
}
