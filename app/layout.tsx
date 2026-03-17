// app/layout.tsx
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../css/globals.css';
import '../css/home.css';
import '../css/basic_template.css';
import '../css/contact.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}