const express = require('express');
const router = express.Router();
const controller = require('../controllers/mails');


router.route('/:id')
    .get(controller.getMailById)
    .patch(controller.updateMail)
    .delete(controller.deleteMail);
router.route('/')
    .get(controller.getRecentMails) 
    .post(controller.createMail);   
router.route('/search/:query')
    .get(controller.searchMailsByQuery);
module.exports = router;