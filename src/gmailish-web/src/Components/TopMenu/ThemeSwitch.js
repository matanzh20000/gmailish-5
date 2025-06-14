const ThemeSwitch = ({ darkMode, toggleTheme, }) => {
    const background = darkMode ? '#333558' : '#bcd9db';
    const iconColor = darkMode ? '#61dafb' : '#6fa0da'; 

    return (
        <button
            onClick={toggleTheme}
            className="btn align-items-center"
            style={{ width: '50px', height: '50px', backgroundColor: background , marginRight: '20px' }}
        >
            <i
                className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}
                style={{ color: iconColor, fontSize: '24px' }}
            ></i>
        </button>
    );
};

export default ThemeSwitch;
