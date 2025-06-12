// controllers/mails.js

const Mail = require('../models/mails');
const { sendToCppServer } = require('../models/blacklist');
const {getUserByEmail} = require('../models/users');

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

  // Basic validation: must have at least one recipient or some content
  if (
    (!Array.isArray(to) || to.length === 0) &&
    (!Array.isArray(copy) || copy.length === 0) &&
    (!Array.isArray(blindCopy) || blindCopy.length === 0) &&
    !subject &&
    !body
  ) {
    return res.status(400).json({ error: 'Mail cannot be created - fields missing' });
  }
  if (getUserByEmail(from) === null) {
    return res.status(400).json({ error: 'Mail cannot be created - sender does not exist' });
  }

  if (to.some(email => getUserByEmail(email) === null)){
    return res.status(400).json({ error: 'Mail cannot be created - one or more recipients do not exist' });
  }
  
  // 1) Pull out any URLs from the body and subject
  const urlsInBody = extractUrls(body);
  const urlsInSubject = extractUrls(subject);

  // 2) Combine both lists of URLs
  const allUrls = [...urlsInBody, ...urlsInSubject];

  // 3) For each URL, check against the C++ blacklist service
  for (const url of allUrls) {
    try {
      // Send a "GET <url>" command to the blacklist server
      const response = await sendToCppServer(`GET ${url}`);

      // Pull out the last non-empty line (e.g. "true false" or "true true")
      const lines = response
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
      const lastLine = lines[lines.length - 1] || '';

      // If lastLine is exactly "true true" (case-insensitive), treat as blacklisted
      if (lastLine.toLowerCase() === 'true true') {
        return res
          .status(400)
          .json({ error: `Cannot create mail: link is blacklisted (${url})` });
      }
      // Otherwise ("true false" or anything else), continue
    } catch (err) {
      return res.status(400).json({ error: 'Blacklist service unavailable' });
    }
  }

  // 4) None of the URLs were blacklisted → create and return the new mail
  try {
    const newMail = Mail.createMail({ from, to, copy, blindCopy, subject, body });
    return res.status(201).json(newMail);
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
