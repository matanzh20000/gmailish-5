// Components/Auth/SignUp/SignUpLayout.js
import '../../Pages/SignUpPage.css';

const SignUpLayout = ({ children, darkMode }) => (
    <div className={`signup-container ${darkMode ? 'dark' : ''}`}>
        <div className={`signup-card ${darkMode ? 'dark' : ''}`} tabIndex={0}>
            <h1 className={`signup-title ${darkMode ? 'dark' : ''}`}>Create Your Account</h1>
            {children}
        </div>
    </div>
);


export default SignUpLayout;
