const express = require('express');
const app = express();
const labelRoutes = require('./routes/labels');
const mailsRoutes = require('./routes/mails');
const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/tokens');
const blacklistRoutes = require('./routes/blacklist');
const cors = require('cors');
const mongoose = require('mongoose');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
const envPath = require('path').resolve(__dirname, '.env');
require('dotenv').config({ path: envPath });

mongoose.connect(process.env.CONNECTION_STRING);
console.log('Connected to MongoDB' + process.env.CONNECTION_STRING);

app.use(express.json());
app.use('/api/labels', labelRoutes);
app.use('/api/mails', mailsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/blacklist', blacklistRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});