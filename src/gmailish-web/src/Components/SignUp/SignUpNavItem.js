const SignUpNavItem = ({ step, setStep, handleNext, handleSignUp }) => (
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
);

export default SignUpNavItem;