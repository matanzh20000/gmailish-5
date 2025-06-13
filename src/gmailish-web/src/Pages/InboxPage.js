import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LeftMenuItem from '../Components/LeftMenu/LeftMenuItem';
import MainMenu from '../Components/MainMenu/MainMenu';
import TopMenuItem from '../Components/TopMenu/TopMenuItem';

const GmailishMainPage = ({ onSignOut, user }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Inbox');
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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



  useEffect(() => {
    if (!user) return; // wait for user to be set

    const fetchMails = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/mails', {
          headers: {
            'X-user': user.mail,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch mails');
        const data = await res.json();
        setMails(data);
      } catch (err) {
        console.error('[DEBUG] Mail fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, [user]);


  const labels = ['Inbox', 'Starred', 'Snoozed', 'Sent', 'Spam', 'Drafts'];

  const visibleMails = mails.filter(mail => mail.label.includes(selectedLabel));

  const [customLabels, setCustomLabels] = useState([]);

  if (loading) return <div className="p-4">Loading mails...</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;


  return (
    <div style={{
      backgroundColor: themeColors.background,
      minHeight: '100vh',
      height: '100%',
    }} className={` ${themeColors.text} h-100 transition-theme`}>
      {/* Top Menu */}
      <TopMenuItem darkMode={darkMode} toggleTheme={toggleTheme} onSignOut={onSignOut} user={user} />

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