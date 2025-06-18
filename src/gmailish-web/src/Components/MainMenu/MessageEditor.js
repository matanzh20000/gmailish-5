const MessageEditor = ({ subject, body, setSubject, setBody }) => (
  <>
    <div className="mb-3">
      <label className="form-label">Subject</label>
      <input
        type="text"
        className="form-control"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Body</label>
      <textarea
        className="form-control"
        rows="5"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      ></textarea>
    </div>
  </>
);

export default MessageEditor;