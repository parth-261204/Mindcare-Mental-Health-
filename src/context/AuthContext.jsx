import { createContext, useContext, useState, useEffect } from 'react';

/*
 * AuthContext – stores user accounts and the active session in localStorage.
 * Data survives page reloads and browser restarts.
 *
 * localStorage keys:
 *   mindcare_users   → array of registered user objects
 *   mindcare_session → currently logged-in user object (or null)
 */

const AuthContext = createContext(null);

const USERS_KEY = 'mindcare_users';
const SESSION_KEY = 'mindcare_session';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function saveSession(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Simple hash so passwords aren't stored in plain text
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Keep session in sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SESSION_KEY) {
        setUser(getSession());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const register = async ({ name, email, password }) => {
    setError('');
    setLoading(true);
    try {
      const users = getUsers();
      const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError('An account with this email already exists. Please sign in.');
        setLoading(false);
        return false;
      }
      const hashed = await hashPassword(password);
      const newUser = {
        id: `mc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashed,
        createdAt: new Date().toISOString(),
      };
      saveUsers([...users, newUser]);
      const session = { id: newUser.id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt };
      saveSession(session);
      setUser(session);
      setLoading(false);
      return true;
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const login = async ({ email, password }) => {
    setError('');
    setLoading(true);
    try {
      const users = getUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!found) {
        setError('No account found with that email. Please sign up first.');
        setLoading(false);
        return false;
      }
      const hashed = await hashPassword(password);
      if (found.passwordHash !== hashed) {
        setError('Incorrect password. Please try again.');
        setLoading(false);
        return false;
      }
      const session = { id: found.id, name: found.name, email: found.email, createdAt: found.createdAt };
      saveSession(session);
      setUser(session);
      setLoading(false);
      return true;
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    saveSession(null);
    setUser(null);
    setError('');
  };

  const clearError = () => setError('');

  return (
    <AuthContext.Provider value={{ user, error, loading, register, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// This hook must live beside its provider so consumers share the same context instance.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
