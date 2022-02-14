const path = require('path');

const express = require('express');
const router = express.Router();

const { check, body } = require('express-validator');
const userValidation = require('../validation/userValidation');

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', userValidation.loginValidation, authController.postLogin);

router.post('/signup', userValidation.signupValidation, authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;