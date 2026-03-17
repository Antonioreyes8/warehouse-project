import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer_left">
        <div>
          <p><Link href="/" className="link">Home</Link></p>
          <p><Link href="/about" className="link">Manifesto</Link></p>
          <p>Financial Hub</p>
          <p><Link href="/guidelines" className="link">Community Guidelines</Link></p>
          <p><Link href="/FAQ" className="link">FAQ</Link></p>
          <p>Contact</p>
          <br />
          <p>Denton, Texas</p>
          <p>The Warehouse Project © 2026</p>
        </div>
      </div>

      <div className="footer_right">
      </div>
    </footer>
  );
}