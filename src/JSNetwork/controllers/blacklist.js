const { sendToCppServer } = require('../models/blacklist');

exports.createBlacklist = async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const reply = await sendToCppServer(`POST ${url}`);
    return res.status(201).json({ message: reply });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to connect to C++ server' });
  }
};

exports.deleteBlacklist = async (req, res) => {
  const url = decodeURIComponent(req.params.id);

  try {
    const reply = await sendToCppServer(`DELETE ${url}`);
    return res.status(200).json({ message: reply });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to connect to C++ server' });
  }
};

exports.getBlacklistUrl = async (req, res) => {
  const url = decodeURIComponent(req.params.id);

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const reply = await sendToCppServer(`GET ${url}`);
    return res.status(200).json({ message: reply });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to connect to C++ server' });
  }
};
