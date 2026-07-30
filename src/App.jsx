import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Questionnaire from './pages/Questionnaire';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Articles from './pages/Articles';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="questionnaire" element={<Questionnaire />} />
            <Route path="chat" element={<Chat />} />
            <Route path="articles" element={<Articles />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
