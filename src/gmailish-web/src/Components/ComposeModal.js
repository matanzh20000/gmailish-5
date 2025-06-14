// src/Components/ComposeModal.js
import { useState } from 'react';

const ComposeModal = ({ show, onClose, onSend }) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = () => {
        onSend({ to, subject, body });
        setTo('');
        setSubject('');
        setBody('');
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : 'd-none'}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Compose Mail</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">To</label>
                            <input type="email" className="form-control" value={to} onChange={(e) => setTo(e.target.value)} />
                        </div>
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
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComposeModal;
