const express = require('express');
const app = express();
const labelRoutes = require('./routes/labels');
const mailsRoutes = require('./routes/mails');
const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/tokens');
const blacklistRoutes = require('./routes/blacklist');
const Mail = require('./models/mails');

app.use(express.json());
app.use('/api/labels', labelRoutes);
app.use('/api/mails', mailsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/blacklist', blacklistRoutes);

// // Start server
// app.listen(8080, () => {
//   console.log('Server listening on port 8080');
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
//   Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//  Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//    Mail.createMail({
//     from: 'alice@example.com',
//     to: ['bob@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com'],
//     subject: 'Welcome!',
//     body: 'Hey Bob, welcome to the platform.',
//   });

//   Mail.createMail({
//     from: 'bob@example.com',
//     to: ['alice@example.com'],
//     subject: 'Re: Welcome!',
//     body: 'Thanks Alice!',
//   });

// Mail.createMail({
//     from: 'alice@example.com',
//     to: ['shabi@example.com'],
//     copy: ['charlie@example.com'],
//     blindCopy: ['eve@example.com', 'bob@example.com' ],
//     subject: 'Welcome!',
//     body: 'Hi Shabi, would you like to hang out?.',
//   });
//   console.log('Sample mails created');
