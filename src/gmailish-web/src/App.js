import './App.css';
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import InboxPage from './Pages/InboxPage';
import SignInPage from './Pages/SignInPage';
import SignUpPage from './Pages/SignUpPage';

// Wrapper to use useNavigate inside AppRoutes
function AppRoutes({ token, setToken, darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/inbox" />
          ) : (
            <SignInPage setToken={setToken} />
          )
        }
      />
      <Route
        path="/inbox"
        element={
          token ? (
            <InboxPage onSignOut={handleSignOut} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route 
      path="/register"
      element={<SignUpPage />}
      />
    </Routes>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <Router>
      <div className={darkMode ? 'dark-mode' : ''}>
        <AppRoutes
          token={token}
          setToken={setToken}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>
    </Router>
  );
}

export default App;