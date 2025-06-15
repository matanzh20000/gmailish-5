import ThemeSwitch from "./ThemeSwitch";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; import UserCard from "./UserCard";
const TopMenu = ({ darkMode, toggleTheme, onSignOut, user, themeColors }) => {
    const btnTheme = darkMode
        ? 'btn btn-dark border-0'
        : 'btn btn-light border-0';
    const searchColor = darkMode ? '#66667d' : '#ffffff';
    const placeholderColor = darkMode ? '#cccccc' : '#666666';
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            try {
                const res = await fetch(`http://localhost:8080/api/mails/search/${encodeURIComponent(query)}`, {
                    headers: {
                        'X-user': user.mail
                    }
                });
                if (!res.ok) throw new Error("Failed to fetch");
                const allResults = await res.json();

                // Results are already filtered by server (ownership + deduplicated)
                setResults(allResults);
            } catch (err) {
                console.error(err);
                setResults([]);
            }
        };

        const timeoutId = setTimeout(fetchData, 300); // debounce input
        return () => clearTimeout(timeoutId);
    }, [query, user]);


    return (
        <div
            className={`d-flex  align-items-center px-4 py-2 ${themeColors.text} ${themeColors.border} transition-theme`}
            style={{ height: '80px', backgroundColor: themeColors.background }}
        >

            <div
                className="d-flex align-items-center"
                style={{ cursor: 'pointer', marginLeft: '70px' }}
            >
                <img
                    src="/option2.png"
                    alt="Gmailish Logo"
                    style={{
                        width: '120px',
                        height: 'auto',
                        cursor: 'pointer',
                        marginTop: '15px',
                    }}
                />
            </div>

            <div style={{ flex: 1, minWidth: '200px', marginLeft: '90px', position: 'relative' }}>
                <style>
                    {`
        .custom-search::placeholder {
            color: ${placeholderColor};
        }`}
                </style>
                <input
                    type="text"
                    className="form-control custom-search"
                    placeholder="Search mail..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{
                        backgroundColor: searchColor,
                        minWidth: '150px',
                        width: '100%',
                        maxWidth: '1000px'
                    }}
                />
                {results.length > 0 && (
                    <div
                        className="dropdown-menu show"
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0, // align to parent input
                            width: '100%',
                            backgroundColor: darkMode ? '#444' : 'white',
                            zIndex: 1000,
                            border: '1px solid #ccc',
                            borderTop: 'none',
                            maxHeight: '300px',
                            maxWidth: '1000px',
                            overflowY: 'auto',
                            padding: 0
                        }}
                    >
                        {results.map(data => (
                            <div
                                key={data.id}
                                style={{
                                    padding: '8px',
                                    borderBottom: 'transparent',
                                    color: darkMode ? 'white' : 'black',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    navigate(`/inbox/${data.id}`);
                                    setQuery('');
                                }}
                            >
                                <i className="bi bi-envelope-fill me-2"></i>
                                <strong>{data.subject}</strong><br />
                                <small>From: {data.from}</small><br />
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Theme Toggle */}
            <div
                style={{ cursor: 'pointer', marginLeft: '100px' }}>
                <ThemeSwitch darkMode={darkMode} toggleTheme={toggleTheme} />
            </div>

            {/* User Dropdown */}
            <div className="dropdown">
                <button
                    className={`${btnTheme} dropdown-toggle p-0`}
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <img
                        src={""}
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px' }}
                    />
                </button>

                <ul
                    className="dropdown-menu dropdown-menu-end p-2"
                    aria-labelledby="userDropdown"
                    style={{ minWidth: '250px' }}
                >
                    <li className="px-0">
                        <UserCard user={user} darkMode={darkMode} onSignOut={onSignOut} />
                    </li>
                </ul>
            </div>
        </div >
    );

};

export default TopMenu;
