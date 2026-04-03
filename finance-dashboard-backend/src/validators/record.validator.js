const { body, query } = require('express-validator');

const createRecordValidator = [
  body('amount').notEmpty().withMessage('Amount is required').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('type').notEmpty().withMessage('Type is required').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be valid'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
];

const updateRecordValidator = [
  body().custom((value) => {
    const allowed = ['amount', 'type', 'category', 'date', 'notes'];
    const hasField = allowed.some((field) => Object.prototype.hasOwnProperty.call(value, field));
    if (!hasField) {
      throw new Error('At least one updatable field is required');
    }
    return true;
  }),
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('date').optional().isISO8601().withMessage('Date must be valid'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
];

const recordFilterValidator = [
  query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  query('startDate').optional().isISO8601().withMessage('startDate must be valid'),
  query('endDate').optional().isISO8601().withMessage('endDate must be valid'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be at least 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
];

module.exports = {
  createRecordValidator,
  updateRecordValidator,
  recordFilterValidator,
};
