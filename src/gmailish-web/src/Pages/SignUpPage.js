// SignUpPage.js (JS logic only)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';

const SignUpPage = ({ setToken }) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [backupMail, setBackupMail] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setError('');
    const emailRegex = /^[a-zA-Z0-9._%+-]+$/;

    if (step === 1) {
      if (!firstName || !lastName || !birthDate || !gender) {
        return setError('Please complete all personal details.');
      }
      const birth = new Date(birthDate);
      const today = new Date();
      if (birth >= today || birth.getFullYear() < 1900) {
        return setError('Please enter a valid birth date.');
      }
    }

    if (step === 2) {
      if (!mail || !password) {
        return setError('Email and password are required.');
      }
      if (!emailRegex.test(mail)) {
        return setError('Invalid email characters. Only letters, numbers, and ". _ % + -" are allowed.');
      }
      if (password.length < 5 || !/\d/.test(password)) {
        return setError('Password must be at least 5 characters and include a number.');
      }
    }

    setStep(step + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < 3) {
        handleNext();
      } else {
        handleSignUp();
      }
    }
  };

  const handleSignUp = async () => {
    setError('');
    const emailRegex = /^[a-zA-Z0-9._%+-]+$/;

    if (backupMail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(backupMail)) {
      return setError('Invalid backup email format.');
    }

    const birth = new Date(birthDate);
    const birthDateObj = {
      day: birth.getDate(),
      month: birth.getMonth() + 1,
      year: birth.getFullYear(),
    };

    try {
      const res = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          birthDate: birthDateObj,
          gender,
          mail: mail + '@gmailish.com',
          password,
          backupMail,
          image,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        return setError(data.message || 'Sign-up failed');
      }

      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error(err);
      setError('Could not reach server');
    }
  };

  const progressPercentage = ((step - 1) / 3) * 100;

  return (
    <div className="signup-container">
      <div className="signup-card" onKeyDown={handleKeyDown} tabIndex={0}>
        <h1 className="signup-title">Create Your Account</h1>

        <div className="progress mb-4">
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={step}
            aria-valuemin="1"
            aria-valuemax="3"
          ></div>
        </div>

        {success && (
          <div className="alert alert-success text-center fw-bold" role="alert">
            Account created! Redirecting...
          </div>
        )}

        <form>
          {step === 1 && (
            <>
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input className="form-control form-control-lg" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input className="form-control form-control-lg" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Birth Date</label>
                <input type="date" className="form-control form-control-lg" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="form-label">Gender</label>
                <select className="form-select form-select-lg" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Choose gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-3 email-wrapper">
                <label className="form-label">Email</label>
                <div className="email-input-wrapper">
                  <input
                    className="form-control form-control-lg email-input"
                    type="text"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    pattern="^[a-zA-Z0-9._%+-]+$"
                    required
                  />
                  <span className="email-domain">@gmailish.com</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input className="form-control form-control-lg" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-3">
                <label className="form-label">Backup Email</label>
                <input className="form-control form-control-lg" type="email" value={backupMail} onChange={(e) => setBackupMail(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="form-label">Image URL</label>
                <input className="form-control form-control-lg" type="text" value={image} onChange={(e) => setImage(e.target.value)} />
              </div>
            </>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex justify-content-between">
            {step > 1 && (
              <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" className="btn btn-primary px-4 ms-auto" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="button" className="btn btn-success px-4 ms-auto" onClick={handleSignUp}>
                Sign Up
              </button>
            )}
          </div>
        </form>

        <div className="mt-4 text-center text-muted" style={{ fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <a href="/" className="text-primary fw-bold text-decoration-none">
            Sign in here
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;