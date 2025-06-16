import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    useEffect(() => {
        if (!draftId || !initialData) return;

        setTo(initialData.to?.join(', ') || '');
        setCc(initialData.copy?.join(', ') || '');
        setBcc(initialData.blindCopy?.join(', ') || '');
        setSubject(initialData.subject || '');
        setBody(initialData.body || '');
    }, [draftId, initialData]);

    const handleSubmit = () => {
        const toList = to.split(',').map(e => e.trim()).filter(Boolean);
        const ccList = cc.split(',').map(e => e.trim()).filter(Boolean);
        const bccList = bcc.split(',').map(e => e.trim()).filter(Boolean);

        if (toList.length === 0) {
            alert('Please specify at least one recipient.');
            return;
        }

        onSend({ to: toList, cc: ccList, bcc: bccList, subject, body, draftId });
    };

    const handleClose = () => {
        const toList = to.split(',').map(e => e.trim()).filter(Boolean);
        const ccList = cc.split(',').map(e => e.trim()).filter(Boolean);
        const bccList = bcc.split(',').map(e => e.trim()).filter(Boolean);
        const isEmpty = !toList.length && !ccList.length && !bccList.length && !subject.trim() && !body.trim();

        if (!isEmpty) {
            onSaveDraft({ to: toList, cc: ccList, bcc: bccList, subject, body, draftId });
        }


        const resetFields = () => {
            setTo('');
            setCc('');
            setBcc('');
            setSubject('');
            setBody('');
            setShowCc(false);
            setShowBcc(false);
        };

        resetFields();
        onCloseModal();
        show = false;
        setTimeout(() => navigate('/inbox'), 0);
    };

    return (
        <div
            className={`modal fade ${show ? 'show d-block' : 'd-none'}`}
            role="dialog"
            aria-modal="true"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                pointerEvents: 'auto',
                zIndex: 1050
            }}
        >
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content" style={{ pointerEvents: 'auto' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Compose Mail</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">To</label>
                            <input type="text" className="form-control" value={to} onChange={(e) => setTo(e.target.value)} />
                            <div className="mt-2">
                                <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => setShowCc(!showCc)}>
                                    {showCc ? 'Hide Cc' : 'Add Cc'}
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowBcc(!showBcc)}>
                                    {showBcc ? 'Hide Bcc' : 'Add Bcc'}
                                </button>
                            </div>
                        </div>

                        {showCc && (
                            <div className="mb-3">
                                <label className="form-label">Cc</label>
                                <input type="text" className="form-control" value={cc} onChange={(e) => setCc(e.target.value)} />
                            </div>
                        )}

                        {showBcc && (
                            <div className="mb-3">
                                <label className="form-label">Bcc</label>
                                <input type="text" className="form-control" value={bcc} onChange={(e) => setBcc(e.target.value)} />
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label">Subject</label>
                            <input type="text" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Body</label>
                            <textarea className="form-control" rows="5" value={body} onChange={(e) => setBody(e.target.value)}></textarea>
                        </div>
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
