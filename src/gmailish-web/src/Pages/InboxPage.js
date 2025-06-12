import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LeftMenuItem from '../Components/LeftMenuItem';
import MainMenu from '../Components/MainMenu';

const GmailishMainPage = ({ onSignOut }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Inbox');

  const toggleTheme = () => setDarkMode(!darkMode);

  const themeColors = darkMode
    ? {
      background: '#333558',
      text: 'text-light',
      card: 'bg-secondary text-light',
      border: 'border-secondary'
    }
    : {
      background: '#cce6e6',
      text: 'text-dark',
      card: 'bg-white text-dark',
      border: 'border-light'
    };

  // Sample mail list with label assignments
  const mails = [
    {
      id: 1,
      from: 'noa@university.edu',
      to: ['you@gmail.com'],
      labels: ['Inbox'],
      subject: 'Exam Schedule Released',
      body: 'The final exam schedule for all courses has now been published. Please check your student portal for details.',
      createdAt: '2025-06-04T10:15:00Z'
    },
    {
      id: 2,
      from: 'linkedin@jobs.com',
      to: ['you@gmail.com'],
      labels: ['Inbox', 'Starred'],
      subject: 'Top jobs for Software Engineers',
      body: 'Check out this list of top companies hiring. We have curated a list of the best job openings for software engineers based on your profile.',
      createdAt: '2025-06-03T18:40:00Z'
    },
    {
      id: 3,
      from: 'noreply@github.com',
      to: ['you@gmail.com'],
      labels: ['Inbox', 'Spam'],
      subject: 'New pull request on your repository',
      body: 'There is a new pull request waiting for your review. Please check it out at your earliest convenience.',
      createdAt: '2025-06-01T22:05:00Z'
    }
  ];


  return (
    <div style={{ backgroundColor: themeColors.background, transition: 'all 0.3s ease-in-out' }} className={`vh-100 ${themeColors.text}`}>
      {/* Top Menu */}
      <div className={`d-flex justify-content-between align-items-center px-4 py-2 border-bottom ${themeColors.text} ${themeColors.border}`} style={{ height: '60px' }}>
        <div className="col-md-6">
          <input type="text" className={`form-control ${darkMode ? 'bg-dark text-light' : ''}`} placeholder="Search mail..." />
        </div>
        <div className="col-md-3 text-end">
          <button className={`btn ${darkMode ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={toggleTheme}>
            {darkMode ? 'Dark' : 'Light'} Mode
          </button>
        </div>
        <div className="col-md-3 text-end">
          <div className="dropdown">
            <button className={`btn ${darkMode ? 'btn-secondary' : 'btn-outline-secondary'} dropdown-toggle`} data-bs-toggle="dropdown">
              <img src="/user.png" alt="User" className="rounded-circle" width="30" height="30" />
            </button>
            <ul className={`dropdown-menu dropdown-menu-end ${darkMode ? 'bg-dark text-light' : ''}`}>
              <li><span className="dropdown-item">John Doe</span></li>
              <li><span className="dropdown-item">john.doe@example.com</span></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item btn btn-link" type="button" onClick={onSignOut}>
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="d-flex h-100">
        <LeftMenuItem
          darkMode={darkMode}
          selectedLabel={selectedLabel}
          onSelectLabel={setSelectedLabel}
        />
        <MainMenu
          darkMode={darkMode}
          mails={mails}
          selectedLabel={selectedLabel}
        />
      </div>
    </div>
  );
};

export default GmailishMainPage;