const Mail = require('../models/mails');

const createMail = async (mailData) => {
  const newMail = new Mail(mailData);
  return await newMail.save();
};

const getMailById = async (id) => {
  return await Mail.findById(id).lean();
};

const updateMail = async (id, changes) => {
  const newMail = await Mail.findById(id);
  if (!newMail) return null;

  const wasDraft = newMail.draft;
  const editableFields = ['to', 'copy', 'blindCopy', 'subject', 'body', 'draft', 'label'];
  let updated = false;

  editableFields.forEach(field => {
    if (changes[field] !== undefined) {
      newMail[field] = changes[field];
      updated = true;
    }
  });

  if (!wasDraft && Object.keys(changes).some(key => key !== 'label')) {
    throw new Error('Cannot modify a mail that has already been sent except for label.');
  }

  if (updated) {
    newMail.updatedAt = new Date();
    const saved = await newMail.save();

    if (wasDraft && changes.draft === false) {
      const allRecipients = [
        ...(newMail.to || []),
        ...(newMail.copy || []),
        ...(newMail.blindCopy || []),
      ];

      await Promise.all(
        allRecipients.map(email =>
          createMail({
            from: newMail.from,
            to: newMail.to,
            copy: newMail.copy,
            blindCopy: newMail.blindCopy,
            subject: newMail.subject,
            body: newMail.body,
            draft: false,
            label: ['Inbox'],
            owner: email,
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        )
      );
    }

    return saved;
  }

  return undefined;
};


const deleteMail = async (id) => {
  const newMail = await Mail.findByIdAndDelete(id).lean();
  return newMail || null;
};

const getMailsForUser = async (userEmail, limit = 50) => {
  return await Mail.find({ owner: userEmail })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

const searchMailsByQuery = async (query) => {
  if (!query || typeof query !== 'string') return [];
  const regex = new RegExp(query, 'i');

  return await Mail.find({
    $or: [
      { from: regex },
      { to: regex },
      { copy: regex },
      { blindCopy: regex },
      { subject: regex },
      { body: regex }
    ]
  }).lean();
};

module.exports = {
  createMail,
  getMailById,
  getMailsForUser,
  updateMail,
  deleteMail,
  searchMailsByQuery,
};
