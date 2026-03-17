import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const { user, error, loading, register, login, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setLocalError('');
    setSuccess('');
    clearError();
  };

  const handleToggle = () => {
    setIsSignUp((v) => !v);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');
    clearError();

    if (isSignUp) {
      if (!name.trim()) { setLocalError('Please enter your name.'); return; }
      if (password.length < 6) { setLocalError('Password must be at least 6 characters.'); return; }
      if (password !== confirmPassword) { setLocalError('Passwords do not match.'); return; }
      const ok = await register({ name, email, password });
      if (ok) setSuccess('Account created! Signing you in…');
    } else {
      const ok = await login({ email, password });
      if (ok) setSuccess('Welcome back! Signing you in…');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-pink-200 shadow-sm p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-black">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-1 text-gray-600 text-sm">
              {isSignUp
                ? 'Your account is saved locally — your ID will persist even after the browser closes.'
                : 'Sign in to access your saved profile and preferences.'}
            </p>
          </div>

          {/* Error banner */}
          {displayError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {displayError}
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full rounded-lg border border-pink-300 px-3 py-2.5 text-black placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="Your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-pink-300 px-3 py-2.5 text-black placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full rounded-lg border border-pink-300 px-3 py-2.5 text-black placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder={isSignUp ? 'At least 6 characters' : '••••••••'}
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-pink-300 px-3 py-2.5 text-black placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="Repeat your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-rose-400 text-white py-2.5 font-medium hover:bg-rose-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={handleToggle}
              className="font-medium text-black hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up for free'}
            </button>
          </p>

          {isSignUp && (
            <p className="mt-4 text-xs text-center text-gray-500">
              Your account is stored in your browser's local storage. It persists across sessions on this device.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
