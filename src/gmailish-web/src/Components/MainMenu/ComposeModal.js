import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ComposeModal.css';
import RecipientFields from './RecipientFields';
import MessageEditor from './MessageEditor';
import ErrorAlert from './ErrorAlert';

const ComposeModal = ({
  show,
  onCloseModal,
  onSend,
  onSaveDraft,
  draftId,
  initialData = {}
}) => {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const resetFields = () => {
    setTo('');
    setCc('');
    setBcc('');
    setSubject('');
    setBody('');
    setShowCc(false);
    setShowBcc(false);
  };

  useEffect(() => {
    if (!show) return;
    if (!draftId && !initialData) {
      resetFields();
      setErrorMessage('');
    } else {
      setErrorMessage('');
    }
  }, [show, draftId, initialData]);

  useEffect(() => {
    if (!draftId || !initialData) return;
    setTo(initialData.to?.join(', ') || '');
    setCc(initialData.copy?.join(', ') || '');
    setBcc(initialData.blindCopy?.join(', ') || '');
    setSubject(initialData.subject || '');
    setBody(initialData.body || '');
  }, [draftId, initialData]);

  const handleSubmit = async () => {
    const toList = to.split(',').map(e => e.trim()).filter(Boolean);
    const ccList = cc.split(',').map(e => e.trim()).filter(Boolean);
    const bccList = bcc.split(',').map(e => e.trim()).filter(Boolean);

    if (toList.length === 0) {
      setErrorMessage('Please specify at least one recipient.');
      return;
    }

    await onSend({
      to: toList,
      cc: ccList,
      bcc: bccList,
      subject,
      body,
      draftId,
    }, setErrorMessage);

    resetFields();
  };

  const handleClose = () => {
    const toList = to.split(',').map(e => e.trim()).filter(Boolean);
    const ccList = cc.split(',').map(e => e.trim()).filter(Boolean);
    const bccList = bcc.split(',').map(e => e.trim()).filter(Boolean);
    const isEmpty = !toList.length && !ccList.length && !bccList.length && !subject.trim() && !body.trim();

    if (!isEmpty) {
      onSaveDraft({ to: toList, cc: ccList, bcc: bccList, subject, body, draftId });
    }

    resetFields();
    setErrorMessage('');
    onCloseModal();
    setTimeout(() => navigate('/inbox'), 0);
  };

  return (
    <div
      className={`modal fade ${show ? 'show d-block' : 'd-none'}`}
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', pointerEvents: 'auto', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content" style={{ pointerEvents: 'auto' }}>
          <div className="modal-header">
            <h5 className="modal-title">Compose Mail</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <RecipientFields
              to={to}
              cc={cc}
              bcc={bcc}
              showCc={showCc}
              showBcc={showBcc}
              setTo={setTo}
              setCc={setCc}
              setBcc={setBcc}
              setShowCc={setShowCc}
              setShowBcc={setShowBcc}
            />
            <ErrorAlert message={errorMessage} />
            <MessageEditor
              subject={subject}
              body={body}
              setSubject={setSubject}
              setBody={setBody}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeModal;
