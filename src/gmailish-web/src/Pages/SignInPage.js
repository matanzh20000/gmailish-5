import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInPage = ({ setToken }) => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
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
      localStorage.setItem('token', token);
      setToken(token);
      navigate('/inbox');
    } catch {
      setError('Failed to connect to server');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, #6a11cb, #2575fc)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="shadow-lg rounded-4 p-5"
        style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          maxWidth: 500,
          width: '100%',
          boxShadow: '0 8px 32px rgb(38 57 77 / 0.1)',
          border: '1px solid #ddd',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated circles in background */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            background:
              'radial-gradient(circle, #2575fc 30%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(45px)',
            opacity: 0.3,
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 100,
            height: 100,
            background:
              'radial-gradient(circle, #6a11cb 40%, transparent 60%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            opacity: 0.2,
            animation: 'floatReverse 8s ease-in-out infinite',
          }}
        />

        <h1
          className="text-center mb-4"
          style={{ color: '#2575fc', fontWeight: '900' }}
        >
           Sign In
        </h1>

        <form onSubmit={handleSignIn} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-bold">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-control form-control-lg"
              placeholder="your.email@gmailish.com"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-bold">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control form-control-lg"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-bold"
            style={{ letterSpacing: '0.05em' }}
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center text-muted" style={{ fontSize: '0.9rem' }}>
          Don’t have an account?{' '}
          <a href="/register" className="text-primary fw-bold text-decoration-none">
            Sign Up
          </a>
        </div>

        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(15px); }
            }
            @keyframes floatReverse {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-15px); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default SignInPage;