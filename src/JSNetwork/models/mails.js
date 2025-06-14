// models/mails.js

const mails = [];
let idCounter = 0;

/**
 * Create a new mail. Returns the new mail object.
 */
const createMail = ({
  from,
  to = [],
  copy = [],
  blindCopy = [],
  subject = '',
  body = '',
  label = ['Inbox'],
  draft = false,
  owner = from,
  createdAt = new Date(),
}) => {
  const timestamp = createdAt;
  const newMail = {
    id: ++idCounter,
    from,
    to,
    copy,
    blindCopy,
    subject,
    body,
    label,
    draft,
    isRead: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    owner, // NEW FIELD
  };
  mails.push(newMail);
  return newMail;
};


/**
 * Get a single mail by its numeric ID, or null if not found.
 */
const getMailById = (id) => {
  return mails.find(mail => mail.id === id) || null;
};

/**
 * Update an existing mail (only if it's still a draft).
 * Throws an error if trying to modify a sent mail.
 */
const updateMail = (id, changes) => {
  let exists = 0;
  const mail = getMailById(id);
  if (!mail) return null;

  if (!mail.draft) {
    throw new Error('Cannot modify a mail that has already been sent.');
  }

  const editableFields = ['to', 'copy', 'blindCopy', 'subject', 'body', 'draft'];
  editableFields.forEach(field => {
    if (changes[field] !== undefined) {
      exists = 1;
      mail[field] = changes[field];
    }
  });

  if(exists){
    mail.updatedAt = new Date();
    return mail;
  }
  return undefined;
};

/**
 * Delete a mail by ID. Returns the deleted mail, or null if not found.
 */
const deleteMail = (id) => {
  const index = mails.findIndex(mail => mail.id === id);
  if (index === -1) return null;
  const [removed] = mails.splice(index, 1);
  return removed;
};

/**
 * Get recent mails for a given user (as sender or recipient), sorted
 * descending by creation time, limited to the most recent 50 by default.
 */
const getMailsForUser = (userEmail, limit = 50) => {
    console.log('[DEBUG] Fetching mails for', userEmail);
  return mails
    .filter(mail => mail.owner === userEmail)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
};

/**
 * Search all mails for any occurrence of `query` (case-insensitive) within:
 *   - mail.from
 *   - any entry in mail.to
 *   - any entry in mail.copy
 *   - any entry in mail.blindCopy
 *   - mail.subject
 *   - mail.body
 *
 * Returns an array of matching mail objects.
 */
const searchMailsByQuery = (query) => {
  if (!query || typeof query !== 'string') return [];
  const lower = query.toLowerCase();

  return mails.filter(mail => {
    // Check `from`
    if (mail.from && mail.from.toLowerCase().includes(lower)) {
      return true;
    }
    // Check arrays: to, copy, blindCopy
    const arraysToCheck = [mail.to, mail.copy, mail.blindCopy];
    for (const arr of arraysToCheck) {
      if (Array.isArray(arr)) {
        for (const str of arr) {
          if (str && str.toLowerCase().includes(lower)) {
            return true;
          }
        }
      }
    }
    // Check subject
    if (mail.subject && mail.subject.toLowerCase().includes(lower)) {
      return true;
    }
    // Check body
    if (mail.body && mail.body.toLowerCase().includes(lower)) {
      return true;
    }
    return false;
  });
};

module.exports = {
  createMail,
  getMailById,
  getMailsForUser,
  updateMail,
  deleteMail,
  searchMailsByQuery,
};
