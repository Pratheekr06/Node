const { check, body } = require('express-validator');

module.exports = [
    check('title', 'Please enter a correct Title')
    .isString()
    .isLength(3),
    check('imageUrl', 'Image should be a URL')
    .isURL(),
    body('description', 'Description should be atleat 3 characters long')
    .isString()
    .trim()
    .isLength(5)
];