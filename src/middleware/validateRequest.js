const { body, validationResult } = require('express-validator');

exports.validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errorCode: "VALIDATION_ERROR",
        message: "Invalid input data",
        details: errors.array()
      });
    }
    next();
  }
];

exports.validateUpdateUser = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errorCode: "VALIDATION_ERROR",
        message: "Invalid input data",
        details: errors.array()
      });
    }
    next();
  }
];
