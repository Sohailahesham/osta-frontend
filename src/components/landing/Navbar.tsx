import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import logo from '@/assets/images/logo.png';

const navLinks = [
  { label: 'الرئيسية', href: '/', active: true },
  { label: 'الأقسام', href: '/categories' },
  { label: 'من نحن', href: '/about' },
  { label: 'اتصل بنا', href: '/contact' },
];

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full" dir="rtl">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between bg-[#FEFEFE70]/50 rounded-3xl shadow-lg">

        {/* Logo — rightmost in RTL */}
        <div className="flex items-center gap-2 shrink-0">
          <Image src={logo} alt="أسطى" width={100} height={40} className="object-contain" />
        </div>

        {/* Nav Links — center */}
        <nav className="hidden md:flex items-center gap-8 ">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-bold transition-colors ${
                link.active
                  ? 'text-[var(--primary-color)] bg-white px-5 py-2 rounded-full shadow-sm'
                  : 'text-white hover:text-[var(--accent-color)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Login Button — leftmost in RTL */}
        <Link
          href="/login"
          className="hidden md:inline-flex bg-[var(--accent-color)] text-[var(--primary-color)] font-black text-sm px-6 py-3 rounded-full hover:bg-[var(--accent-hover)] transition-all whitespace-nowrap shadow-lg"
        >
          تسجيل الدخول
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 mr-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--primary-color)]/95 backdrop-blur-sm px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white font-semibold text-sm hover:text-[var(--accent-color)] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm px-5 py-2.5 rounded-full text-center"
            onClick={() => setMenuOpen(false)}
          >
            تسجيل الدخول
          </Link>
        </div>
      )}
    </header>
  );
}
