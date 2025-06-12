import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setToken }) => {
  const [mail, setmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
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

    if (!res.ok) {
      return setError('Invalid credentials');
    }

    const { token } = await res.json();
    console.log('[DEBUG] Login successful, token:', token);

    localStorage.setItem('token', token);
    setToken(token);
    navigate('/inbox');
  } catch (err) {
    console.error('[DEBUG] Login failed:', err);
    setError('Failed to connect to server');
  }
};

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>mail</label>
          <input
            className="form-control"
            type="text"
            value={mail}
            onChange={(e) => setmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>

      <div className="text-center mt-3">
        Don’t have an account? <a href="/register">Sign Up here</a>
      </div>
    </div>
  );
};

export default LoginPage;