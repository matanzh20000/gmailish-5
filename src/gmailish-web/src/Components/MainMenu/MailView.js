import { useNavigate, useParams } from 'react-router-dom';

const MailView = ({ mails, darkMode }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mail = mails.find(m => m.id === parseInt(id));

    if (!mail) return <div className="p-4">Mail not found</div>;

    const theme = darkMode ? 'text-light bg-dark' : 'text-dark bg-white';

    return (
        <div className={`p-4 ${theme}`} style={{ width: '100%' }}>
            <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
                <i className="bi bi-x-lg"></i> Close
            </button>
            <h3 className="fw-bold">{mail.subject}</h3>
            <p><strong>From:</strong> {mail.from}</p>
            <hr />
            <p>{mail.body}</p>
        </div>
    );
};

export default MailView;
