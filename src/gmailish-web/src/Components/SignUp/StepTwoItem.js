const StepTwoItem = ({ mail, setMail, password, setPassword }) => (
  <>
    <div className="mb-3 email-wrapper">
      <label className="form-label">Email</label>
      <div className="email-input-wrapper">
        <input
          className="form-control form-control-lg email-input"
          type="text"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
        />
        <span className="email-domain">@gmailish.com</span>
      </div>
    </div>
    <div className="mb-4">
      <label className="form-label">Password</label>
      <input
        className="form-control form-control-lg"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  </>
);

export default StepTwoItem;