const Mail = require('../models/mails');
const { sendToCppServer } = require('../models/blacklist');
const { getUserByMail } = require('../models/users');

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

  if (getUserByMail(from) === null) {
    return res.status(400).json({ error: 'Mail cannot be created - sender does not exist' });
  }

  const allRecipients = [...to, ...copy, ...blindCopy];

  if (!draft) {
    if (allRecipients.some(email => getUserByMail(email) === null)) {
      return res.status(400).json({ error: 'Mail cannot be created - one or more recipients do not exist' });
    }


    const urlsInBody = extractUrls(body);
    const urlsInSubject = extractUrls(subject);
    const allUrls = [...urlsInBody, ...urlsInSubject];

    for (const url of allUrls) {
      try {
        const response = await sendToCppServer(`GET ${url}`);
        const lines = response.trim().split('\n').map(line => line.trim()).filter(Boolean);
        const lastLine = lines[lines.length - 1] || '';

        if (lastLine.toLowerCase() === 'true true') {
          return res.status(400).json({ error: `Cannot create mail: link is blacklisted (${url})` });
        }
      } catch (err) {
        return res.status(400).json({ error: 'Blacklist service unavailable' });
      }
    }
  }

  try {
    const timestamp = new Date();

    const baseMail = {
      from,
      to,
      copy,
      blindCopy,
      subject,
      body,
      draft,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const sentMail = Mail.createMail({
      ...baseMail,
      label,
      owner: from
    });

    if (!draft) {
      const receiverMails = allRecipients.map(email => ({
        ...sentMail,
        id: sentMail.id,
        label: ['Inbox'],
        owner: email
      }));

      receiverMails.forEach(m => Mail.createMail(m));

      return res.status(201).json([sentMail, ...receiverMails]);
    } else {
      return res.status(201).json([sentMail]);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getRecentMails = (req, res) => {
  const userEmail = req.header('X-user');
  if (!userEmail) {
    return res.status(400).json({ error: 'Missing X-user header' });
  }

  try {
    const mails = Mail.getMailsForUser(userEmail);
    return res.status(200).json(mails);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getMailById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const mail = Mail.getMailById(id);

  if (!mail) {
    return res.status(404).json({ error: 'Mail not found' });
  }
  return res.status(200).json(mail);
};

exports.updateMail = (req, res) => {
  const id = parseInt(req.params.id, 10);
  let mail;

  try {
    mail = Mail.updateMail(id, req.body);
  } catch (err) {
    return res.status(400).json({ error: "invalid request body" });
  }

  if (mail == undefined) {
    return res.status(400).json({ error: "invalid request body" });
  }

  if (!mail) {
    return res.status(404).json({ error: 'Mail not found' });
  }
  return res.status(204).end();
};

exports.deleteMail = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = Mail.deleteMail(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Mail not found' });
  }
  return res.status(204).end();
};

exports.searchMailsByQuery = (req, res) => {
  const { query } = req.params;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const userEmail = req.header('X-user');
    if (!userEmail) {
      return res.status(400).json({ error: 'Missing X-user header' });
    }

    const allMatches = Mail.searchMailsByQuery(query);
    const filtered = allMatches.filter(m => m.owner === userEmail);
    const seen = new Set();
    const unique = filtered.filter(m => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    return res.status(200).json(unique);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
