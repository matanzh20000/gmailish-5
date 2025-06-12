
const MailItem = ({ mail, darkMode, timestampClass, isSelected, onToggleSelected }) => {
    const theme = darkMode
        ? { card: 'bg-dark text-light', checkbox: 'form-check-input bg-secondary' }
        : { card: 'bg-white text-dark', checkbox: 'form-check-input' };

    const preview = mail.body.length > 50
        ? mail.body.slice(0, 50) + '...'
        : mail.body;

    return (
        <div
            className={`card mb-2 ${theme.card}`}
            style={{
                transition: 'transform 0.15s ease',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0px)')}
        >
            <div className="card-body d-flex justify-content-between align-items-center py-2">
                <div className="d-flex align-items-center w-100" style={{ gap: '1rem' }}>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggleSelected}
                        className={theme.checkbox}
                        style={{ marginRight: '0.5rem' }}
                    />

                    <div className="d-flex w-100 align-items-center">
                        <div className="text-truncate" style={{ flexBasis: '20%', flexShrink: 0 }}>
                            <strong>{mail.from}</strong>
                        </div>
                        <div className="text-truncate ms-3" style={{ flexBasis: '30%', flexShrink: 0 }}>
                            <strong>{mail.subject}</strong>
                        </div>
                        <div className="text-truncate ms-3" style={{ flexBasis: '50%' }}>
                            {preview}
                        </div>
                    </div>
                </div>
                <small className={`ms-3 ${timestampClass}`}>
                    {new Date(mail.createdAt).toLocaleDateString()}
                </small>
            </div>
        </div>
    );
};

export default MailItem;
