const { body } = require('express-validator');

const updateUserValidator = [
  body('role').optional().isIn(['viewer', 'analyst', 'admin']).withMessage('Role must be viewer, analyst, or admin'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  body().custom((value) => {
    if (!value.role && !value.status && !value.name) {
      throw new Error('At least one field is required: name, role, or status');
    }
    return true;
  }),
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
];

module.exports = {
  updateUserValidator,
};
