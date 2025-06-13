export default function UserCard({ user, onSignOut, darkMode }) {
  if (!user) return null; 

  const cardTheme = darkMode
    ? 'bg-dark text-light border-secondary'
    : 'bg-light text-dark border-secondary';

  return (
    <div className={`card ${cardTheme} mb-0`}>
      <div className="card-body p-3">
        <h6 className="card-title mb-1">{user.firstName} {user.lastName}</h6>
        <p className="card-text small mb-2">{user.mail}</p>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger w-100"
          onClick={onSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
