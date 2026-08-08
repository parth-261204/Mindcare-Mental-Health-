import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import ChatWidget from './ChatWidget';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  // Initials avatar from user name
  const initials = user
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 text-black">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ChatWidget />
      <header className="border-b border-pink-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 glass" role="banner">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 transition-colors hover:text-rose-700" onClick={() => setMenuOpen(false)}>
            <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-xl bg-rose-500 text-lg text-white shadow-sm">♥</span>
            Mindcare
          </Link>
          <button type="button" className="rounded-lg p-2 text-slate-800 hover:bg-rose-50 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="site-menu" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
            <span className="text-xl" aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
          </button>
          <div id="site-menu" className={`${menuOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-16 flex-col gap-1 border-b border-rose-100 bg-white p-4 shadow-lg md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
            <NavItem to="/" end label="Home" close={() => setMenuOpen(false)} />
            <NavItem to="/questionnaire" label="Check-in" close={() => setMenuOpen(false)} />
            <NavItem to="/chat" label="Chat" close={() => setMenuOpen(false)} />
            <NavItem to="/articles" label="Articles" close={() => setMenuOpen(false)} />
            {user ? (
              <div className="relative mt-2 border-t border-rose-100 pt-3 md:mt-0 md:border-0 md:pt-0">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full focus:outline-none"
                  aria-label="User menu"
                >
                  <span className="w-9 h-9 rounded-full bg-rose-400 text-white flex items-center justify-center text-sm font-semibold shadow">
                    {initials}
                  </span>
                  <span className="hidden sm:block text-sm font-medium text-black max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-60 bg-white border border-pink-200 rounded-xl shadow-lg z-20 py-2" role="menu">
                      <div className="px-4 py-3 border-b border-pink-100">
                        <p className="text-sm font-semibold text-black truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">ID: {user.id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-pink-50 transition-colors" role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="mt-2 rounded-lg bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-600 md:mt-0"
                onClick={() => setMenuOpen(false)}
              >
                Login / Sign in
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main id="main-content" className="flex-1" role="main" tabIndex="-1">
        <Outlet />
      </main>
      <footer className="border-t border-pink-200 bg-pink-100" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 rounded-xl border border-rose-200 bg-white p-5 sm:flex sm:items-center sm:justify-between">
            <div><h2 className="font-semibold text-black">Need urgent help?</h2><p className="mt-1 text-sm text-gray-700">If you may harm yourself or cannot stay safe, contact emergency services or a crisis line now.</p></div>
            <Link to="/support" className="mt-4 inline-flex rounded-lg bg-rose-500 px-4 py-2 font-medium text-white hover:bg-rose-600 sm:mt-0">Get urgent support</Link>
          </div>
          <h2 className="text-lg font-semibold text-black mb-4">Helpline numbers</h2>
          <p className="text-gray-800 text-sm mb-6 max-w-2xl">
            If you or someone you know is in distress, please reach out to these organizations. They offer confidential support.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-pink-200">
              <h3 className="font-medium text-black">National Mental Health Helpline</h3>
              <a href="tel:1800-599-0019" className="text-gray-800 hover:text-black mt-1 block">1800-599-0019</a>
              <p className="text-sm text-gray-700 mt-1">24/7, free & confidential</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-pink-200">
              <h3 className="font-medium text-black">Vandrevala Foundation</h3>
              <a href="tel:18602662345" className="text-gray-800 hover:text-black mt-1 block">1860-2662-345</a>
              <p className="text-sm text-gray-700 mt-1">24/7 mental health support</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-pink-200">
              <h3 className="font-medium text-black">iCall (TISS)</h3>
              <a href="tel:9152987821" className="text-gray-800 hover:text-black mt-1 block">+91 9152987821</a>
              <p className="text-sm text-gray-700 mt-1">Mon–Sat, 10 AM–8 PM</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-pink-200">
              <h3 className="font-medium text-black">Snehi</h3>
              <a href="tel:9117822660122" className="text-gray-800 hover:text-black mt-1 block">+91 22 66012333</a>
              <p className="text-sm text-gray-700 mt-1">Mental health support</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-pink-200">
              <h3 className="font-medium text-black">Sumaitri</h3>
              <a href="tel:23389090" className="text-gray-800 hover:text-black mt-1 block">2338 9090</a>
              <p className="text-sm text-gray-700 mt-1">Crisis intervention (Delhi)</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-pink-200">
              <h3 className="font-medium text-black">Cooj Mental Health Foundation</h3>
              <a href="tel:8322252525" className="text-gray-800 hover:text-black mt-1 block">832 225 2525</a>
              <p className="text-sm text-gray-700 mt-1">Goa – emotional support</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm mt-8">
            © Mindcare. This site is for informational purposes. In a crisis, please contact a helpline or emergency services.
          </p>
          <Link to="/privacy" className="mt-2 inline-block text-sm font-medium text-gray-700 underline hover:text-black">Privacy & safety</Link>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ to, label, end, close }) {
  return <NavLink to={to} end={end} onClick={close} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-rose-50 text-rose-700' : 'text-slate-700 hover:bg-rose-50 hover:text-rose-700'}`}>{label}</NavLink>;
}
