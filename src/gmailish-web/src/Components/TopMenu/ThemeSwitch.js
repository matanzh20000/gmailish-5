const ThemeSwitch = ({ darkMode, toggleTheme }) => {
    const background = darkMode ? '#333558' : '#cce6e6';
    const iconColor = darkMode ? '#61dafb' : '#4da6a6'; 

    return (
        <button
            onClick={toggleTheme}
            className="btn align-items-center"
            style={{ width: '50px', height: '50px', backgroundColor: background }}
        >
            <i
                className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}
                style={{ color: iconColor, fontSize: '24px' }}
            ></i>
        </button>
    );
};

export default ThemeSwitch;
