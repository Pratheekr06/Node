
const User = require('../models/user');
const { check, body } = require('express-validator');

exports.signupValidation = [
    check('name').isString().withMessage('Name cannot be blank'),
    check('email')
    .isEmail()
    .withMessage('Please Enter a Valid Email ID')
    .custom((value, { req }) => {
        return User.findOne({email: value})
        .then(user => {
            if (user) return Promise.reject('User already exists, Please pick a different one')
        })
    }),
    body('password', 'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 char long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "i"),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password doesnot match')
            }
            return true
        }),
];

exports.loginValidation = [
    check('email')
    .isEmail()
    .withMessage('Please Enter a Valid Email ID'),
]