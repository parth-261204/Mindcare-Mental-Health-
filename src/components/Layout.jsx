import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ChatWidget from './ChatWidget';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
      <ChatWidget />
      <header className="border-b border-pink-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-black tracking-tight hover:text-gray-800 transition-colors">
            Mindcare
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-800 hover:text-black font-medium transition-colors">
              Home
            </Link>
            <span className="flex items-center gap-3">
              <Link to="/questionnaire" className="text-gray-800 hover:text-black font-medium transition-colors">
                Questionnaire
              </Link>
              <Link to="/chat" className="text-gray-800 hover:text-black font-medium transition-colors">
                Chatbot
              </Link>
              <Link to="/articles" className="text-gray-800 hover:text-black font-medium transition-colors">
                Articles
              </Link>
            </span>
            {user ? (
              <div className="relative">
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
                    <div className="absolute right-0 mt-2 w-60 bg-white border border-pink-200 rounded-xl shadow-lg z-20 py-2">
                      <div className="px-4 py-3 border-b border-pink-100">
                        <p className="text-sm font-semibold text-black truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">ID: {user.id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-pink-50 transition-colors"
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
                className="rounded-lg bg-rose-400 text-white px-4 py-2 text-sm font-medium hover:bg-rose-500 transition-colors"
              >
                Login / Sign in
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-pink-200 bg-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        </div>
      </footer>
    </div>
  );
}
