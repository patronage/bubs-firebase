import LayoutDefault from 'components/layouts/LayoutDefault';
import AuthWall from '../components/Auth/AuthWall';

export default function IndexPage() {
  return (
    <LayoutDefault title="">
      <AuthWall>
        <section className="section-padded">
          <div className="container">
            <div className="row">
              <div className="col">
                <h3>You're logged in!</h3>
              </div>
            </div>
          </div>
        </section>
      </AuthWall>
    </LayoutDefault>
  );
}
