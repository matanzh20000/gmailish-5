import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpLayout from '../Components/SignUp/SignUpLayout';
import SignUpSteps from '../Components/SignUp/SignUpSteps';
import SignUpNavItem from '../Components/SignUp/SignUpNavItem';
import './SignUpPage.css';

const SignUpPage = ({ darkMode, setDarkMode }) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setError('');
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
      const allowedChars = /^[a-z0-9._%+/-]+$/;
      if (!allowedChars.test(mail)) {
        return setError('Email must contain only lowercase letters, numbers, and ._%+/-');
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
    const birth = new Date(birthDate);
    const birthDateObj = {
      day: birth.getDate(),
      month: birth.getMonth() + 1,
      year: birth.getFullYear(),
    };
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('gender', gender);
    formData.append('password', password);
    formData.append('mail', mail + '@gmailish.com');
    if (image) {
      formData.append('avatar', image);
    }
    formData.append('birthDate[day]', birthDateObj.day);
    formData.append('birthDate[month]', birthDateObj.month);
    formData.append('birthDate[year]', birthDateObj.year);

    try {
      const res = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const data = await res.json();
        return setError(data.message || 'Sign-up failed');
      }

      // Progress bar reaches 100%
      setStep(4);
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error(err);
      setError('Could not reach server');
    }
  };

  // 👇 Updated progress calculation
  const progressPercentage = Math.min((step - 1) / 3 * 100, 100);

  return (
    <SignUpLayout darkMode={darkMode}>
      <button
        onClick={() => setDarkMode(prev => !prev)}
        className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'} btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-3`}
      ></button>

      <div className="progress mb-4">
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${progressPercentage}%`, transition: 'width 0.4s ease' }}
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

      <form onKeyDown={handleKeyDown}>
        <SignUpSteps
          step={step}
          firstName={firstName} setFirstName={setFirstName}
          lastName={lastName} setLastName={setLastName}
          birthDate={birthDate} setBirthDate={setBirthDate}
          gender={gender} setGender={setGender}
          mail={mail} setMail={setMail}
          password={password} setPassword={setPassword}
          image={image} setImage={setImage}
        />
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        <SignUpNavItem
          step={step}
          setStep={setStep}
          handleNext={handleNext}
          handleSignUp={handleSignUp}
        />
      </form>

      <div className={`mt-4 text-center signin-prompt ${darkMode ? 'dark' : 'light'}`}>
        Already have an account?{' '}
        <a href="/" className={darkMode ? 'text-info' : 'text-primary'} style={{ fontWeight: 'bold', textDecoration: 'none' }}>
          Sign in here
        </a>
      </div>
    </SignUpLayout>
  );
};

export default SignUpPage;
