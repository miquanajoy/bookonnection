const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;