import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LeftMenuItem from '../Components/LeftMenu/LeftMenuItem';
import MainMenu from '../Components/MainMenu/MainMenu';
import TopMenuItem from '../Components/TopMenu/TopMenuItem';
import MailView from '../Components/MainMenu/MailView';
import ComposeModal from '../Components/MainMenu/ComposeModal';
import { useNavigate } from 'react-router-dom';


const InboxPage = ({ onSignOut, user }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Inbox');
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [editingDraftData, setEditingDraftData] = useState(null);
  const { id } = useParams();
  const isViewingMail = !!id;
  const toggleTheme = () => setDarkMode(!darkMode);
  const navigate = useNavigate();
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
    if (!user) return;
    const fetchMails = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/mails', {
          headers: { 'X-user': user.mail },
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
const handleSendMail = async (
  { to, cc, bcc, subject, body, draftId },
  setErrorMessage
) => {
  try {
    if (draftId) {
      await fetch(`http://localhost:8080/api/mails/${draftId}`, {
        method: 'DELETE',
      });
    }

    const response = await fetch('http://localhost:8080/api/mails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-user': user.mail,
      },
      body: JSON.stringify({
        from: user.mail,
        to,
        copy: cc,
        blindCopy: bcc,
        subject,
        body,
        label: ['Sent'],
        date: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 400 && errorText.includes("blacklist")) {
        setErrorMessage('Cannot send mail. It contains a blacklisted URL.');
      } else {
        setErrorMessage('Failed to send mail. Please try again.');
      }
      return;
    }

    const refreshed = await fetch('http://localhost:8080/api/mails', {
      headers: { 'X-user': user.mail },
    });
    const updatedMails = await refreshed.json();
    setMails(updatedMails);

    // Success: clear error
    setErrorMessage('');
    setShowCompose(false);
    setEditingDraftId(null);
    setEditingDraftData(null);
  } catch (err) {
    setErrorMessage('An unexpected error occurred: ' + err.message);
  }
};


  const handleSaveDraft = async ({ to, cc, bcc, subject, body, draftId }) => {
    const isEmpty = !to.length && !cc.length && !bcc.length && !subject.trim() && !body.trim();
    if (isEmpty) return;

    const payload = {
      from: user.mail,
      to,
      copy: cc,
      blindCopy: bcc,
      subject,
      body,
      draft: true,
      label: ['Drafts'],
      createdAt: new Date().toISOString(),
    };

    try {
      if (draftId) {
        await fetch(`http://localhost:8080/api/mails/${draftId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('http://localhost:8080/api/mails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-user': user.mail,
          },
          body: JSON.stringify(payload),
        });
      }
      const refreshed = await fetch('http://localhost:8080/api/mails', {
        headers: { 'X-user': user.mail },
      });
      const updatedMails = await refreshed.json();
      setMails(updatedMails);
    } catch (err) {
      console.error("Draft save failed:", err);
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
          return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
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
    <div style={{ backgroundColor: themeColors.background, minHeight: '100vh', height: '100%' }} className={`${themeColors.text} h-100 transition-theme`}>
      <TopMenuItem darkMode={darkMode} toggleTheme={toggleTheme} onSignOut={onSignOut} user={user} themeColors={themeColors} />
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
          onCompose={() => {
            setEditingDraftId(null);
            setEditingDraftData(null);
            setShowCompose(true);
          }}
          user={user}
        />
        {(() => {
          const selectedMail = mails.find(m => m.id === parseInt(id));
          if (isViewingMail && selectedMail?.draft && selectedMail.label.includes('Drafts')) {
            setTimeout(() => {
              navigate('/inbox'); 
              setEditingDraftId(selectedMail.id);
              setEditingDraftData(selectedMail);
              setShowCompose(true);
            }, 0);
            return null;
          }


          return isViewingMail ? (
            <MailView mails={mails} darkMode={darkMode} />
          ) : (
            <MainMenu
              darkMode={darkMode}
              mails={visibleMails}
              setMails={setMails}
              selectedLabel={selectedLabel}
              defaultLabels={labels}
              customLabels={customLabels}
              onEditDraft={(draft) => {
                setEditingDraftId(draft.id);
                setEditingDraftData(draft);
                setShowCompose(true);
              }}
            />
          );
        })()}
      </div>
      <ComposeModal
        show={showCompose}
        onCloseModal={() => {
          setShowCompose(false);
          setEditingDraftId(null);
          setEditingDraftData(null);
        }}
        onSend={handleSendMail}
        onSaveDraft={handleSaveDraft}
        draftId={editingDraftId}
        initialData={editingDraftData}
      />
    </div>
  );
};

export default InboxPage;