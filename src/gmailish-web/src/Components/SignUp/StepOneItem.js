const StepOneItem = ({ firstName, setFirstName, lastName, setLastName, birthDate, setBirthDate, gender, setGender }) => (
  <>
    <div className="mb-3">
      <label className="form-label">First Name</label>
      <input className="form-control form-control-lg" value={firstName} onChange={e => setFirstName(e.target.value)} />
    </div>
    <div className="mb-3">
      <label className="form-label">Last Name</label>
      <input className="form-control form-control-lg" value={lastName} onChange={e => setLastName(e.target.value)} />
    </div>
    <div className="mb-3">
      <label className="form-label">Birth Date</label>
      <input type="date" className="form-control form-control-lg" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
    </div>
    <div className="mb-4">
      <label className="form-label">Gender</label>
      <select className="form-select form-select-lg" value={gender} onChange={e => setGender(e.target.value)}>
        <option value="">Choose gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="prefer not to say">Prefer not to say</option>
      </select>
    </div>
  </>
);

export default StepOneItem;