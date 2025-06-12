const NewLabelModal = ({ darkMode, value, onChange, onCancel, onSubmit }) => {
    const theme = darkMode
        ? {
            background: '#333558',
            text: 'text-light',
            primaryButton: 'btn btn-primary-dark'
        }
        : {
            background: '#cce6e6',
            text: 'text-dark',
            primaryButton: 'btn btn-primary-light'
        };

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ backgroundColor: theme.background, border: 'none' }}>
                    <div className={`modal-header ${theme.text}`} style={{ border: 'none' }}>
                        <h5 className="modal-title">New Label</h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>
                    <div className={`modal-body ${theme.text}`} style={{ border: 'none' }}>
                        <input
                            type="text"
                            className={`form-control ${theme.text}`}
                            placeholder="Enter label name"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            style={{ backgroundColor: darkMode ? '#555777' : '#ffffff' }}
                        />
                    </div>
                    <div className={`modal-footer ${theme.text}`} style={{ border: 'none' }}>
                        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                        <button className={theme.primaryButton} onClick={onSubmit}>Add Label</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewLabelModal;
