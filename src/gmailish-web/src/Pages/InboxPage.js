import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LeftMenuItem from '../Components/LeftMenu/LeftMenuItem';
import MainMenu from '../Components/MainMenu/MainMenu';
import TopMenuItem from '../Components/TopMenu/TopMenuItem';
import MailView from '../Components/MainMenu/MailView';
import ComposeModal from '../Components/MainMenu/ComposeModal';

const InboxPage = ({ onSignOut, user }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Inbox');
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const { id } = useParams();
  const isViewingMail = !!id;
  const toggleTheme = () => setDarkMode(!darkMode);
  const visibleMails = mails.filter(mail =>
    (Array.isArray(mail.label) && mail.label.includes(selectedLabel)) ||
    (typeof mail.label === 'string' && mail.label === selectedLabel)
  );
  const [customLabels, setCustomLabels] = useState([]);
  const labels = ['Inbox', 'Starred', 'Snoozed', 'Sent', 'Spam', 'Drafts'];

  const themeColors = darkMode
    ? {
      background: '#333558',
      text: 'text-light',
      card: 'bg-secondary text-light',
      border: 'border-secondary'
    }
    : {
      background: '#bcd9db',
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

const handleSendMail = async ({ to, subject, body }) => {
  try {
    const response = await fetch('http://localhost:8080/api/mails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-user': user.mail,
      },
      body: JSON.stringify({
        from: user.mail,
        to: [to],
        subject,
        body,
        label: 'Sent',
        date: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error('Failed to send mail');

    const refreshed = await fetch('http://localhost:8080/api/mails', {
      headers: { 'X-user': user.mail },
    });
    const updatedMails = await refreshed.json();
    setMails(updatedMails);

    setShowCompose(false);
  } catch (err) {
    alert('Failed to send mail: ' + err.message);
  }
};

useEffect(() => {
  if (!user) return;

  const intervalId = setInterval(async () => {
    try {
      const res = await fetch('http://localhost:8080/api/mails', {
        headers: { 'X-user': user.mail },
      });
      if (!res.ok) throw new Error('Failed to fetch mails');
      const data = await res.json();

      setMails(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const newOnes = data.filter(m => !existingIds.has(m.id));
        if (newOnes.length > 0) {
          return [...newOnes, ...prev];
        }
        return prev; 
      });
    } catch (err) {
      console.error('[Polling] Failed to fetch mails:', err);
    }
  }, 2000);

  return () => clearInterval(intervalId);
}, [user]);






  if (loading) return <div className="p-4">Loading mails...</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;


  return (
    <div style={{
      backgroundColor: themeColors.background,
      minHeight: '100vh',
      height: '100%',
    }} className={` ${themeColors.text} h-100 transition-theme`}>
      {/* Top Menu */}
      <TopMenuItem darkMode={darkMode} toggleTheme={toggleTheme} onSignOut={onSignOut} user={user} themeColors={themeColors} />

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
          themeColors={themeColors}
          onCompose={() => setShowCompose(true)}
        />
        {isViewingMail ? (
          <MailView mails={mails} darkMode={darkMode} />
        ) : (
          <MainMenu
            darkMode={darkMode}
            mails={visibleMails}
            setMails={setMails}
            selectedLabel={selectedLabel}
            defaultLabels={labels}
            customLabels={customLabels}
          />
        )}

      </div>

      <ComposeModal
        show={showCompose}
        onClose={() => setShowCompose(false)}
        onSend={handleSendMail}
        user={user}
      />
    </div>
  );
};

export default InboxPage;