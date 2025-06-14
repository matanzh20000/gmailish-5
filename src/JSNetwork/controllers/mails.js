// controllers/mails.js

const Mail = require('../models/mails');
const { sendToCppServer } = require('../models/blacklist');
const {getUserByMail} = require('../models/users');

/**
 * Extracts all “http://…”, “https://…”, or “www.…” links from a block of text.
 * Returns an array of matched URL strings.
 */
function extractUrls(text) {
  // Use a global regex to find any substring starting with http:// or https:// or www.
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
}

exports.createMail = async (req, res) => {
  const { from, to = [], copy = [], blindCopy = [], subject = '', body = '' } = req.body;

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

  if (to.some(email => getUserByMail(email) === null)) {
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

  try {
    const timestamp = new Date().toISOString();

    // 1. Create sender's copy with label "Sent"
    const senderMail = Mail.createMail({
      from,
      to,
      copy,
      blindCopy,
      subject,
      body,
      label: ['Sent'],
      owner: from,
      date: timestamp,
    });

    // 2. Create receiver mails (Inbox)
    const allRecipients = [...to, ...copy, ...blindCopy];
    const receiverMails = allRecipients.map(email =>
      Mail.createMail({
        from,
        to,
        copy,
        blindCopy,
        subject,
        body,
        label: ['Inbox'],
        owner: email,
        date: timestamp,
      })
    );

  return res.status(201).json([senderMail, ...receiverMails]);
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
    return res.status(400).json({ error : "invalid request body"});
  }

  if(mail == undefined){
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

/**
 * New: Search mails by a substring in any field.
 * GET /api/mails/search/:query
 */
exports.searchMailsByQuery = (req, res) => {
  const { query } = req.params;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = Mail.searchMailsByQuery(query);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
