import ProfileCard from "./ProfileCard";

const TopMenu = ({ darkMode, toggleTheme }) => {
    const themeColors = darkMode
        ? { text: 'text-light', border: 'border-secondary' }
        : { text: 'text-dark', border: 'border-light' };
    const background = darkMode ? '#333558' : '#cce6e6';


    return (
        <div
            className={`d-flex justify-content-between align-items-center px-4 py-2 border-bottom ${themeColors.text} ${themeColors.border} transition-theme`}
            style={{ height: '60px', backgroundColor: background }}
        >
            {/* Search Bar */}
            <div className="col-md-6">
                <input
                    type="text"
                    className={`form-control ${darkMode ? 'bg-dark text-light' : ''}`}
                    placeholder="Search mail..."
                />
            </div>

            {/* Theme Toggle */}
            <div className="col-md-3 text-end">
                <button
                    className={`btn ${darkMode ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={toggleTheme}
                >
                    {darkMode ? 'Dark' : 'Light'} Mode
                </button>
            </div>

            {/* User Dropdown */}
            <div className="col-md-3 text-end">
                <div className="dropdown">
                    <button
                        className={`btn ${darkMode ? 'btn-secondary' : 'btn-outline-secondary'} dropdown-toggle`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <img
                            src="/user.png"
                            alt="User"
                            className="rounded-circle"
                            width="30"
                            height="30"
                        />
                    </button>

                    <div className="dropdown-menu dropdown-menu-end p-0 border-0" style={{ minWidth: '300px' }}>
                        <ProfileCard
                            avatarUrl="/user.png"
                            miniAvatarUrl="/user.png"
                            name="John Doe"
                            title="Fullstack Developer"
                            handle="johndoe"
                            status="Available"
                            contactText="Sign Out"
                            onContactClick={() => console.log('Signed out')}
                            showBehindGradient={true}
                            enableTilt={true}
                            className="px-2 py-2"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TopMenu;
