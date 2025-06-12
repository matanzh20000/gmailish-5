const LabelItem = ({ label, darkMode, onSelect, onEdit, onDelete, isCustom, mails, isActive }) => {
  const textColor = darkMode ? 'text-light' : 'text-dark';
  const buttonClass = darkMode
    ? 'btn btn-outline-secondary-dark'
    : 'btn btn-outline-secondary-light';

  const count = label.count !== undefined
    ? label.count
    : mails?.filter(mail => mail.label === label.name).length || 0;

const activeClass = isActive
  ? darkMode
    ? 'bg-info border-4 text-white fw-bold'
    : 'bg-light border-4 fw-bold text-dark'
  : '';

  return (
    <div className="mb-1">
      <button
        className={`${buttonClass} ${textColor} ${activeClass} text-start w-100 d-flex justify-content-between align-items-center`}
        onClick={onSelect}
      >
        <div className="d-flex align-items-center ms-1">
          <i className={`${label.icon} me-2`}></i>
          {label.name}
        </div>
        {count > 0 && (
          <span
            className="badge rounded-pill ms-5"
            style={{
              backgroundColor: darkMode ? '#0088e9' : '#efae7e',
              color: darkMode ? 'black' : 'black',
              flexBasis: '15%'
            }}
          >
            {count}
          </span>
        )}
        {isCustom && (
          <div
            className="dropdown"
            onClick={(e) => e.stopPropagation()} // prevent main button from firing
          >
            <button
              className="btn btn-sm rounded-circle"
              style={{ backgroundColor: 'transparent', border: 'none' }}
              type="button"
              id={`dropdownMenu-${label.name}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenu-${label.name}`}>
              <li><button className="dropdown-item" onClick={() => onEdit(label)}>Change label</button></li>
              <li><button className="dropdown-item text-danger" onClick={() => onDelete(label)}>Delete label</button></li>
            </ul>
          </div>
        )}
      </button>
    </div>
  );
};

export default LabelItem;
