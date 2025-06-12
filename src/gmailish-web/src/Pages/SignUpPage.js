import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [backupMail, setBackupMail] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !birthDate || !gender || !mail || !password) {
      return setError('All required fields must be filled');
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
          mail,
          password,
          backupMail,
          image,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        return setError(data.message || 'Sign-up failed');
      }

      navigate('/');
    } catch (err) {
      console.error('[DEBUG] Sign-up failed:', err);
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="mb-3">
          <label>First Name</label>
          <input className="form-control" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input className="form-control" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Birth Date</label>
          <input className="form-control" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Gender</label>
          <input className="form-control" type="text" value={gender} onChange={(e) => setGender(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" type="email" value={mail} onChange={(e) => setMail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Backup Email</label>
          <input className="form-control" type="email" value={backupMail} onChange={(e) => setBackupMail(e.target.value)} />
        </div>

        <div className="mb-3">
          <label>Image URL</label>
          <input className="form-control" type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary w-100" type="submit">Sign Up</button>
      </form>

      <div className="text-center mt-3">
        Already have an account? <a href="/">Log in here</a>
      </div>
    </div>
  );
};

export default SignUpPage;
