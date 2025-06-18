const RecipientFields = ({ to, cc, bcc, showCc, showBcc, setTo, setCc, setBcc, setShowCc, setShowBcc }) => (
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

    {showCc && (
      <div className="mt-3">
        <label className="form-label">Cc</label>
        <input type="text" className="form-control" value={cc} onChange={(e) => setCc(e.target.value)} />
      </div>
    )}
    {showBcc && (
      <div className="mt-3">
        <label className="form-label">Bcc</label>
        <input type="text" className="form-control" value={bcc} onChange={(e) => setBcc(e.target.value)} />
      </div>
    )}
  </div>
);

export default RecipientFields;
