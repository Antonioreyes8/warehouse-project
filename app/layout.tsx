// app/layout.tsx
import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css'
import './home/home.module.css';
import './contact/contact.module.css';
import './components/components.css';

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