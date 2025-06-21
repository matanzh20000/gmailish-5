const Mail = require('../services/mails');
const { sendToCppServer } = require('../models/blacklist');
const { getUserByMail } = require('../services/users');

function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
}

exports.createMail = async (req, res) => {
  const {
    from,
    to = [],
    copy = [],
    blindCopy = [],
    subject = '',
    body = '',
    draft = false,
    label = draft ? ['Drafts'] : ['Sent']
  } = req.body;

  if (
    (!Array.isArray(to) || to.length === 0) &&
    (!Array.isArray(copy) || copy.length === 0) &&
    (!Array.isArray(blindCopy) || blindCopy.length === 0) &&
    !subject &&
    !body
  ) {
    return res.status(400).json({ error: 'Mail cannot be created - fields missing' });
  }

  if (await getUserByMail(from) === null) {
    return res.status(400).json({ error: 'Mail cannot be created - sender does not exist' });
  }

  const allRecipients = [...to, ...copy, ...blindCopy];

  if (!draft) {
    for (const email of allRecipients) {
      if (await getUserByMail(email) === null) {
        return res.status(400).json({ error: `Mail cannot be created - recipient ${email} does not exist` });
      }
    }

    const urls = [...extractUrls(body), ...extractUrls(subject)];
    for (const url of urls) {
      try {
        const response = await sendToCppServer(`GET ${url}`);
        const lastLine = response.trim().split('\n').pop();
        if (lastLine && lastLine.toLowerCase() === 'true true') {
          return res.status(400).json({ error: `Cannot create mail: link is blacklisted (${url})` });
        }
      } catch (err) {
        return res.status(400).json({ error: 'Blacklist service unavailable' });
      }
    }
  }

  const timestamp = new Date();
  const baseMail = {
    from, to, copy, blindCopy, subject, body, draft, label,
    owner: from, isRead: false, createdAt: timestamp, updatedAt: timestamp
  };

  try {
    const sentMail = await Mail.createMail(baseMail);

    if (!draft) {
      const receivers = await Promise.all(allRecipients.map(email => Mail.createMail({
        ...baseMail,
        label: ['Inbox'],
        owner: email
      })));
      return res.status(201).json([sentMail, ...receivers]);
    } else {
      return res.status(201).json([sentMail]);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getRecentMails = async (req, res) => {
  const userEmail = req.header('X-user');
  if (!userEmail) return res.status(400).json({ error: 'Missing X-user header' });

  try {
    const mails = await Mail.getMailsForUser(userEmail);
    return res.status(200).json(mails);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getMailById = async (req, res) => {
  try {
    const mail = await Mail.getMailById(req.params.id);
    if (!mail) return res.status(404).json({ error: 'Mail not found' });
    return res.status(200).json(mail);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateMail = async (req, res) => {
  try {
    const mail = await Mail.updateMail(req.params.id, req.body);
    if (mail === undefined) return res.status(400).json({ error: 'Invalid request body' });
    if (!mail) return res.status(404).json({ error: 'Mail not found' });
    return res.status(204).end();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteMail = async (req, res) => {
  try {
    const deleted = await Mail.deleteMail(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Mail not found' });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.searchMailsByQuery = async (req, res) => {
  const { query } = req.params;
  const userEmail = req.header('X-user');
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });
  if (!userEmail) return res.status(400).json({ error: 'Missing X-user header' });

  try {
    const allMatches = await Mail.searchMailsByQuery(query);
    const filtered = allMatches.filter(m => m.owner === userEmail);
    const seen = new Set();
    const unique = filtered.filter(m => {
      if (seen.has(m._id.toString())) return false;
      seen.add(m._id.toString());
      return true;
    });

    return res.status(200).json(unique);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
