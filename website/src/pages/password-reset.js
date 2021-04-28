import PasswordReset from 'components/Auth/PasswordReset';
import LayoutDefault from 'components/layouts/LayoutDefault';

export default function PasswordResetPage() {
  return (
    <LayoutDefault title="">
      <section className="section-padded">
        <div className="container">
          <div className="row">
            <div className="col">
              <PasswordReset redirectURL="http://localhost:3000" />
            </div>
          </div>
        </div>
      </section>
    </LayoutDefault>
  );
}
