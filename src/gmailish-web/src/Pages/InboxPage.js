import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LeftMenuItem from '../Components/LeftMenu/LeftMenuItem';
import MainMenu from '../Components/MainMenu/MainMenu';
import TopMenuItem from '../Components/TopMenu/TopMenuItem';

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
  const [mails, setMails] = useState([
    {
      id: 1,
      from: 'noa@university.edu',
      to: ['you@gmail.com'],
      label: 'Inbox',
      subject: 'Exam Schedule Released',
      body: 'The final exam schedule for all courses has now been published. Please check your student portal for details.',
      createdAt: '2025-06-04T10:15:00Z'
    },
    {
      id: 2,
      from: 'linkedin@jobs.com',
      to: ['you@gmail.com'],
      label: 'Inbox',
      subject: 'Top jobs for Software Engineers',
      body: 'Check out this list of top companies hiring. We have curated a list of the best job openings for software engineers based on your profile.',
      createdAt: '2025-06-03T18:40:00Z'
    },
    {
      id: 3,
      from: 'noreply@github.com',
      to: ['you@gmail.com'],
      label: 'Inbox',
      subject: 'New pull request on your repository',
      body: 'There is a new pull request waiting for your review. Please check it out at your earliest convenience.',
      createdAt: '2025-06-01T22:05:00Z'
    }
  ]);

  const labels = ['Inbox', 'Starred', 'Snoozed', 'Sent', 'Spam'];

  const visibleMails = mails.filter(mail => mail.label === selectedLabel);

  const [customLabels, setCustomLabels] = useState([]);


  return (
    <div style={{
      backgroundColor: themeColors.background,
      minHeight: '100vh',
      height: '100%',
    }} className={` ${themeColors.text} h-100 transition-theme`}>
      {/* Top Menu */}
      <TopMenuItem darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <div className="d-flex flex-grow-1">
        
        <LeftMenuItem
          darkMode={darkMode}
          selectedLabel={selectedLabel}
          onSelectLabel={setSelectedLabel}
          labels={labels}
          customLabels={customLabels}
          setCustomLabels={setCustomLabels}
          setMails={setMails}
          mails={mails}
        />
        <MainMenu
          darkMode={darkMode}
          mails={visibleMails}
          setMails={setMails}
          selectedLabel={selectedLabel}
          defaultLabels={labels}
          customLabels={customLabels}
        />

      </div>
    </div>
  );
};

export default GmailishMainPage;