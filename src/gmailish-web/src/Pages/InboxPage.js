import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LeftMenuItem from '../Components/LeftMenu/LeftMenuItem';
import MainMenu from '../Components/MainMenu/MainMenu';
import TopMenuItem from '../Components/TopMenu/TopMenuItem';
import ComposeModal from '../Components/ComposeModal';

const InboxPage = ({ onSignOut, user }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Inbox');
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customLabels, setCustomLabels] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMailId, setSelectedMailId] = useState(null);
  const selectedMail = mails.find(m => m.id === selectedMailId);

  const toggleTheme = () => setDarkMode(!darkMode);

  const themeColors = darkMode
    ? {
        background: '#333558',
        text: 'text-light',
        card: 'bg-secondary text-light',
        border: 'border-secondary',
      }
    : {
        background: '#cce6e6',
        text: 'text-dark',
        card: 'bg-white text-dark',
        border: 'border-light',
      };

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

  useEffect(() => {
    if (user) fetchMails();
  }, [user]);

  const labels = ['Inbox', 'Starred', 'Snoozed', 'Sent', 'Spam', 'Drafts'];

  // const visibleMails = mails.filter(mail => mail.label.includes(selectedLabel));
  const visibleMails = mails.filter(mail =>
  (Array.isArray(mail.label) && mail.label.includes(selectedLabel)) ||
  (typeof mail.label === 'string' && mail.label === selectedLabel)
);

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

      const newMail = await response.json();
      setMails(prev => [...prev, newMail]);
      setShowCompose(false);
    } catch (err) {
      alert('Failed to send mail: ' + err.message);
    }
  };

  if (loading) return <div className="p-4">Loading mails...</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;

  return (
    <div
      style={{
        backgroundColor: themeColors.background,
        minHeight: '100vh',
        height: '100%',
      }}
      className={` ${themeColors.text} h-100 transition-theme`}
    >
      {/* Top Menu */}
      <TopMenuItem
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        onSignOut={onSignOut}
        user={user}
      />

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
          onCompose={() => setShowCompose(true)} 
        />
        <MainMenu
          darkMode={darkMode}
          mails={visibleMails}
          setMails={setMails}
          selectedLabel={selectedLabel}
          defaultLabels={labels}
          customLabels={customLabels}
          onSelectMail={setSelectedMailId}

        />
      </div>
                  {selectedMail && (
            <div
              className={`p-4 ${themeColors.card} border ${themeColors.border}`}
              style={{
                maxWidth: '90vw',
                margin: '1rem auto',
                borderRadius: '16px',
              }}
            >
              <h5>{selectedMail.subject}</h5>
              <p><strong>From:</strong> {selectedMail.from}</p>
              <p><strong>To:</strong> {selectedMail.to.join(', ')}</p>
              <p>{selectedMail.body}</p>
              <button className="btn btn-sm btn-outline-secondary mt-3" onClick={() => setSelectedMailId(null)}>
                Close
              </button>
            </div>
          )}

      {/* Compose Modal */}
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
