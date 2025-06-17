import FloatingCircles from './FloatingCircles';

const AuthLayoutItem = ({ children, darkMode }) => {
  return (
    <div className={`signin-container ${darkMode ? 'dark' : ''}`}>
      <div className={`signin-card ${darkMode ? 'dark' : ''}`} tabIndex={0}>
        <FloatingCircles />
        {children}
      </div>
    </div>
  );
};

export default AuthLayoutItem;