const express = require('express');
const router = express.Router();
const controller = require('../controllers/blacklist');


router.route('/').post(controller.createBlacklist);
router.route('/:id').delete(controller.deleteBlacklist);
module.exports = router;