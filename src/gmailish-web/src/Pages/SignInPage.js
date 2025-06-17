import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayoutItem from '../Components/Auth/AuthLayoutItem';
import SignInItem from '../Components/Auth/SignInItem';
import './SignInPage.css';

const SignInPage = ({ setToken }) => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async ({ mail, password }) => {
    setError('');

    if (!mail || !password) {
      return setError('All fields are required');
    }

    try {
      const res = await fetch('http://localhost:8080/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail, password }),
      });

      if (!res.ok) return setError('Invalid credentials');

      const { token } = await res.json();
      localStorage.setItem('token', token);
      setToken(token);
      navigate('/inbox');
    } catch {
      setError('Failed to connect to server');
    }
  };

  return (
    <AuthLayoutItem darkMode={darkMode}>
      <button
        onClick={() => setDarkMode(prev => !prev)}
        className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'} btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-3`}
      >
      </button>
      <SignInItem
        mail={mail}
        password={password}
        error={error}
        setMail={setMail}
        setPassword={setPassword}
        onSubmit={handleSubmit}
        darkMode={darkMode}
      />
    </AuthLayoutItem>
  );
};

export default SignInPage;
