const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const upload = require('../middleware/upload'); // path to your multer config
 


router.post('/', upload.single('avatar'), controller.createUser);
router.route('/:id').get(controller.getUserById);

module.exports = router;