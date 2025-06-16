import { useState } from 'react';

const ToolbarItem = ({
    darkMode,
    selectedCount,
    allSelected,
    onToggleSelectAll,
    labels,
    onAssignLabel,
    visibleMailCount,
    onDeleteMails
}) => {
    const theme = darkMode
        ? {
            background: '#333558',
            text: 'text-light',
            icon: 'text-info',
            checkbox: 'form-check-input text-info'
        }
        : {
            background: '#cce6e6',
            text: 'text-dark',
            icon: 'text-primary',
            checkbox: 'form-check-input text-primary'
        };

    const [dropDown, setDropdownOpen] = useState(false);

    const handleLabelSelect = (labelName) => {
        setDropdownOpen(false);
        onAssignLabel(labelName);
    };

    return (
        <div
            className={`d-flex align-items-center justify-content-between px-4 py-3 transition-theme ${darkMode ? 'toolbar-dark' : 'toolbar-light'} ${theme.text}`}
            style={{
                marginBottom: '12px',
                border: 'none'
            }}
        >
            <div className="d-flex align-items-center gap-3">
                {visibleMailCount > 0 && (
                    <input
                        className={`${theme.checkbox}`}
                        type="checkbox"
                        checked={allSelected}
                        onChange={onToggleSelectAll}
                    />
                )}

                <div
                    className="d-flex align-items-center gap-3"
                    style={{
                        opacity: selectedCount > 0 ? 1 : 0,
                        visibility: selectedCount > 0 ? 'visible' : 'hidden',
                        transition: 'opacity 0.3s ease, visibility 0.3s ease'
                    }}
                >
                    {/* Move to Label Dropdown */}
                    <div className="dropdown">
                        <button
                            className={`btn btn-sm dropdown-toggle ${theme.icon}`}
                            type="button"
                            id="moveLabelDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-folder2" style={{ fontSize: '1.2rem' }}></i>
                        </button>

                        <ul className="dropdown-menu" aria-labelledby="moveLabelDropdown">
                            {labels.map((label) => (
                                <li key={label}>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => handleLabelSelect(label)}
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                    </div>

                    <button
                        className={`btn btn-sm ${theme.icon}`}
                        title="Delete Mail"
                        onClick={onDeleteMails} 
                    >
                        <i className="bi bi-trash" style={{ fontSize: '1.2rem' }}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToolbarItem;
