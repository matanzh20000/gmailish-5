import { useNavigate, useParams } from 'react-router-dom';
import StylePanel from "./StylePanel";

const MailView = ({ mails, darkMode }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mail = mails.find(m => m.id === parseInt(id));

    if (!mail) return <div className="p-4">Mail not found</div>;

    // Custom theme styles
    const backgroundColor = darkMode ? '#2a2d48' : '#f1f1f1';
    const textColor = darkMode ? '#f5f5f5' : '#202020';
    const metaColor = darkMode ? '#9aa0b1' : '#000000';

    return (
        <StylePanel>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto',
                    backgroundColor,
                    color: textColor,
                    padding: '2rem',
                    fontSize: '1.1rem',
                }}
            >
                {/* Top Bar */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button
                        onClick={() => navigate('/inbox')}
                        style={{
                            border: 'none',
                            backgroundColor: darkMode ? '#3d426a' : '#e0e4fa',
                            color: darkMode ? '#ffffff' : '#333',
                            borderRadius: '20%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: darkMode
                                ? '0 2px 4px rgba(0,0,0,0.6)'
                                : '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'background-color 0.3s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = darkMode ? '#4e568a' : '#d0d6f0';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = darkMode ? '#3d426a' : '#e0e4fa';
                        }}
                    >
                        <i className="bi bi-x-lg" style={{ fontSize: '1.2rem' }}></i>
                    </button>

                    <span style={{ fontSize: '0.95rem', color: metaColor }}>
                        {new Date(mail.createdAt).toLocaleString()}
                    </span>
                </div>

                {/* Subject */}
                <h2 className="fw-bold mb-3" style={{ fontSize: '1.6rem' }}>
                    {mail.subject}
                </h2>

                {/* From + Label */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <i className="bi bi-person-circle" style={{ fontSize: '1.2rem', color: metaColor }}></i>
                        <span style={{ fontWeight: 500 }}>From: {mail.from}</span>

                        {mail.copy?.length > 0 && (
                            <span style={{ fontWeight: 500, color: metaColor }}>
                                Cc: {mail.copy.join(', ')}
                            </span>
                        )}

                    </div>
                    {mail.label && (
                        <span
                            className="badge rounded-pill"
                            style={{
                                backgroundColor: darkMode ? '#4e5a8a' : '#efae7e',
                                color: darkMode ? '#fff' : '#333',
                                fontSize: '1rem',
                                padding: '0.5em 0.8em',
                            }}
                        >
                            {Array.isArray(mail.label) ? mail.label[0] : mail.label}
                        </span>
                    )}
                </div>

                <hr style={{ borderColor: darkMode ? '#444' : '#ccc' }} />

             {/* Body */}
                <div style={{
                    lineHeight: '1.75',
                    fontSize: '1.1rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                }}>
                    {mail.body}
                </div>
            </div>
        </StylePanel>
    );
};

export default MailView;