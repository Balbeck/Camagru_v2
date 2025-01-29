const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

router.post('user/register', UserController.register);
router.post('user/login', UserController.login);
router.post('user/logout', UserController.logout);
router.post('user/updateSettings', UserController.update_settings);

module.exports = router;
