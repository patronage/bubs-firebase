import { AuthProvider } from 'components/Auth/contexts/AuthContext';

import Footer from 'components/Footer';
import Header from 'components/Header';
import Meta from 'components/Meta';

export default function LayoutDefault({
  children,
  title,
  description,
  image,
  seo,
}) {
  return (
    <>
      <AuthProvider>
        <Meta
          title={title}
          description={description}
          image={image}
          seo={seo}
        />
        <Header />
        {children}
        <Footer />
      </AuthProvider>
    </>
  );
}
