const express = require('express');
const app = express();
const labelRoutes = require('./routes/labels');
const mailsRoutes = require('./routes/mails');
const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/tokens');
const blacklistRoutes = require('./routes/blacklist');
const Mail = require('./models/mails');
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


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