const { body, validationResult } = require('express-validator');

const { AppError } = require('../utils/appError.util');

const checkValidations = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
        const errorMessages = errors.array().map((err) => err.msg);

        const message = errorMessages.join('. ');

        return next(new AppError(message, 400));
    }

    next();
};

const createUserValidators = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters'),
    body('email').isEmail().withMessage('Must provide a valid email'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    checkValidations,
];

const createProductsValidators = [
    body('title')
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters'),
    body('description')
        .notEmpty()
        .withMessage('Description cannot be empty')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters'),
    body('quantity')
        .isInt()
        .withMessage('quantity must be a number')
        .notEmpty()
        .withMessage('quantity cannot be empty'),
    body('categoryId')
        .isInt()
        .withMessage('categoryId must be a number')
        .notEmpty()
        .withMessage('categoryId cannot be empty'),
    body('price')
        .isInt()
        .withMessage('price must be a number')
        .notEmpty()
        .withMessage('price cannot be empty'),

    checkValidations,
];

module.exports = { createUserValidators, createProductsValidators };
