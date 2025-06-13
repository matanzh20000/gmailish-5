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
import { jwtDecode } from 'jwt-decode';

// Wrapper to use useNavigate inside AppRoutes
function AppRoutes({ token, setToken, darkMode, setDarkMode, user }) {
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
            <InboxPage onSignOut={handleSignOut} user={user} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/register"
        element={<SignUpPage />}
      />
      <Route
        path="/inbox/:id"
        element={
          token ? (
            <InboxPage onSignOut={handleSignOut} user={user} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserFromToken(token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const fetchUserFromToken = async (token) => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const res = await fetch(`http://localhost:8080/api/users/${userId}`);
      if (!res.ok) throw new Error('User not found');

      const userData = await res.json();
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setToken(null);
    }
  };



  return (
    <Router>
      <div className={darkMode ? 'dark-mode' : ''}>
        <AppRoutes
          token={token}
          setToken={setToken}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
        />
      </div>
    </Router>
  );
}

export default App;