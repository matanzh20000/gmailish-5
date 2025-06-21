const SignInItem = ({ mail, password, setMail, setPassword, error, onSubmit, darkMode }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ mail, password });
  };
  
  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
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

      <div className={`mt-4 text-center signup-prompt ${darkMode ? 'dark' : 'light'}`}>
        Don't have an account?{' '}
        <a href="/register" className={darkMode ? 'text-info' : 'text-primary'} style={{ fontWeight: 'bold', textDecoration: 'none' }}>
          Register here
        </a>
      </div>
    </>
  );
};

export default SignInItem;
