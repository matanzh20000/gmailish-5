import React from 'react';
const MailCard = ({ mail }) => {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{mail.subject}</h5>
        <h6 className="card-subtitle mb-2 text-muted">From: {mail.from}</h6>
        <p className="card-text">{mail.body}</p>
        <small className="text-muted">{new Date(mail.timestamp).toLocaleString()}</small>
      </div>
    </div>
  );
};

export default MailCard;
